import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import supportRoutes from "./routes/support";
import trainingUploadRoutes from "./api/training/upload";
import instructorRoutes from "./routes/instructor";
import {
  securityHeaders,
  generalLimiter,
  loginLimiter
} from "./security-middleware";


const app = express();

// Enhanced security middleware (disable in development for Vite compatibility)
if (process.env.NODE_ENV === 'production') {
  app.use(securityHeaders);
  app.use(generalLimiter);
  app.use('/api/auth/login', loginLimiter);
}

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Basic rate limiting - more permissive for development
const requestCounts = new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 1000; // Increased limit for development
  
  // Skip rate limiting for localhost and development
  if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || process.env.NODE_ENV === 'development') {
    return next();
  }
  
  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
  } else {
    const userData = requestCounts.get(ip);
    if (now > userData.resetTime) {
      userData.count = 1;
      userData.resetTime = now + windowMs;
    } else {
      userData.count++;
      if (userData.count > maxRequests) {
        return res.status(429).json({ error: 'Too many requests' });
      }
    }
  }
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Test database connection before starting server
  try {
    const { testDatabaseConnection } = await import("./db");
    const dbConnected = await testDatabaseConnection();
    if (!dbConnected) {
      console.error('Failed to connect to database. Server startup aborted.');
      process.exit(1);
    }
  } catch (error) {
    console.error('Database connection test failed:', error);
    process.exit(1);
  }

  // Serve uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  
  // Register support routes
  app.use("/api/support", supportRoutes);
  
  // Register training upload routes
  app.use("/api", trainingUploadRoutes);
  
  // Register instructor routes
  app.use("/api/instructor", instructorRoutes);
  
  // Register admin auth routes
  const adminAuthRoutes = await import("./routes/admin-auth");
  app.use("/api/auth", adminAuthRoutes.default);
  
  // Serve admin authentication test page
  app.get("/admin-auth-test", (req, res) => {
    res.sendFile(path.join(__dirname, "../test-admin-auth.html"));
  });
  
  // Serve admin login page
  app.get("/admin-login", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin-login.html"));
  });
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, async () => {
    log(`serving on port ${port}`);
    
    // Initialize email automation cron jobs
    if (process.env.BREVO_API_KEY) {
      try {
        await import('./cronEmail');
        console.log('✅ Email automation cron jobs started');
      } catch (error) {
        console.log('Email automation initialization failed:', error instanceof Error ? error.message : error);
      }
    } else {
      console.log('⚠️  BREVO_API_KEY not found, email automation disabled');
    }
    
    // Initialize clone detector after server starts
    setTimeout(async () => {
      try {
        const { initializeCloneDetector } = await import("./init-clone-detector");
        // Function will self-execute
      } catch (error) {
        console.log('Clone detector initialization skipped:', error instanceof Error ? error.message : error);
      }
    }, 3000);
  });
})();
