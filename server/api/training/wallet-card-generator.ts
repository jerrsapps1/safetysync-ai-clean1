import { Request, Response } from "express";
import { createCanvas, loadImage } from "canvas";
import path from "path";

// POST /api/training/wallet-card
export async function generateWalletCard(req: Request, res: Response) {
  try {
    const { employeeName, courseName, date, standard, backgroundUrl } = req.body;

    const width = 480;
    const height = 280;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    if (backgroundUrl) {
      try {
        // Support both uploaded backgrounds and external URLs
        let imagePath;
        if (backgroundUrl.startsWith('/uploads/instructor-backgrounds/')) {
          imagePath = path.join(__dirname, "../../uploads/instructor-backgrounds", path.basename(backgroundUrl));
        } else if (backgroundUrl.startsWith('/uploads/')) {
          imagePath = path.join(process.cwd(), backgroundUrl.replace('/uploads/', 'uploads/'));
        } else {
          imagePath = backgroundUrl;
        }
        const bgImage = await loadImage(imagePath);
        ctx.drawImage(bgImage, 0, 0, width, height);
      } catch (error) {
        console.warn("Could not load background image, using default:", error);
        ctx.fillStyle = "#002855"; // Fallback to default
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      ctx.fillStyle = "#002855"; // Default deep blue background
      ctx.fillRect(0, 0, width, height);
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Training Wallet Card", 20, 40);

    ctx.font = "16px Arial";
    ctx.fillText(`Name: ${employeeName}`, 20, 80);
    ctx.fillText(`Course: ${courseName}`, 20, 110);
    ctx.fillText(`Date: ${date}`, 20, 140);
    ctx.fillText(`OSHA Standard: ${standard}`, 20, 170);

    ctx.font = "12px Arial";
    ctx.fillText("Scan QR code for verification", 20, 220);

    // Generate PNG buffer
    const buffer = canvas.toBuffer("image/png");
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline; filename=wallet-card.png");
    res.send(buffer);
  } catch (err) {
    console.error("Wallet card error:", err);
    res.status(500).json({ error: "Wallet card generation failed." });
  }
}