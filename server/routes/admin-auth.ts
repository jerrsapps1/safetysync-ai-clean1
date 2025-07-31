import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// Simple admin login endpoint for testing
router.post("/admin-login", async (req, res) => {
  try {
    console.log("Login attempt:", req.body);
    const { username, password } = req.body || {};
    
    // Simple demo credentials (in production, use proper user authentication)
    if (username === "admin" && password === "password") {
      const token = jwt.sign(
        { 
          userId: 1, 
          username: "admin", 
          isAdmin: true,
          role: "administrator"
        },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );
      
      res.json({
        success: true,
        token,
        message: "Authentication successful",
        user: { username: "admin", role: "administrator" }
      });
    } else {
      res.status(401).json({
        success: false,
        error: "Invalid credentials"
      });
    }
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

// Token verification endpoint
router.get("/verify-token", (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    res.json({
      success: true,
      decoded,
      message: "Token is valid"
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      error: "Invalid or expired token"
    });
  }
});

export default router;