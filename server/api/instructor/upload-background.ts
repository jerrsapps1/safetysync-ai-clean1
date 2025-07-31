// File: server/api/instructor/upload-background.ts

import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const uploadPath = path.join(__dirname, "../../uploads/instructor-backgrounds");

if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const instructorId = req.user?.id || "anonymous"; // JWT auth expected
    const ext = path.extname(file.originalname);
    cb(null, `${instructorId}-cert-background${ext}`);
  },
});

const upload = multer({ storage });

router.post("/instructor/upload-background", upload.single("backgroundImage"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded." });
    return res.json({ success: true, filePath: `/uploads/instructor-backgrounds/${req.file.filename}` });
  } catch (err) {
    console.error("Instructor background upload error:", err);
    return res.status(500).json({ error: "Upload failed." });
  }
});

export default router;