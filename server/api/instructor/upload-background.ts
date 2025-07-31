// File: server/api/instructor/upload-background.ts

import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for background image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "backgrounds");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `background-${timestamp}${ext}`);
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Only allow image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

export const uploadBackground = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// POST /api/instructor/upload-background
export async function handleBackgroundUpload(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const backgroundUrl = `/uploads/backgrounds/${req.file.filename}`;
    
    // Log the upload for tracking
    console.log(`Background image uploaded: ${req.file.filename}`);
    
    res.json({
      message: "Background image uploaded successfully",
      backgroundUrl: backgroundUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error("Background upload error:", error);
    res.status(500).json({ error: "Background upload failed" });
  }
}