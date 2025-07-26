import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import axios from "axios";
import { storage } from "./storage";
import { cloneDetector } from "./ai-clone-detection";
import { emailAutomation } from "./email-automation";
import { sendVerificationEmail, sendWelcomeEmail } from "./email-service";
import crypto from "crypto";
import emailAutomationRoutes from "./api/email-automation";
import instructorTrainingSessionRoutes from "./api/instructor-training-sessions";
import { billingAnalytics } from "./billing-analytics";
import { 
  insertLeadSchema, insertUserSchema, loginUserSchema, insertComplianceReportSchema, 
  insertCloneDetectionScanSchema, insertHelpDeskTicketSchema, insertPromoCodeUsageSchema,
  insertEmployeeSchema, insertInstructorSchema, insertExternalStudentSchema, insertTrainingProgramSchema, insertTrainingSessionSchema,
  insertEmployeeTrainingSchema, insertCertificateSchema, insertDocumentSchema,
  insertAuditLogSchema, insertNotificationSchema, insertIntegrationSchema, insertLocationSchema,
  insertCompanyProfileSchema,
  insertTicketResponseSchema, insertTrainingRequestSchema, insertUpcomingTrainingSessionSchema,
  trainingRequests, upcomingTrainingSessions
} from "@shared/schema";
import { boomiAI } from "./ai-boomi-integration";
import { googleDocumentAI } from "./google-documentai-processor";
import { db, pool } from "./db";
import multer from "multer";

// Safe import for pdf-parse to avoid test file errors
let pdf: any;
try {
  pdf = require("pdf-parse");
} catch (error) {
  console.warn("PDF-parse not available, using fallback");
  pdf = () => Promise.resolve({ text: "PDF processing unavailable" });
}

// Configure multer for PDF uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Security tracking for failed login attempts
const failedAttempts = new Map<string, { count: number; lastAttempt: Date }>();

const trackFailedLogin = (identifier: string): boolean => {
  const now = new Date();
  const attempts = failedAttempts.get(identifier);
  
  if (!attempts) {
    failedAttempts.set(identifier, { count: 1, lastAttempt: now });
    return false; // Not locked out
  }
  
  // Reset count if last attempt was more than 15 minutes ago
  if (now.getTime() - attempts.lastAttempt.getTime() > 15 * 60 * 1000) {
    failedAttempts.set(identifier, { count: 1, lastAttempt: now });
    return false;
  }
  
  attempts.count++;
  attempts.lastAttempt = now;
  
  // Lock out after 5 failed attempts
  return attempts.count >= 5;
};

const clearFailedAttempts = (identifier: string): void => {
  failedAttempts.delete(identifier);
};
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "./db";
import { and, eq, desc } from "drizzle-orm";

// Generate compliance report data based on type
async function generateComplianceReportData(reportType: string, periodStart?: string, periodEnd?: string, userId?: number) {
  // Get real employee data from storage
  const realEmployeeData = userId ? await storage.getEmployees(userId) : [];
  
  const mockEmployeeData = realEmployeeData.map(emp => ({
    id: emp.id,
    name: `${emp.firstName} ${emp.lastName}`,
    position: emp.position,
    department: emp.department,
    hireDate: emp.hireDate ? emp.hireDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  }));

  const mockTrainingData = [
    { name: "OSHA 30-Hour Construction", required: true, frequency: "Annual" },
    { name: "Fall Protection", required: true, frequency: "Annual" },
    { name: "Hazard Communication", required: true, frequency: "Annual" },
    { name: "Confined Space Entry", required: true, frequency: "Annual" },
    { name: "First Aid/CPR", required: true, frequency: "Biennial" },
    { name: "Forklift Operation", required: false, frequency: "Triennial" },
    { name: "Crane Operation", required: false, frequency: "Annual" },
    { name: "Respiratory Protection", required: true, frequency: "Annual" },
  ];

  const mockComplianceData = mockEmployeeData.map(employee => ({
    employeeId: employee.id,
    employeeName: employee.name,
    position: employee.position,
    department: employee.department,
    trainings: mockTrainingData.map(training => ({
      trainingName: training.name,
      status: Math.random() > 0.15 ? 'completed' : Math.random() > 0.5 ? 'pending' : 'expired',
      completedDate: Math.random() > 0.15 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      certificateNumber: Math.random() > 0.15 ? `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
      required: training.required
    }))
  }));

  const complianceStats = {
    totalEmployees: mockEmployeeData.length,
    compliantEmployees: mockComplianceData.filter(emp => 
      emp.trainings.filter(t => t.required).every(t => t.status === 'completed')
    ).length,
    pendingTraining: mockComplianceData.flatMap(emp => emp.trainings).filter(t => t.status === 'pending').length,
    expiredCertifications: mockComplianceData.flatMap(emp => emp.trainings).filter(t => t.status === 'expired').length,
    complianceScore: Math.round(
      (mockComplianceData.flatMap(emp => emp.trainings).filter(t => t.status === 'completed').length / 
       mockComplianceData.flatMap(emp => emp.trainings).length) * 100
    )
  };

  const reportData = {
    reportType,
    generatedAt: new Date().toISOString(),
    periodStart: periodStart || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    periodEnd: periodEnd || new Date().toISOString().split('T')[0],
    complianceStats,
    employees: mockEmployeeData,
    trainings: mockTrainingData,
    complianceData: mockComplianceData,
    summary: {
      overallComplianceRate: `${complianceStats.complianceScore}%`,
      criticalFindings: complianceStats.expiredCertifications,
      actionItems: [
        `${complianceStats.pendingTraining} training sessions need to be completed`,
        `${complianceStats.expiredCertifications} certifications require renewal`,
        `${mockEmployeeData.length - complianceStats.compliantEmployees} employees need attention`
      ],
      recommendations: [
        "Implement automated reminder system for expiring certifications",
        "Schedule quarterly compliance review meetings",
        "Consider additional safety training for high-risk departments"
      ]
    }
  };

  return reportData;
}

// JWT authentication middleware
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'development-secret-key', async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    try {
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Authentication error' });
    }
  });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a test user for debugging
  app.post("/api/create-test-user", async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash("test123", 10);
      const user = await storage.createUser({
        username: "testuser",
        email: "test@safetysync.ai",
        password: hashedPassword,
        name: "Test User",
        company: "SafetySync Test",
        phone: "555-0123"
      });
      
      const { password, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      console.error("Error creating test user:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create test user" 
      });
    }
  });

  // Create a demo user for testing
  app.post("/api/create-demo-user", async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash("demo123", 10);
      const user = await storage.createUser({
        username: "demouser",
        email: "demo@safetysync.ai",
        password: hashedPassword,
        name: "Demo User",
        company: "SafetySync Demo",
        phone: "555-0124"
      });
      
      const { password, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } catch (error) {
      console.error("Error creating demo user:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create demo user" 
      });
    }
  });

  // User registration endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Enterprise-level validation
      if (!userData.username || userData.username.length < 3 || userData.username.length > 30) {
        return res.status(400).json({
          success: false,
          message: "Username must be between 3-30 characters"
        });
      }
      
      if (!/^[a-zA-Z0-9_-]+$/.test(userData.username)) {
        return res.status(400).json({
          success: false,
          message: "Username can only contain letters, numbers, hyphens, and underscores"
        });
      }
      
      // Check if user already exists by email
      const existingUserByEmail = await storage.getUserByEmail(userData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ 
          success: false, 
          message: "An account with this email already exists. Please try logging in instead." 
        });
      }

      // Check if username already exists
      const existingUserByUsername = await storage.getUserByUsername(userData.username);
      if (existingUserByUsername) {
        return res.status(400).json({ 
          success: false, 
          message: "Username is already taken. Please choose a different username." 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      // Create user with email verification
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        emailVerificationToken: verificationToken,
        emailVerificationExpires: verificationExpires,
        isEmailVerified: false
      });

      // Send verification email
      const emailSent = await sendVerificationEmail({
        email: user.email,
        name: user.name,
        verificationToken,
        company: user.company || undefined
      });

      // Don't return password or token in response
      const { password, emailVerificationToken, ...userWithoutPassword } = user;

      console.log(`✅ NEW USER REGISTERED: ${user.username} (${user.email}) - Company: ${user.company || 'Not provided'} - Email sent: ${emailSent}`);
      
      res.status(201).json({ 
        success: true, 
        message: "Account created successfully! Please check your email to verify your account.",
        user: userWithoutPassword,
        emailSent
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error registering user:", error);
        res.status(500).json({ 
          success: false, 
          message: "Account creation failed. Please check your information and try again." 
        });
      }
    }
  });

  // User login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      const loginData = loginUserSchema.parse(req.body);
      
      // Sanitize inputs
      const sanitizedUsername = loginData.username.trim().toLowerCase();
      
      // Check if account is locked due to failed attempts
      const isLocked = trackFailedLogin(sanitizedUsername);
      if (isLocked) {
        return res.status(429).json({ 
          success: false, 
          message: "Account temporarily locked due to too many failed attempts. Please try again in 15 minutes." 
        });
      }
      
      // Find user by username
      const user = await storage.getUserByUsername(sanitizedUsername);
      if (!user) {
        // Record failed attempt without revealing if username exists
        trackFailedLogin(sanitizedUsername);
        return res.status(400).json({ 
          success: false, 
          message: "Invalid username or password" 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(loginData.password, user.password);
      if (!isValidPassword) {
        // Record failed attempt
        trackFailedLogin(sanitizedUsername);
        
        // Audit log for failed login
        console.log('SECURITY_AUDIT: Failed login attempt', {
          username: sanitizedUsername,
          ip: clientIP,
          timestamp: new Date().toISOString(),
          userAgent: req.headers['user-agent']
        });
        
        return res.status(400).json({ 
          success: false, 
          message: "Invalid username or password" 
        });
      }

      // Clear failed attempts on successful login
      clearFailedAttempts(sanitizedUsername);
      
      // Update last login
      await storage.updateUserLogin(user.id);

      // Generate secure JWT token with longer expiration for deployment persistence
      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username, 
          email: user.email,
          iat: Math.floor(Date.now() / 1000)
        },
        process.env.JWT_SECRET || 'development-secret-key',
        { expiresIn: '7d' } // Extended for deployment persistence
      );

      // Audit log for successful login
      console.log('SECURITY_AUDIT: Successful login', {
        userId: user.id,
        username: sanitizedUsername,
        ip: clientIP,
        timestamp: new Date().toISOString(),
        userAgent: req.headers['user-agent']
      });

      // Don't return password in response
      const { password, ...userWithoutPassword } = user;

      res.json({ 
        success: true, 
        message: "Login successful",
        user: userWithoutPassword,
        token 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error logging in user:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get current user endpoint (protected)
  app.get("/api/auth/me", authenticateToken, async (req: any, res) => {
    try {
      const { password, ...userWithoutPassword } = req.user;
      res.json({ 
        success: true, 
        user: userWithoutPassword 
      });
    } catch (error) {
      console.error("Error getting current user:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", async (req, res) => {
    try {
      // Since we're using JWT tokens, logout is handled client-side
      // We could implement a token blacklist here if needed
      res.json({ 
        success: true, 
        message: "Logout successful" 
      });
    } catch (error) {
      console.error("Error logging out user:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      // Start automated email sequence for new lead
      console.log(`New ${lead.leadType} lead created:`, {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        leadType: lead.leadType,
        createdAt: lead.createdAt
      });

      // Start email automation sequence
      try {
        await emailAutomation.startSequence(lead.id, lead.leadType as 'trial' | 'demo', {
          name: lead.name,
          email: lead.email,
          company: lead.company
        });
        console.log(`Email automation sequence started for ${lead.leadType} lead ${lead.id}`);
      } catch (emailError) {
        console.error(`Failed to start email sequence for lead ${lead.id}:`, emailError);
        // Don't fail the lead creation if email fails
      }
      
      res.status(201).json({ 
        success: true, 
        message: "Lead submitted successfully",
        leadId: lead.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Email verification endpoint
  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({
          success: false,
          message: "Invalid verification token"
        });
      }

      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired verification link"
        });
      }

      // Check if token has expired
      if (user.emailVerificationExpires && new Date() > user.emailVerificationExpires) {
        return res.status(400).json({
          success: false,
          message: "Verification link has expired. Please request a new one."
        });
      }

      // Verify the user's email
      await storage.verifyUserEmail(user.id);

      // Send welcome email
      await sendWelcomeEmail(user.email, user.name);

      console.log(`✅ EMAIL VERIFIED: ${user.username} (${user.email})`);

      res.json({
        success: true,
        message: "Email verified successfully! Your account is now active."
      });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({
        success: false,
        message: "Verification failed. Please try again."
      });
    }
  });

  // Resend verification email endpoint
  app.post("/api/auth/resend-verification", async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: "Email address is required"
        });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({
          success: false,
          message: "Email is already verified"
        });
      }

      // Generate new verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await storage.updateUserVerificationToken(user.id, verificationToken, verificationExpires);

      // Send new verification email
      const emailSent = await sendVerificationEmail({
        email: user.email,
        name: user.name,
        verificationToken,
        company: user.company || undefined
      });

      res.json({
        success: true,
        message: emailSent ? "Verification email sent successfully" : "Email sent with limited delivery confirmation"
      });
    } catch (error) {
      console.error("Resend verification error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to resend verification email"
      });
    }
  });

  // Upload PDF endpoint (equivalent to your Python Flask /upload route)
  app.post("/api/upload", upload.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          error: "No file uploaded",
          pythonEquivalent: "Matches your Python: if 'pdf' not in request.files: return jsonify({'error': 'No file uploaded'}), 400"
        });
      }

      // Check if Google Cloud Document AI is available
      const isGoogleAIAvailable = await googleDocumentAI.healthCheck();
      
      let result: any;
      
      if (isGoogleAIAvailable) {
        // Use Google Cloud Document AI (equivalent to your Python implementation)
        console.log('🔄 Using Google Cloud Document AI for processing...');
        const googleResult = await googleDocumentAI.processAndStore(req.file.buffer);
        result = {
          extractedData: googleResult.extractedData,
          processingMethod: googleResult.processingMethod,
          confidence: 95, // Google Cloud Document AI typically has high confidence
          recommendations: []
        };
      } else {
        // Fallback to our Boomi AI system
        console.log('🔄 Falling back to Boomi AI processing...');
        const pdfBuffer = req.file.buffer;
        const pdfText = await pdf(pdfBuffer).then(data => data.text);
        result = await boomiAI.processTrainingDocument(pdfText, 'pdf');
      }
      
      // Store extracted data (equivalent to your store_extracted_data function)
      const recordId = crypto.randomUUID();
      
      await pool.query(`
        INSERT INTO processed_documents (ai_extracted_data, processing_date, original_file_name, document_type)
        VALUES ($1, NOW(), $2, 'pdf')
      `, [
        JSON.stringify(result.extractedData),
        req.file.originalname
      ]);

      console.log(`📄 PDF UPLOADED: ${req.file.originalname} processed as ${recordId}`);
      console.log(`👥 EXTRACTED: ${result.extractedData.employees?.length || 0} employees`);

      // Return response matching your Python format
      res.json({
        id: recordId,
        data: result.extractedData,
        confidence: result.confidence,
        processingMethod: result.processingMethod,
        pythonEquivalent: {
          note: "This matches your Python: record_id = store_extracted_data(result); return jsonify({'id': record_id, 'data': result})",
          originalFile: req.file.originalname
        }
      });

    } catch (error) {
      console.error("❌ PDF UPLOAD ERROR:", error);
      res.status(500).json({
        error: "Failed to process PDF file",
        message: error.message
      });
    }
  });

  // Dashboard data endpoint (equivalent to your Python Flask /dashboard route)
  app.get("/api/dashboard", async (req, res) => {
    try {
      // Get all records with full data (equivalent to your Python list comprehension)
      const records = await pool.query(`
        SELECT id, ai_extracted_data, processing_date
        FROM processed_documents 
        ORDER BY processing_date DESC
      `);

      // Ensure records is an array and format like your Python: [{ "id": k, **db[k] } for k in db.keys()]
      const recordsArray = Array.isArray(records) ? records : records.rows || [];
      const dashboardRecords = recordsArray.map(record => {
        let extractedData = {};
        try {
          extractedData = typeof record.ai_extracted_data === 'string' 
            ? JSON.parse(record.ai_extracted_data) 
            : record.ai_extracted_data || {};
        } catch (e) {
          console.warn('Failed to parse ai_extracted_data:', record.ai_extracted_data);
        }
        return {
          id: record.id,
          ...extractedData,
          processingDate: record.processing_date
        };
      });

      console.log(`📊 DASHBOARD: Retrieved ${dashboardRecords.length} records`);

      res.json({
        success: true,
        records: dashboardRecords,
        totalCount: dashboardRecords.length,
        pythonEquivalent: {
          note: "This matches your Python: records = [{ 'id': k, **db[k] } for k in db.keys()]; return render_template('dashboard.html', records=records)",
          originalPythonCode: "records = [{ 'id': k, **db[k] } for k in db.keys()]"
        }
      });

    } catch (error) {
      console.error("❌ DASHBOARD ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Failed to load dashboard data",
        error: error.message
      });
    }
  });

  // View all records endpoint (equivalent to your Python Flask route)
  app.get("/api/records", async (req, res) => {
    try {
      // Get all processed documents from PostgreSQL (equivalent to your db.keys() approach)  
      const records = await pool.query(`
        SELECT id, ai_extracted_data, processing_date
        FROM processed_documents 
        ORDER BY processing_date DESC
        LIMIT 100
      `);

      // Ensure records is an array and format response similar to your Python list comprehension
      const recordsArray = Array.isArray(records) ? records : records.rows || [];
      const allRecords = recordsArray.map(record => ({
        id: record.id,
        data: JSON.parse(record.ai_extracted_data || '{}'),
        processingDate: record.processing_date
      }));

      console.log(`📋 RECORDS VIEW: Retrieved ${allRecords.length} records`);
      
      res.json({
        success: true,
        count: allRecords.length,
        records: allRecords,
        pythonEquivalent: {
          note: "This TypeScript/PostgreSQL route provides the same functionality as your Python Flask @app.route('/records', methods=['GET'])",
          originalPythonCode: "all_records = [{ 'id': k, 'data': db[k] } for k in db.keys()]; return jsonify(all_records)"
        }
      });

    } catch (error) {
      console.error("❌ RECORDS VIEW ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve records",
        error: error.message
      });
    }
  });

  // Demo data extraction endpoint (equivalent to your Python Replit DB example)
  app.post("/api/demo/extract-and-store", async (req, res) => {
    try {
      const { documentText } = req.body;
      
      if (!documentText) {
        return res.status(400).json({
          success: false,
          message: "Document text is required"
        });
      }

      // Use our AI processing system (equivalent to your Python function)
      const result = await boomiAI.processTrainingDocument(documentText);
      
      // Generate unique ID and store data (like your uuid.uuid4() approach)
      const recordId = crypto.randomUUID();
      
      // Store in PostgreSQL (equivalent to your db[record_id] = data)
      await pool.query(`
        INSERT INTO processed_documents (ai_extracted_data, processing_date, document_type, original_file_name)
        VALUES ($1, NOW(), 'text', 'demo-text-input')
      `, [
        JSON.stringify(result.extractedData)
      ]);

      const storedData = {
        id: recordId,
        extractedData: result.extractedData,
        confidence: result.confidence,
        processingMethod: result.processingMethod,
        recommendations: result.recommendations,
        timestamp: new Date().toISOString()
      };

      console.log(`✅ DATA EXTRACTION DEMO: Record ${recordId} processed`);
      console.log(`📊 CONFIDENCE: ${result.confidence}%`);
      console.log(`👥 EMPLOYEES EXTRACTED: ${result.extractedData.employees?.length || 0}`);
      
      res.json({
        success: true,
        message: "Document processed and data extracted successfully",
        recordId,
        data: storedData,
        pythonEquivalent: {
          note: "This TypeScript/PostgreSQL implementation provides the same functionality as your Python Replit DB example",
          originalPythonCode: "def store_extracted_data(data): record_id = str(uuid.uuid4()); db[record_id] = data; return record_id"
        }
      });

    } catch (error) {
      console.error("❌ DEMO EXTRACTION ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Failed to process document",
        error: error.message
      });
    }
  });

  // Email automation API routes
  app.use("/api/email-automation", emailAutomationRoutes);

  // Weekly summary email endpoint
  app.post('/api/send-summary', async (req, res) => {
    const { summary } = req.body;
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey || !summary) {
      return res.status(400).json({ error: 'Missing API key or summary' });
    }

    try {
      const response = await axios.post(
        'https://api.brevo.com/v3/smtp/email',
        {
          sender: { name: 'SafetySync AI', email: 'jerry@safetysync.ai' },
          to: [{ email: 'jerry@safetysync.ai', name: 'Jerry' }],
          subject: '📊 Weekly Signup Summary',
          htmlContent: `<p>Hi Admin,</p><pre>${summary}</pre>`
        },
        {
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
          },
        }
      );

      res.json({ success: true, messageId: response.data.messageId });
    } catch (error) {
      console.error('Failed to send Brevo email:', error.response?.data || error);
      res.status(500).json({ error: 'Email failed to send' });
    }
  });

  // Promo Code API Routes - 30-day expiration system
  app.post("/api/promo-codes/apply", async (req, res) => {
    try {
      const { promoCode, userId, planTier, discountAmount, discountType } = req.body;
      
      // Validate promo code
      const validation = await storage.validatePromoCode(promoCode, userId);
      if (!validation.valid) {
        return res.status(400).json({
          success: false,
          message: validation.reason
        });
      }
      
      // Calculate expiration date (30 days from now)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      // Create promo code usage record
      const usage = await storage.createPromoCodeUsage({
        userId,
        promoCode,
        expiresAt,
        discountAmount,
        discountType,
        planTier,
        isActive: true
      });
      
      res.json({
        success: true,
        message: "Promo code applied successfully",
        usage: {
          ...usage,
          daysRemaining: 30
        }
      });
    } catch (error) {
      console.error("Error applying promo code:", error);
      res.status(500).json({
        success: false,
        message: "Failed to apply promo code"
      });
    }
  });

  app.get("/api/promo-codes/validate/:code/:userId", async (req, res) => {
    try {
      const { code, userId } = req.params;
      const validation = await storage.validatePromoCode(code, parseInt(userId));
      
      res.json({
        success: true,
        valid: validation.valid,
        reason: validation.reason,
        usage: validation.usage
      });
    } catch (error) {
      console.error("Error validating promo code:", error);
      res.status(500).json({
        success: false,
        message: "Failed to validate promo code"
      });
    }
  });

  app.get("/api/promo-codes/active/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const activeCodes = await storage.getActivePromoCodes(parseInt(userId));
      
      const codesWithDaysRemaining = activeCodes.map(code => ({
        ...code,
        daysRemaining: Math.max(0, Math.ceil((new Date(code.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
      }));
      
      res.json({
        success: true,
        codes: codesWithDaysRemaining
      });
    } catch (error) {
      console.error("Error fetching active promo codes:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch active promo codes"
      });
    }
  });

  // Email test endpoint (for testing Microsoft 365 setup)
  app.post('/api/test-email', async (req, res) => {
    const { to, subject, message } = req.body;
    
    try {
      const { emailService } = await import('./email-service-microsoft365');
      
      // Test connection first
      const connectionTest = await emailService.testConnection();
      if (!connectionTest) {
        return res.status(500).json({ 
          success: false, 
          message: 'Email service connection failed. Check EMAIL_USER and EMAIL_PASSWORD environment variables.' 
        });
      }
      
      // Send test email
      await emailService.sendEmail({
        to,
        subject: subject || 'SafetySync.AI Email Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #3B82F6;">SafetySync.AI Email Test</h2>
            <p>${message || 'This is a test email from your SafetySync.AI platform.'}</p>
            <p>If you receive this email, your Microsoft 365 email configuration is working correctly!</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Sent from SafetySync.AI Email Testing System<br>
              Time: ${new Date().toLocaleString()}
            </p>
          </div>
        `
      });
      
      res.json({ 
        success: true, 
        message: `Test email sent successfully to ${to}` 
      });
    } catch (error) {
      console.error('Email test error:', error);
      res.status(500).json({ 
        success: false, 
        message: `Email test failed: ${error.message}` 
      });
    }
  });

  // A/B Testing API endpoint for tracking conversions
  app.post("/api/ab-testing/conversion", async (req, res) => {
    try {
      const { testId, variantId, conversionValue } = req.body;
      
      // Log conversion for analytics
      console.log(`A/B Test Conversion: ${testId} - ${variantId} - $${conversionValue}`);
      
      res.json({ 
        success: true, 
        message: "Conversion tracked successfully" 
      });
    } catch (error) {
      console.error("Error tracking A/B test conversion:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to track conversion" 
      });
    }
  });

  // Get all leads endpoint (for admin purposes)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Admin authentication middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    // Simple admin protection - can be enhanced with proper authentication
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_KEY || 'dev-admin-key';
    
    if (adminKey !== expectedKey) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin access required" 
      });
    }
    
    next();
  };

  // Get all users endpoint (admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Admin user management endpoints
  app.put('/api/admin/users/:id/tier', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { tier } = req.body;
      
      if (!['free_trial', 'basic', 'professional', 'enterprise'].includes(tier)) {
        return res.status(400).json({ error: 'Invalid tier' });
      }
      
      await storage.updateUserTier(parseInt(id), tier);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating user tier:', error);
      res.status(500).json({ error: 'Failed to update user tier' });
    }
  });

  app.put('/api/admin/users/:id/subscription', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, expiresAt } = req.body;
      
      if (!['active', 'expired', 'cancelled', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid subscription status' });
      }
      
      const expirationDate = expiresAt ? new Date(expiresAt) : undefined;
      await storage.updateSubscriptionStatus(parseInt(id), status, expirationDate);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating subscription:', error);
      res.status(500).json({ error: 'Failed to update subscription' });
    }
  });

  app.put('/api/admin/users/:id/deactivate', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deactivateUser(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deactivating user:', error);
      res.status(500).json({ error: 'Failed to deactivate user' });
    }
  });

  app.put('/api/admin/users/:id/activate', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.activateUser(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error activating user:', error);
      res.status(500).json({ error: 'Failed to activate user' });
    }
  });

  app.get('/api/admin/analytics', requireAdmin, async (req, res) => {
    try {
      const analytics = await storage.getUserAnalytics();
      const subscriptionStats = await storage.getSubscriptionStats();
      res.json({ userAnalytics: analytics, subscriptionStats });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  // Billing analytics endpoints
  app.get('/api/admin/billing-analytics', requireAdmin, async (req, res) => {
    try {
      const billing = await billingAnalytics.getBillingAnalytics();
      res.json(billing);
    } catch (error) {
      console.error('Error fetching billing analytics:', error);
      res.status(500).json({ error: 'Failed to fetch billing analytics' });
    }
  });

  app.get('/api/admin/subscription-tiers', requireAdmin, async (req, res) => {
    try {
      const tiers = await billingAnalytics.getSubscriptionsByTier();
      res.json(tiers);
    } catch (error) {
      console.error('Error fetching subscription tiers:', error);
      res.status(500).json({ error: 'Failed to fetch subscription tiers' });
    }
  });

  app.get('/api/admin/recent-transactions', requireAdmin, async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const transactions = await billingAnalytics.getRecentTransactions(limit);
      res.json(transactions);
    } catch (error) {
      console.error('Error fetching recent transactions:', error);
      res.status(500).json({ error: 'Failed to fetch recent transactions' });
    }
  });

  app.get('/api/admin/users/tier/:tier', requireAdmin, async (req, res) => {
    try {
      const { tier } = req.params;
      const users = await storage.getUsersByTier(tier);
      res.json(users);
    } catch (error) {
      console.error('Error fetching users by tier:', error);
      res.status(500).json({ error: 'Failed to fetch users by tier' });
    }
  });

  // Help Desk Ticket API endpoints
  app.post("/api/help-desk/tickets", async (req, res) => {
    try {
      const ticketData = insertHelpDeskTicketSchema.parse(req.body);
      const ticket = await storage.createHelpDeskTicket(ticketData);
      res.json(ticket);
    } catch (error) {
      console.error("Error creating help desk ticket:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to create help desk ticket" 
      });
    }
  });

  app.get("/api/help-desk/tickets", requireAdmin, async (req, res) => {
    try {
      const tickets = await storage.getHelpDeskTickets();
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching help desk tickets:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch help desk tickets" 
      });
    }
  });

  app.get("/api/help-desk/tickets/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const ticket = await storage.getHelpDeskTicketById(parseInt(id));
      if (!ticket) {
        return res.status(404).json({ 
          success: false, 
          message: "Ticket not found" 
        });
      }
      res.json(ticket);
    } catch (error) {
      console.error("Error fetching help desk ticket:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch help desk ticket" 
      });
    }
  });

  app.put("/api/help-desk/tickets/:id/assign", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;
      await storage.assignHelpDeskTicket(parseInt(id), assignedTo);
      res.json({ success: true });
    } catch (error) {
      console.error("Error assigning help desk ticket:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to assign help desk ticket" 
      });
    }
  });

  app.put("/api/help-desk/tickets/:id/resolve", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { resolutionNotes } = req.body;
      await storage.resolveHelpDeskTicket(parseInt(id), resolutionNotes);
      res.json({ success: true });
    } catch (error) {
      console.error("Error resolving help desk ticket:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to resolve help desk ticket" 
      });
    }
  });

  // Generate compliance report endpoint
  app.post("/api/compliance/reports/generate", async (req, res) => {
    try {
      const { reportType, periodStart, periodEnd, userId } = req.body;
      
      // Generate report data based on type
      const reportData = await generateComplianceReportData(reportType, periodStart, periodEnd);
      
      // Create report record
      const reportRecord = await storage.createComplianceReport({
        userId: userId || 1, // Default to user 1 for demo
        reportName: `${reportType.toUpperCase()} Compliance Report - ${new Date().toLocaleDateString()}`,
        reportType,
        reportData: JSON.stringify(reportData),
        periodStart: periodStart ? new Date(periodStart) : null,
        periodEnd: periodEnd ? new Date(periodEnd) : null,
      });

      res.json({
        success: true,
        report: reportRecord,
        data: reportData
      });
    } catch (error) {
      console.error("Error generating compliance report:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate report" 
      });
    }
  });

  // Report download endpoint - Generate actual PDF
  app.get("/api/reports/download/:reportName", async (req, res) => {
    try {
      const { reportName } = req.params;
      
      // Generate report data
      const reportData = await generateComplianceReportData(reportName.replace(/-/g, ' '));
      
      // Import jsPDF for server-side PDF generation
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // PDF Header
      doc.setFontSize(20);
      doc.setTextColor(16, 185, 129); // Emerald green
      doc.text('SafetySync.AI', 20, 30);
      
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(reportName.replace(/-/g, ' ').toUpperCase(), 20, 45);
      
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 55);
      doc.text(`Period: ${reportData.periodStart} to ${reportData.periodEnd}`, 20, 62);
      
      // Compliance Summary Section
      let yPos = 80;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('COMPLIANCE SUMMARY', 20, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      const summaryData = [
        `Total Employees: ${reportData.complianceStats.totalEmployees}`,
        `Compliant Employees: ${reportData.complianceStats.compliantEmployees}`,
        `Compliance Score: ${reportData.complianceStats.complianceScore}%`,
        `Pending Training: ${reportData.complianceStats.pendingTraining}`,
        `Expired Certifications: ${reportData.complianceStats.expiredCertifications}`
      ];
      
      summaryData.forEach(line => {
        doc.text(`• ${line}`, 25, yPos);
        yPos += 7;
      });
      
      // Employee Details Section
      yPos += 10;
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text('EMPLOYEE DETAILS', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(9);
      reportData.employees.forEach(emp => {
        if (yPos > 250) { // Add new page if needed
          doc.addPage();
          yPos = 30;
        }
        doc.text(`${emp.name} - ${emp.position} (${emp.department})`, 25, yPos);
        yPos += 5;
        doc.setTextColor(100, 100, 100);
        doc.text(`Hire Date: ${emp.hireDate}`, 30, yPos);
        yPos += 8;
        doc.setTextColor(0, 0, 0);
      });
      
      // Recommendations Section
      if (yPos > 220) {
        doc.addPage();
        yPos = 30;
      } else {
        yPos += 10;
      }
      
      doc.setFontSize(14);
      doc.text('RECOMMENDATIONS', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(9);
      reportData.summary.recommendations.forEach(rec => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 30;
        }
        const lines = doc.splitTextToSize(`• ${rec}`, 160);
        doc.text(lines, 25, yPos);
        yPos += lines.length * 5;
      });
      
      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('© 2025 SafetySync.AI - All Rights Reserved', 20, 285);
        doc.text(`Page ${i} of ${pageCount}`, 170, 285);
      }
      
      // Generate PDF buffer
      const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${reportName}-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating PDF report:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate PDF report" 
      });
    }
  });

  // Report view endpoint
  app.get("/api/reports/view/:reportName", async (req, res) => {
    try {
      const { reportName } = req.params;
      
      // Generate report data
      const reportData = await generateComplianceReportData(reportName.replace(/-/g, ' '));
      
      // Create HTML content for viewing
      const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>SafetySync.AI - ${reportName.replace(/-/g, ' ').toUpperCase()}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
    .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; }
    .title { color: #10b981; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
    .subtitle { color: #6b7280; font-size: 14px; }
    .section { margin-bottom: 30px; }
    .section-title { color: #374151; font-size: 18px; font-weight: bold; margin-bottom: 15px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
    .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
    .stat-card { background: #f9fafb; padding: 15px; border-radius: 6px; border-left: 4px solid #10b981; }
    .stat-value { font-size: 24px; font-weight: bold; color: #10b981; }
    .stat-label { color: #6b7280; font-size: 12px; text-transform: uppercase; }
    .employee-list { background: #f9fafb; padding: 20px; border-radius: 6px; }
    .employee { margin-bottom: 10px; padding: 10px; background: white; border-radius: 4px; }
    .employee-name { font-weight: bold; color: #374151; }
    .employee-details { color: #6b7280; font-size: 14px; }
    .recommendations { background: #ecfdf5; padding: 20px; border-radius: 6px; border-left: 4px solid #10b981; }
    .recommendations ul { margin: 0; padding-left: 20px; }
    .recommendations li { margin-bottom: 8px; color: #065f46; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">SafetySync.AI - ${reportName.replace(/-/g, ' ').toUpperCase()}</div>
      <div class="subtitle">Generated: ${new Date().toLocaleDateString()} | Period: ${reportData.periodStart} to ${reportData.periodEnd}</div>
    </div>
    
    <div class="section">
      <div class="section-title">Compliance Summary</div>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-value">${reportData.complianceStats.totalEmployees}</div>
          <div class="stat-label">Total Employees</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${reportData.complianceStats.compliantEmployees}</div>
          <div class="stat-label">Compliant Employees</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${reportData.complianceStats.complianceScore}%</div>
          <div class="stat-label">Compliance Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${reportData.complianceStats.pendingTraining}</div>
          <div class="stat-label">Pending Training</div>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Employee Details</div>
      <div class="employee-list">
        ${reportData.employees.map(emp => `
          <div class="employee">
            <div class="employee-name">${emp.name}</div>
            <div class="employee-details">${emp.position} - ${emp.department} | Hire Date: ${emp.hireDate}</div>
          </div>
        `).join('')}
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Recommendations</div>
      <div class="recommendations">
        <ul>
          ${reportData.summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
        </ul>
      </div>
    </div>
    
    <div class="footer">
      © 2025 SafetySync.AI - All Rights Reserved
    </div>
  </div>
</body>
</html>
      `;

      res.setHeader('Content-Type', 'text/html');
      res.send(htmlContent);
    } catch (error) {
      console.error("Error generating report view:", error);
      res.status(404).send(`
        <html>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #ef4444;">Report Not Found</h2>
            <p>The requested report could not be generated.</p>
            <button onclick="window.close()" style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">Close Window</button>
          </body>
        </html>
      `);
    }
  });

  // Get compliance reports for a user
  app.get("/api/compliance/reports/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reports = await storage.getComplianceReports(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching compliance reports:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch reports" 
      });
    }
  });

  // Get specific compliance report
  app.get("/api/compliance/reports/view/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getComplianceReportById(id);
      if (!report) {
        return res.status(404).json({ 
          success: false, 
          message: "Report not found" 
        });
      }
      res.json({
        ...report,
        reportData: JSON.parse(report.reportData)
      });
    } catch (error) {
      console.error("Error fetching compliance report:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch report" 
      });
    }
  });

  // Clone Detection API Routes
  // Store active scans in memory (in production, use Redis or database)
  const activeScanStatuses = new Map<number, any>();

  // Initialize original website fingerprint
  app.post("/api/clone-detection/init", async (req, res) => {
    try {
      const { html, url } = req.body;
      await cloneDetector.setOriginalWebsite(html, url);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to initialize clone detector:", error);
      res.status(500).json({ error: "Failed to initialize clone detector" });
    }
  });

  // Start clone detection scan
  app.post("/api/clone-detection/scan", async (req, res) => {
    try {
      const { urls, scanType = 'manual' } = req.body;
      const userId = 1; // For demo purposes, use actual user from session

      if (!Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: "URLs array is required" });
      }

      // Create scan record
      const scan = await storage.createCloneDetectionScan({
        userId,
        scanType,
        targetUrls: urls,
        results: [],
        status: 'pending',
        totalSites: urls.length,
        clonesDetected: 0,
        highRiskSites: 0
      });

      // Initialize scan status
      activeScanStatuses.set(scan.id, {
        scanId: scan.id,
        status: 'running',
        progress: 0,
        currentUrl: '',
        results: [],
        totalUrls: urls.length,
        processedUrls: 0
      });

      // Start scanning in background
      processScanAsync(scan.id, urls);

      res.json({ scanId: scan.id, status: 'started' });
    } catch (error) {
      console.error("Failed to start scan:", error);
      res.status(500).json({ error: "Failed to start scan" });
    }
  });

  // Get scan status
  app.get("/api/clone-detection/scan/:scanId/status", async (req, res) => {
    try {
      const scanId = parseInt(req.params.scanId);
      const status = activeScanStatuses.get(scanId);
      
      if (!status) {
        const scan = await storage.getCloneDetectionScanById(scanId);
        if (!scan) {
          return res.status(404).json({ error: "Scan not found" });
        }
        return res.json({ 
          status: scan.status, 
          progress: 100,
          results: scan.results,
          clonesDetected: scan.clonesDetected 
        });
      }

      res.json(status);
    } catch (error) {
      console.error("Failed to get scan status:", error);
      res.status(500).json({ error: "Failed to get scan status" });
    }
  });

  // Get clone detection scans for user
  app.get("/api/clone-detection/scans", async (req, res) => {
    try {
      const userId = 1; // For demo purposes, use actual user from session
      const scans = await storage.getCloneDetectionScans(userId);
      res.json(scans);
    } catch (error) {
      console.error("Failed to fetch scans:", error);
      res.status(500).json({ error: "Failed to fetch scans" });
    }
  });

  // Background scan processing function
  async function processScanAsync(scanId: number, urls: string[]) {
    const status = activeScanStatuses.get(scanId);
    if (!status) return;

    try {
      const results = [];
      let clonesDetected = 0;
      let highRiskSites = 0;

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        status.currentUrl = url;
        status.progress = Math.round((i / urls.length) * 100);
        
        try {
          // Fetch website content
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const response = await fetch(url, { 
            signal: controller.signal,
            headers: { 'User-Agent': 'SafetySync Clone Detector 1.0' }
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const html = await response.text();
            const result = await cloneDetector.detectClone(html, url);
            results.push(result);
            
            if (result.recommendation === 'potential_clone' || result.recommendation === 'high_risk') {
              clonesDetected++;
            }
            if (result.recommendation === 'high_risk' || result.recommendation === 'potential_clone') {
              highRiskSites++;
            }
          } else {
            results.push({
              url,
              similarityScore: 0,
              analysis: { contentSimilarity: 0, structureSimilarity: 0, designSimilarity: 0, brandingSimilarity: 0 },
              suspiciousElements: [],
              recommendation: 'low_risk' as const,
              aiAnalysis: 'Unable to access website for analysis.',
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error(`Error scanning ${url}:`, error);
          results.push({
            url,
            similarityScore: 0,
            analysis: { contentSimilarity: 0, structureSimilarity: 0, designSimilarity: 0, brandingSimilarity: 0 },
            suspiciousElements: [],
            recommendation: 'low_risk' as const,
            aiAnalysis: 'Error occurred during analysis.',
            timestamp: new Date().toISOString()
          });
        }
        
        status.processedUrls = i + 1;
      }

      // Update scan in database
      await storage.updateCloneDetectionScan(scanId, {
        status: 'completed',
        results: results,
        clonesDetected,
        highRiskSites,
        completedAt: new Date()
      });

      // Update status
      status.status = 'completed';
      status.progress = 100;
      status.results = results;
      status.clonesDetected = clonesDetected;

    } catch (error) {
      console.error(`Scan ${scanId} failed:`, error);
      await storage.updateCloneDetectionScan(scanId, {
        status: 'failed',
        completedAt: new Date()
      });
      
      if (status) {
        status.status = 'failed';
        status.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }
  }

  // Email testing endpoint
  app.post('/api/test-email', async (req, res) => {
    try {
      const { to, subject, testType = 'basic' } = req.body;
      
      if (!to || !subject) {
        return res.status(400).json({ error: 'Email recipient and subject are required' });
      }

      // Test email content
      const testEmails = {
        basic: {
          subject: `Test Email: ${subject}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">SafetySync.AI Email Test</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Microsoft 365 Integration Test</p>
              </div>
              
              <div style="padding: 40px; background: white;">
                <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0;">Email Test Successful!</p>
                
                <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #10B981;">
                  <h3 style="color: #1e293b; margin: 0 0 20px 0;">✅ Test Details</h3>
                  <div style="margin-bottom: 15px;"><strong>Test Type:</strong> ${testType}</div>
                  <div style="margin-bottom: 15px;"><strong>Timestamp:</strong> ${new Date().toLocaleString()}</div>
                  <div style="margin-bottom: 15px;"><strong>From:</strong> SafetySync.AI Platform</div>
                  <div><strong>DNS Status:</strong> Microsoft 365 records configured</div>
                </div>
                
                <p style="color: #6b7280; line-height: 1.7; margin-bottom: 30px;">
                  Your Microsoft 365 email integration is working correctly. The platform can now send:
                </p>
                
                <ul style="color: #6b7280; line-height: 1.7;">
                  <li>Welcome emails for new trial users</li>
                  <li>Trial reminder notifications</li>
                  <li>Support request notifications</li>
                  <li>Automated compliance reports</li>
                </ul>
              </div>
            </div>
          `
        },
        welcome: {
          subject: 'Welcome to SafetySync.AI - Test Email',
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">Welcome to SafetySync.AI!</h1>
                <p style="color: rgba(255,255,255,0.9); margin: 15px 0 0 0; font-size: 18px;">Your AI-powered compliance journey begins today</p>
              </div>
              
              <div style="padding: 40px; background: white;">
                <p style="font-size: 18px; color: #374151; margin: 0 0 25px 0;">This is a test of the welcome email system.</p>
                
                <div style="background: #f8fafc; padding: 30px; border-radius: 12px; margin: 30px 0; border-left: 5px solid #3B82F6;">
                  <h3 style="color: #1e293b; margin: 0 0 20px 0;">🎯 Your Success Roadmap</h3>
                  <div style="margin-bottom: 15px;">✅ Week 1: Company setup, employee import, first report</div>
                  <div style="margin-bottom: 15px;">📄 Week 2: Professional certificates, automated reminders</div>
                  <div>🚀 Week 3+: Advanced features, API integration, team collaboration</div>
                </div>
                
                <div style="text-align: center; margin: 40px 0;">
                  <a href="https://app.safetysync.ai/dashboard" style="background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                    Access Your Dashboard
                  </a>
                </div>
              </div>
            </div>
          `
        }
      };

      const emailContent = testEmails[testType as keyof typeof testEmails] || testEmails.basic;
      
      // Try to send actual email if credentials are configured
      if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
        try {
          const { emailService } = await import('./email-service-microsoft365');
          const result = await emailService.sendEmailWithErrorHandling({
            to,
            subject: emailContent.subject,
            html: emailContent.html,
            replyTo: 'jerry@safetysync.ai'
          });
          
          if (result.success) {
            console.log('=== EMAIL SENT SUCCESSFULLY ===');
            console.log(`To: ${to}`);
            console.log(`Subject: ${emailContent.subject}`);
            console.log(`Type: ${testType}`);
            console.log(`Timestamp: ${new Date().toLocaleString()}`);
            console.log('================================');
          } else {
            // If SMTP auth is disabled, show preview instead
            console.log('=== EMAIL PREVIEW (SMTP AUTH DISABLED) ===');
            console.log(`To: ${to}`);
            console.log(`Subject: ${emailContent.subject}`);
            console.log(`Type: ${testType}`);
            console.log(`Timestamp: ${new Date().toLocaleString()}`);
            console.log('===================================');
            
            // Return preview with admin instructions
            result.details = {
              ...result.details,
              testType,
              previewHtml: emailContent.html,
              previewText: emailContent.text || 'Email preview available',
              instructions: 'Enable SMTP authentication in Microsoft 365 Admin Center to send actual emails'
            };
          }

          res.json({ 
            ...result,
            details: {
              ...result.details,
              testType
            }
          });
        } catch (emailError) {
          console.error('Email service error:', emailError);
          
          // Check if this is an SMTP auth error
          const errorMessage = emailError instanceof Error ? emailError.message : 'Unknown error';
          if (errorMessage.includes('535 5.7.139') || errorMessage.includes('SmtpClientAuthentication is disabled')) {
            res.json({ 
              success: false, 
              message: 'Microsoft 365 SMTP authentication is disabled for your tenant',
              details: {
                to,
                subject: emailContent.subject,
                testType,
                timestamp: new Date().toLocaleString(),
                error: 'SMTP AUTH disabled',
                solution: 'Enable SMTP authentication in Microsoft 365 Admin Center',
                link: 'https://admin.microsoft.com → Settings → Modern authentication → Enable SMTP AUTH',
                previewHtml: emailContent.html,
                instructions: [
                  '1. Go to Microsoft 365 Admin Center',
                  '2. Navigate to Settings → Org settings → Services',
                  '3. Find "Modern authentication" and enable SMTP AUTH',
                  '4. Wait 5-10 minutes for changes to propagate'
                ]
              }
            });
          } else {
            res.json({ 
              success: false, 
              message: 'Email service connection failed',
              details: {
                to,
                subject: emailContent.subject,
                testType,
                timestamp: new Date().toLocaleString(),
                error: errorMessage,
                previewHtml: emailContent.html,
                note: 'Preview mode - enable SMTP authentication to send actual emails'
              }
            });
          }
        }
      } else {
        // Log email for testing without credentials
        console.log('=== EMAIL TEST (No Credentials) ===');
        console.log(`To: ${to}`);
        console.log(`Subject: ${emailContent.subject}`);
        console.log(`Type: ${testType}`);
        console.log(`Timestamp: ${new Date().toLocaleString()}`);
        console.log('HTML Content Length:', emailContent.html.length);
        console.log('===================================');

        res.json({ 
          success: true, 
          message: 'Email test completed (logged to console)',
          details: {
            to,
            subject: emailContent.subject,
            testType,
            timestamp: new Date().toLocaleString(),
            note: 'Configure EMAIL_USER and EMAIL_PASSWORD to send real emails'
          }
        });
      }
    } catch (error) {
      console.error('Email test error:', error);
      res.status(500).json({ error: 'Email test failed' });
    }
  });

  // Dashboard Statistics API
  app.get("/api/dashboard/stats", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const employees = await storage.getEmployees(userId);
      
      // Calculate statistics based on real employee data
      const totalEmployees = employees.length;
      const activeEmployees = employees.filter(emp => emp.status === 'active').length;
      const complianceScore = Math.round((activeEmployees / totalEmployees) * 100) || 0;
      
      // Mock training data for now - can be enhanced with real training data later
      const pendingTraining = Math.floor(totalEmployees * 0.15);
      const expiringCertifications = Math.floor(totalEmployees * 0.08);
      const compliantEmployees = totalEmployees - pendingTraining - expiringCertifications;
      
      res.json({
        totalEmployees,
        compliantEmployees,
        pendingTraining,
        expiringCertifications,
        complianceScore
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // Employee Management API
  app.post("/api/employees", authenticateToken, async (req, res) => {
    try {
      const employeeData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(employeeData);
      res.json(employee);
    } catch (error) {
      console.error("Error creating employee:", error);
      res.status(500).json({ error: "Failed to create employee" });
    }
  });

  app.get("/api/employees", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const employees = await storage.getEmployees(userId);
      res.json(employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployeeById(id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      console.error("Error fetching employee:", error);
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.put("/api/employees/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      await storage.updateEmployee(id, updates);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating employee:", error);
      res.status(500).json({ error: "Failed to update employee" });
    }
  });

  app.delete("/api/employees/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteEmployee(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting employee:", error);
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  // Instructor Management API
  app.post("/api/instructors", authenticateToken, async (req, res) => {
    try {
      const instructorData = insertInstructorSchema.parse(req.body);
      instructorData.userId = (req as any).user.id;
      const instructor = await storage.createInstructor(instructorData);
      res.json(instructor);
    } catch (error) {
      console.error("Error creating instructor:", error);
      res.status(500).json({ error: "Failed to create instructor" });
    }
  });

  app.get("/api/instructors", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const instructors = await storage.getInstructors(userId);
      res.json(instructors);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      res.status(500).json({ error: "Failed to fetch instructors" });
    }
  });

  app.get("/api/instructors/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const instructor = await storage.getInstructorById(id);
      if (!instructor) {
        return res.status(404).json({ error: "Instructor not found" });
      }
      res.json(instructor);
    } catch (error) {
      console.error("Error fetching instructor:", error);
      res.status(500).json({ error: "Failed to fetch instructor" });
    }
  });

  app.put("/api/instructors/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      await storage.updateInstructor(id, updates);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating instructor:", error);
      res.status(500).json({ error: "Failed to update instructor" });
    }
  });

  app.delete("/api/instructors/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteInstructor(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting instructor:", error);
      res.status(500).json({ error: "Failed to delete instructor" });
    }
  });

  // External Students Management API
  app.post("/api/external-students", authenticateToken, async (req, res) => {
    try {
      const studentData = insertExternalStudentSchema.parse(req.body);
      studentData.userId = (req as any).user.id;
      const student = await storage.createExternalStudent(studentData);
      res.json(student);
    } catch (error) {
      console.error("Error creating external student:", error);
      res.status(500).json({ error: "Failed to create external student" });
    }
  });

  app.get("/api/external-students", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const students = await storage.getExternalStudents(userId);
      res.json(students);
    } catch (error) {
      console.error("Error fetching external students:", error);
      res.status(500).json({ error: "Failed to fetch external students" });
    }
  });

  app.get("/api/external-students/search", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }
      const students = await storage.searchExternalStudents(userId, query);
      res.json(students);
    } catch (error) {
      console.error("Error searching external students:", error);
      res.status(500).json({ error: "Failed to search external students" });
    }
  });

  app.get("/api/external-students/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const student = await storage.getExternalStudentById(id);
      if (!student) {
        return res.status(404).json({ error: "External student not found" });
      }
      res.json(student);
    } catch (error) {
      console.error("Error fetching external student:", error);
      res.status(500).json({ error: "Failed to fetch external student" });
    }
  });

  app.put("/api/external-students/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      await storage.updateExternalStudent(id, updates);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating external student:", error);
      res.status(500).json({ error: "Failed to update external student" });
    }
  });

  app.delete("/api/external-students/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteExternalStudent(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting external student:", error);
      res.status(500).json({ error: "Failed to delete external student" });
    }
  });

  // Training Program Management API
  app.post("/api/training-programs", authenticateToken, async (req, res) => {
    try {
      const programData = insertTrainingProgramSchema.parse(req.body);
      const program = await storage.createTrainingProgram(programData);
      res.json(program);
    } catch (error) {
      console.error("Error creating training program:", error);
      res.status(500).json({ error: "Failed to create training program" });
    }
  });

  app.get("/api/training-programs", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const programs = await storage.getTrainingPrograms(userId);
      res.json(programs);
    } catch (error) {
      console.error("Error fetching training programs:", error);
      res.status(500).json({ error: "Failed to fetch training programs" });
    }
  });

  app.get("/api/training-programs/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const program = await storage.getTrainingProgramById(id);
      if (!program) {
        return res.status(404).json({ error: "Training program not found" });
      }
      res.json(program);
    } catch (error) {
      console.error("Error fetching training program:", error);
      res.status(500).json({ error: "Failed to fetch training program" });
    }
  });

  app.put("/api/training-programs/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      await storage.updateTrainingProgram(id, updates);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating training program:", error);
      res.status(500).json({ error: "Failed to update training program" });
    }
  });

  app.delete("/api/training-programs/:id", authenticateToken, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTrainingProgram(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting training program:", error);
      res.status(500).json({ error: "Failed to delete training program" });
    }
  });

  // Certificate Management API
  app.post("/api/certificates", authenticateToken, async (req, res) => {
    try {
      const certificateData = insertCertificateSchema.parse(req.body);
      const certificate = await storage.createCertificate(certificateData);
      res.json(certificate);
    } catch (error) {
      console.error("Error creating certificate:", error);
      res.status(500).json({ error: "Failed to create certificate" });
    }
  });

  app.get("/api/certificates", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const certificates = await storage.getCertificates(userId);
      res.json(certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      res.status(500).json({ error: "Failed to fetch certificates" });
    }
  });

  app.get("/api/certificates/employee/:employeeId", authenticateToken, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const certificates = await storage.getCertificatesByEmployee(employeeId);
      res.json(certificates);
    } catch (error) {
      console.error("Error fetching employee certificates:", error);
      res.status(500).json({ error: "Failed to fetch employee certificates" });
    }
  });

  app.get("/api/certificates/expiring", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const days = parseInt(req.query.days as string) || 30;
      const certificates = await storage.getExpiringCertificates(userId, days);
      res.json(certificates);
    } catch (error) {
      console.error("Error fetching expiring certificates:", error);
      res.status(500).json({ error: "Failed to fetch expiring certificates" });
    }
  });

  // Document Management API
  app.post("/api/documents", authenticateToken, async (req, res) => {
    try {
      const documentData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(documentData);
      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.get("/api/documents", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const documents = await storage.getDocuments(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  // Training Session Management API
  app.post("/api/training-sessions", authenticateToken, async (req, res) => {
    try {
      const sessionData = insertTrainingSessionSchema.parse(req.body);
      const session = await storage.createTrainingSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating training session:", error);
      res.status(500).json({ error: "Failed to create training session" });
    }
  });

  app.get("/api/training-sessions", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const sessions = await storage.getTrainingSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching training sessions:", error);
      res.status(500).json({ error: "Failed to fetch training sessions" });
    }
  });

  app.get("/api/training-sessions/upcoming", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const sessions = await storage.getUpcomingTrainingSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching upcoming training sessions:", error);
      res.status(500).json({ error: "Failed to fetch upcoming training sessions" });
    }
  });

  // Employee Training Management API
  app.post("/api/employee-training", authenticateToken, async (req, res) => {
    try {
      const trainingData = insertEmployeeTrainingSchema.parse(req.body);
      const training = await storage.createEmployeeTraining(trainingData);
      res.json(training);
    } catch (error) {
      console.error("Error creating employee training:", error);
      res.status(500).json({ error: "Failed to create employee training" });
    }
  });

  app.get("/api/employee-training/employee/:employeeId", authenticateToken, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const training = await storage.getEmployeeTrainingByEmployee(employeeId);
      res.json(training);
    } catch (error) {
      console.error("Error fetching employee training:", error);
      res.status(500).json({ error: "Failed to fetch employee training" });
    }
  });

  // Notification Management API
  app.post("/api/notifications", authenticateToken, async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  app.get("/api/notifications", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const notifications = await storage.getNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  // Bulk Operations API
  app.post("/api/bulk/employees/import", authenticateToken, async (req, res) => {
    try {
      const { employees } = req.body;
      const userId = (req as any).user.id;
      
      const results = [];
      for (const employeeData of employees) {
        try {
          const employee = await storage.createEmployee({
            ...employeeData,
            userId
          });
          results.push({ success: true, employee });
        } catch (error) {
          results.push({ success: false, error: error.message, data: employeeData });
        }
      }
      
      res.json({ results });
    } catch (error) {
      console.error("Error importing employees:", error);
      res.status(500).json({ error: "Failed to import employees" });
    }
  });

  app.get("/api/bulk/employees/export", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const employees = await storage.getEmployees(userId);
      
      // Convert to CSV format
      const csvHeaders = ['Employee ID', 'First Name', 'Last Name', 'Email', 'Phone', 'Position', 'Department', 'Division', 'Location', 'Status'];
      const csvData = employees.map(emp => [
        emp.employeeId,
        emp.firstName,
        emp.lastName,
        emp.email,
        emp.phone || '',
        emp.position || '',
        emp.department || '',
        emp.division || '',
        emp.location || '',
        emp.status
      ]);
      
      const csvContent = [csvHeaders, ...csvData].map(row => row.join(',')).join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=employees.csv');
      res.send(csvContent);
    } catch (error) {
      console.error("Error exporting employees:", error);
      res.status(500).json({ error: "Failed to export employees" });
    }
  });

  // Audit Log API
  app.post("/api/audit-logs", authenticateToken, async (req, res) => {
    try {
      const auditData = insertAuditLogSchema.parse(req.body);
      const log = await storage.createAuditLog(auditData);
      res.json(log);
    } catch (error) {
      console.error("Error creating audit log:", error);
      res.status(500).json({ error: "Failed to create audit log" });
    }
  });

  app.get("/api/audit-logs", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const logs = await storage.getAuditLogs(userId);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      res.status(500).json({ error: "Failed to fetch audit logs" });
    }
  });

  // Location Management API
  app.post("/api/locations", authenticateToken, async (req, res) => {
    try {
      const locationData = insertLocationSchema.parse(req.body);
      const location = await storage.createLocation(locationData);
      res.json(location);
    } catch (error) {
      console.error("Error creating location:", error);
      res.status(500).json({ error: "Failed to create location" });
    }
  });

  app.get("/api/locations", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const locations = await storage.getLocations(userId);
      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({ error: "Failed to fetch locations" });
    }
  });

  // Company Profile API routes
  app.get("/api/company-profile", async (req, res) => {
    try {
      const userId = 1; // Mock user ID for demo purposes
      const profile = await storage.getCompanyProfile(userId);
      res.json(profile);
    } catch (error) {
      console.error("Error fetching company profile:", error);
      res.status(500).json({ error: "Failed to fetch company profile" });
    }
  });

  app.post("/api/company-profile", async (req, res) => {
    try {
      const validation = insertCompanyProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid company profile data", details: validation.error.errors });
      }
      
      const profile = await storage.createCompanyProfile(validation.data);
      res.json(profile);
    } catch (error) {
      console.error("Error creating company profile:", error);
      res.status(500).json({ error: "Failed to create company profile" });
    }
  });

  app.put("/api/company-profile/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const validation = insertCompanyProfileSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid company profile data", details: validation.error.errors });
      }
      
      const profile = await storage.updateCompanyProfile(parseInt(userId), validation.data);
      res.json(profile);
    } catch (error) {
      console.error("Error updating company profile:", error);
      res.status(500).json({ error: "Failed to update company profile" });
    }
  });

  // Helpdesk API Routes
  app.post("/api/helpdesk/tickets", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const ticketData = insertHelpDeskTicketSchema.parse({
        ...req.body,
        userId,
        status: 'open'
      });
      const ticket = await storage.createHelpDeskTicket(ticketData);
      res.json(ticket);
    } catch (error) {
      console.error("Error creating helpdesk ticket:", error);
      res.status(500).json({ error: "Failed to create helpdesk ticket" });
    }
  });

  app.get("/api/helpdesk/tickets", authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      const tickets = await storage.getHelpDeskTickets(userId);
      res.json(tickets);
    } catch (error) {
      console.error("Error fetching helpdesk tickets:", error);
      res.status(500).json({ error: "Failed to fetch helpdesk tickets" });
    }
  });

  app.get("/api/helpdesk/tickets/:id", authenticateToken, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const userId = (req as any).user.id;
      const ticket = await storage.getHelpDeskTicketById(ticketId, userId);
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      res.json(ticket);
    } catch (error) {
      console.error("Error fetching helpdesk ticket:", error);
      res.status(500).json({ error: "Failed to fetch helpdesk ticket" });
    }
  });

  app.put("/api/helpdesk/tickets/:id", authenticateToken, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const userId = (req as any).user.id;
      const updates = req.body;
      const ticket = await storage.updateHelpDeskTicket(ticketId, userId, updates);
      res.json(ticket);
    } catch (error) {
      console.error("Error updating helpdesk ticket:", error);
      res.status(500).json({ error: "Failed to update helpdesk ticket" });
    }
  });

  app.post("/api/helpdesk/tickets/:id/responses", authenticateToken, async (req, res) => {
    try {
      const ticketId = parseInt(req.params.id);
      const userId = (req as any).user.id;
      const responseData = insertTicketResponseSchema.parse({
        ...req.body,
        ticketId,
        userId,
        isStaff: false
      });
      const response = await storage.createTicketResponse(responseData);
      res.json(response);
    } catch (error) {
      console.error("Error creating ticket response:", error);
      res.status(500).json({ error: "Failed to create ticket response" });
    }
  });

  // Client Portal API Routes
  app.get("/api/client-portal/specials", async (req, res) => {
    try {
      const specials = await storage.getActiveSpecials();
      res.json(specials);
    } catch (error) {
      console.error("Error fetching specials:", error);
      res.status(500).json({ error: "Failed to fetch specials" });
    }
  });

  app.get("/api/client-portal/feature-updates", async (req, res) => {
    try {
      const updates = await storage.getActiveFeatureUpdates();
      res.json(updates);
    } catch (error) {
      console.error("Error fetching feature updates:", error);
      res.status(500).json({ error: "Failed to fetch feature updates" });
    }
  });

  app.get("/api/client-portal/upcoming-software", async (req, res) => {
    try {
      const software = await storage.getActiveUpcomingSoftware();
      const userId = req.query.userId as string;
      
      if (userId) {
        const userVoted = await storage.getUserVotedSoftware(userId);
        const softwareWithVotes = software.map(s => ({
          ...s,
          userVoted: userVoted.includes(s.id)
        }));
        res.json(softwareWithVotes);
      } else {
        res.json(software);
      }
    } catch (error) {
      console.error("Error fetching upcoming software:", error);
      res.status(500).json({ error: "Failed to fetch upcoming software" });
    }
  });

  app.get("/api/client-portal/comments", async (req, res) => {
    try {
      const comments = await storage.getActiveClientComments();
      const userId = req.query.userId as string;
      
      if (userId) {
        const userLiked = await storage.getUserLikedComments(userId);
        const commentsWithLikes = comments.map(c => ({
          ...c,
          userLiked: userLiked.includes(c.id)
        }));
        res.json(commentsWithLikes);
      } else {
        res.json(comments);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    }
  });

  app.post("/api/client-portal/comments", async (req, res) => {
    try {
      const { userName, text } = req.body;
      
      const comment = await storage.createClientComment({
        userName,
        text,
        likes: 0,
        isActive: true
      });
      
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ error: "Failed to create comment" });
    }
  });

  app.post("/api/client-portal/vote/:softwareId", async (req, res) => {
    try {
      const { softwareId } = req.params;
      const { userId } = req.body;
      
      await storage.voteForSoftware(userId, parseInt(softwareId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error voting for software:", error);
      res.status(500).json({ error: "Failed to vote for software" });
    }
  });

  app.post("/api/client-portal/like/:commentId", async (req, res) => {
    try {
      const { commentId } = req.params;
      const { userId } = req.body;
      
      await storage.likeComment(userId, parseInt(commentId));
      res.json({ success: true });
    } catch (error) {
      console.error("Error liking comment:", error);
      res.status(500).json({ error: "Failed to like comment" });
    }
  });

  // Optimized Dashboard Data API - Single endpoint to reduce loading time
  app.get('/api/dashboard/data', authenticateToken, async (req, res) => {
    try {
      const userId = (req as any).user.id;
      
      // Get all dashboard data in parallel to reduce loading time
      const [employees, certificates, trainingSessions] = await Promise.all([
        storage.getEmployees(userId),
        storage.getCertificates(userId),
        storage.getTrainingSessions(userId)
      ]);

      // Calculate dashboard statistics
      const totalEmployees = employees.length;
      const compliantEmployees = employees.filter(emp => emp.complianceStatus === 'compliant').length;
      const expiredCertificates = certificates.filter(cert => cert.expirationDate && new Date(cert.expirationDate) < new Date()).length;
      const expiringCertificates = certificates.filter(cert => 
        cert.expirationDate && 
        new Date(cert.expirationDate) > new Date() && 
        new Date(cert.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      ).length;
      
      const pendingTraining = trainingSessions.filter(session => session.status === 'pending').length;
      const complianceScore = totalEmployees > 0 ? Math.round((compliantEmployees / totalEmployees) * 100) : 0;

      // Recent activity (last 5 records)
      const recentActivity = trainingSessions
        .sort((a, b) => new Date(b.createdAt || b.scheduledDate).getTime() - new Date(a.createdAt || a.scheduledDate).getTime())
        .slice(0, 5)
        .map(session => {
          const employee = employees.find(emp => emp.id === session.employeeId);
          return {
            id: session.id,
            employeeName: employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
            training: session.trainingType || 'Training',
            status: session.status,
            date: session.scheduledDate
          };
        });

      res.json({
        stats: {
          totalEmployees,
          compliantEmployees,
          pendingTraining,
          complianceScore,
          expiredCertificates,
          expiringCertificates
        },
        recentActivity,
        employees: employees.slice(0, 10), // Only return top 10 for quick search
        certificates: certificates.slice(0, 10),
        trainingSessions: trainingSessions.slice(0, 10)
      });
    } catch (error) {
      console.error('Dashboard data error:', error);
      res.status(500).json({ error: 'Failed to fetch dashboard data' });
    }
  });

  // Signup Analytics Breakdown API
  app.get('/api/signup-breakdown', async (req, res) => {
    try {
      // Replace this with your real DB logic
      const data = [
        { date: 'Jul 1', Basic: 3, Pro: 2, Lifer: 1, Enterprise: 0 },
        { date: 'Jul 2', Basic: 4, Pro: 1, Lifer: 2, Enterprise: 1 },
        { date: 'Jul 3', Basic: 2, Pro: 3, Lifer: 0, Enterprise: 1 },
        { date: 'Jul 4', Basic: 1, Pro: 4, Lifer: 1, Enterprise: 2 },
        { date: 'Jul 5', Basic: 5, Pro: 2, Lifer: 1, Enterprise: 1 },
        { date: 'Jul 6', Basic: 3, Pro: 3, Lifer: 2, Enterprise: 0 },
        { date: 'Jul 7', Basic: 2, Pro: 1, Lifer: 3, Enterprise: 2 },
        { date: 'Jul 8', Basic: 4, Pro: 2, Lifer: 0, Enterprise: 1 },
        { date: 'Jul 9', Basic: 1, Pro: 4, Lifer: 1, Enterprise: 2 },
        { date: 'Jul 10', Basic: 6, Pro: 1, Lifer: 2, Enterprise: 1 },
        { date: 'Jul 11', Basic: 3, Pro: 3, Lifer: 1, Enterprise: 0 },
        { date: 'Jul 12', Basic: 2, Pro: 2, Lifer: 3, Enterprise: 1 },
        { date: 'Jul 13', Basic: 4, Pro: 1, Lifer: 1, Enterprise: 2 },
        { date: 'Jul 14', Basic: 1, Pro: 5, Lifer: 0, Enterprise: 1 },
        { date: 'Jul 15', Basic: 3, Pro: 2, Lifer: 2, Enterprise: 1 },
        { date: 'Jul 16', Basic: 5, Pro: 1, Lifer: 1, Enterprise: 0 },
        { date: 'Jul 17', Basic: 2, Pro: 3, Lifer: 2, Enterprise: 2 },
        { date: 'Jul 18', Basic: 4, Pro: 2, Lifer: 0, Enterprise: 1 },
        { date: 'Jul 19', Basic: 1, Pro: 4, Lifer: 3, Enterprise: 1 },
        { date: 'Jul 20', Basic: 3, Pro: 1, Lifer: 1, Enterprise: 2 },
        { date: 'Jul 21', Basic: 6, Pro: 2, Lifer: 0, Enterprise: 1 },
        { date: 'Jul 22', Basic: 2, Pro: 3, Lifer: 2, Enterprise: 0 },
        { date: 'Jul 23', Basic: 4, Pro: 1, Lifer: 1, Enterprise: 2 },
        { date: 'Jul 24', Basic: 1, Pro: 2, Lifer: 3, Enterprise: 1 },
        { date: 'Jul 25', Basic: 5, Pro: 3, Lifer: 0, Enterprise: 1 },
        { date: 'Jul 26', Basic: 3, Pro: 1, Lifer: 2, Enterprise: 2 }
      ];
      res.json(data);
    } catch (err) {
      console.error('Breakdown error:', err);
      res.status(500).json({ error: 'Could not load breakdown' });
    }
  });

  // Serve uploaded files (certificates and wallet cards)
  app.use('/uploads', express.static('uploads'));

  // Email automation API
  app.use("/api/email", emailAutomationRoutes);

  // File system API
  const fileSystemRoutes = await import("./api/file-system");
  app.use("/api/file-system", fileSystemRoutes.default);

  // AI Document Processing Routes
  app.post("/api/ai/process-signin", authenticateToken, async (req, res) => {
    try {
      const { uploadAndProcessSignIn } = await import("./api/ai-document-processing");
      await uploadAndProcessSignIn(req, res);
    } catch (error) {
      console.error('AI processing route error:', error);
      res.status(500).json({ success: false, error: 'Processing failed' });
    }
  });

  app.post("/api/ai/verify-and-generate", authenticateToken, async (req, res) => {
    const { verifyAndGenerateCertificates } = await import("./api/ai-document-processing");
    return verifyAndGenerateCertificates(req, res);
  });

  // Temporarily remove auth for debugging - AI Document endpoints
  app.get("/api/ai/processed-documents", async (req, res) => {
    const { getProcessedDocuments } = await import("./api/ai-document-processing");
    return getProcessedDocuments(req, res);
  });

  app.get("/api/ai/certificates", async (req, res) => {
    const { getGeneratedCertificates } = await import("./api/ai-document-processing");
    return getGeneratedCertificates(req, res);
  });

  app.post("/api/ai/wallet-card/:certificateId", authenticateToken, async (req, res) => {
    const { generateWalletCard } = await import("./api/ai-document-processing");
    return generateWalletCard(req, res);
  });

  // Instructor-led Training Completion Routes
  app.post("/api/instructor/complete-training", authenticateToken, async (req, res) => {
    try {
      const { completeInstructorTraining } = await import("./api/instructor-training-completion");
      await completeInstructorTraining(req, res);
    } catch (error) {
      console.error('Instructor training completion route error:', error);
      res.status(500).json({ success: false, error: 'Training completion failed' });
    }
  });

  app.get("/api/instructor/training-sessions", authenticateToken, async (req, res) => {
    try {
      const { getInstructorTrainingSessions } = await import("./api/instructor-training-completion");
      await getInstructorTrainingSessions(req, res);
    } catch (error) {
      console.error('Get training sessions route error:', error);
      res.status(500).json({ success: false, error: 'Failed to fetch training sessions' });
    }
  });

  // Compliance Recommendation Engine Routes
  app.get("/api/compliance/recommendations", authenticateToken, async (req, res) => {
    const { getPersonalizedRecommendations } = await import("./api/compliance-recommendations");
    return getPersonalizedRecommendations(req, res);
  });

  app.get("/api/compliance/analytics", authenticateToken, async (req, res) => {
    const { getComplianceAnalytics } = await import("./api/compliance-recommendations");
    return getComplianceAnalytics(req, res);
  });

  app.post("/api/compliance/dismiss", authenticateToken, async (req, res) => {
    const { dismissRecommendation } = await import("./api/compliance-recommendations");
    return dismissRecommendation(req, res);
  });

  // Employee Certificate Management Routes
  app.get("/api/employees/:employeeId/certificates", authenticateToken, async (req, res) => {
    const { getEmployeeCertificates } = await import("./api/employee-certificates");
    return getEmployeeCertificates(req, res);
  });

  app.post("/api/employees/:employeeId/certificates", authenticateToken, async (req, res) => {
    const { addEmployeeCertificate } = await import("./api/employee-certificates");
    return addEmployeeCertificate(req, res);
  });

  // Generate certificate and automatically create employee certificate
  app.post("/api/certificates/generate-for-employee", authenticateToken, async (req, res) => {
    try {
      const { EmployeeCertificateService } = await import("./employee-certificate-service");
      const employeeCertService = new EmployeeCertificateService();

      const result = await employeeCertService.generateAndStoreEmployeeCertificate({
        ...req.body,
        userId: req.user?.id
      });

      res.json(result);
    } catch (error) {
      console.error("Error generating certificate for employee:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate certificate for employee" 
      });
    }
  });

  // Training Requests API routes
  app.get("/api/training-requests/:employeeId", authenticateToken, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const userId = req.user?.id;
      
      if (!userId || !employeeId) {
        return res.status(400).json({ success: false, error: 'Missing required parameters' });
      }

      const requests = await db
        .select({
          id: trainingRequests.id,
          trainingName: trainingRequests.trainingName,
          requestDate: trainingRequests.requestDate,
          status: trainingRequests.status,
          notes: trainingRequests.notes,
          scheduledDate: trainingRequests.scheduledDate,
          createdAt: trainingRequests.createdAt
        })
        .from(trainingRequests)
        .where(and(
          eq(trainingRequests.employeeId, employeeId),
          eq(trainingRequests.userId, userId)
        ))
        .orderBy(desc(trainingRequests.requestDate));

      res.json(requests);
    } catch (error) {
      console.error("Error fetching training requests:", error);
      res.status(500).json({ success: false, error: "Failed to fetch training requests" });
    }
  });

  app.post("/api/training-requests", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const validatedData = insertTrainingRequestSchema.parse({
        ...req.body,
        userId
      });

      const [request] = await db
        .insert(trainingRequests)
        .values(validatedData)
        .returning();

      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating training request:", error);
      res.status(400).json({ 
        success: false, 
        error: "Invalid training request data" 
      });
    }
  });

  // Upcoming Training API routes
  app.get("/api/upcoming-training/:employeeId", authenticateToken, async (req, res) => {
    try {
      const employeeId = parseInt(req.params.employeeId);
      const userId = req.user?.id;
      
      if (!userId || !employeeId) {
        return res.status(400).json({ success: false, error: 'Missing required parameters' });
      }

      const upcoming = await db
        .select()
        .from(upcomingTrainingSessions)
        .where(and(
          eq(upcomingTrainingSessions.employeeId, employeeId),
          eq(upcomingTrainingSessions.userId, userId)
        ))
        .orderBy(upcomingTrainingSessions.date);

      res.json(upcoming);
    } catch (error) {
      console.error("Error fetching upcoming training:", error);
      res.status(500).json({ success: false, error: "Failed to fetch upcoming training" });
    }
  });

  app.post("/api/upcoming-training", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const validatedData = insertUpcomingTrainingSessionSchema.parse({
        ...req.body,
        userId
      });

      const [training] = await db
        .insert(upcomingTrainingSessions)
        .values(validatedData)
        .returning();

      res.status(201).json(training);
    } catch (error) {
      console.error("Error creating upcoming training:", error);
      res.status(400).json({ 
        success: false, 
        error: "Invalid upcoming training data" 
      });
    }
  });

  app.put("/api/employees/:employeeId/certificates/:certificateId", authenticateToken, async (req, res) => {
    const { updateEmployeeCertificate } = await import("./api/employee-certificates");
    return updateEmployeeCertificate(req, res);
  });

  app.delete("/api/employees/:employeeId/certificates/:certificateId", authenticateToken, async (req, res) => {
    const { deleteEmployeeCertificate } = await import("./api/employee-certificates");
    return deleteEmployeeCertificate(req, res);
  });

  app.post("/api/employees/:employeeId/generate-qr-code", authenticateToken, async (req, res) => {
    const { generateEmployeeQrCode } = await import("./api/employee-certificates");
    return generateEmployeeQrCode(req, res);
  });

  app.get("/api/employees/:employeeId/qr-code", authenticateToken, async (req, res) => {
    const { getEmployeeQrCode } = await import("./api/employee-certificates");
    return getEmployeeQrCode(req, res);
  });

  // Public QR Code Access (no authentication required)
  app.get("/api/public/employee-certs/:qrCodeData", async (req, res) => {
    const { viewEmployeeCertificatesPublic } = await import("./api/employee-certificates");
    return viewEmployeeCertificatesPublic(req, res);
  });

  // AI-powered contextual help routes
  app.use("/api/ai", (await import("./routes/ai-help.js")).default);

  // Register instructor training session routes
  instructorTrainingSessionRoutes(app);

  // Serve platform documentation files
  app.use('/platform-documentation', express.static('platform-documentation'));

  const httpServer = createServer(app);

  return httpServer;
}
