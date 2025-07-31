import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

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

    // 🔗 Placeholder logic: store parsedData to DB
    console.log("Parsed Training Data:", parsedData);

    return res.json({ success: true, data: parsedData });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

export default router;