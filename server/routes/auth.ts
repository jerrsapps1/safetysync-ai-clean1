import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

// Simple admin login endpoint for testing
router.post("/admin-login", async (req, res) => {
  const { username, password } = req.body;
  
  // Simple admin credentials for testing
  if (username === "admin" && password === "admin123") {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET not configured" });
    }
    
    const token = jwt.sign(
      { 
        id: 1, 
        username: "admin", 
        role: "admin",
        isAdmin: true 
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    res.json({ 
      success: true, 
      token,
      message: "Admin login successful" 
    });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

export default router;