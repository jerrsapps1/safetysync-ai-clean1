import { Request, Response } from "express";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

// POST /api/training/certificate
export async function generateCertificate(req: Request, res: Response) {
  try {
    const { employeeName, courseName, date, standard } = req.body;

    // Step 1: Create new PDF doc
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([612, 396]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText("Certificate of Completion", {
      x: 50,
      y: 330,
      size: 24,
      font,
      color: rgb(0.2, 0.4, 0.8),
    });

    page.drawText(`This certifies that ${employeeName}`, {
      x: 50,
      y: 280,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`has completed: ${courseName}`, {
      x: 50,
      y: 250,
      size: 16,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Date: ${date}`, {
      x: 50,
      y: 220,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });

    page.drawText(`OSHA Standard: ${standard}`, {
      x: 50,
      y: 200,
      size: 12,
      font,
      color: rgb(0.5, 0.1, 0.1),
    });

    // Step 2: Serialize PDF
    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=certificate.pdf`);
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("Cert generation failed:", err);
    res.status(500).json({ error: "Failed to generate certificate." });
  }
}