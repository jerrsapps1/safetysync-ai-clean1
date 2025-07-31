import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { TrainingRecord, saveTrainingRecord } from "../../models/training-record";
import { generateCertificate } from "./certificate-generator";
import { generateWalletCard } from "./wallet-card-generator";

const router = express.Router();

// Setup multer for file handling
const upload = multer({ dest: "uploads/" });

// POST /api/training/upload
router.post("/training/upload", upload.single("trainingRecord"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    // 🧠 Placeholder for AI document parsing (Google Document AI or GPT-4o)
    // const parsedData = await parseTrainingRecord(file.path);

    // ⬇ Simulate AI results for now
    const parsedData = {
      course: "Fall Protection",
      date: "2025-07-30",
      instructor: "Jane Doe",
      employees: ["Gerardo Hernandez", "Maria Gomez"],
      standard: "1926.503",
    };

    // Create training record with proper structure
    const trainingRecord: TrainingRecord = {
      id: `tr_${Date.now()}`,
      course: parsedData.course,
      date: parsedData.date,
      instructor: parsedData.instructor,
      employees: parsedData.employees,
      standard: parsedData.standard,
      documentUrl: file.path,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save to database (placeholder)
    saveTrainingRecord(trainingRecord);

    return res.json({ success: true, data: trainingRecord });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/training/certificate
router.post("/training/certificate", generateCertificate);

// POST /api/training/wallet-card
router.post("/training/wallet-card", generateWalletCard);

export default router;