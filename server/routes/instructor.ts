// File: server/routes/instructor.ts

import express from "express";
import { uploadBackground, handleBackgroundUpload } from "../api/instructor/upload-background";

const router = express.Router();

// POST /api/instructor/upload-background
router.post("/upload-background", uploadBackground.single("backgroundImage"), handleBackgroundUpload);

export default router;