import express from "express";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { supportTickets } from "../../shared/schema";
import authenticateJWT from "../middleware/authenticateJWT";
import { parse } from "json2csv";

const router = express.Router();



// GET /api/support
router.get("/", authenticateJWT, async (req, res) => {
  const { status, urgency, resolved } = req.query;

  try {
    const allTickets = await db.select().from(supportTickets);
    let filtered = allTickets;

    if (status) filtered = filtered.filter((t) => t.status === status);
    if (urgency) filtered = filtered.filter((t) => t.urgency === urgency);
    if (resolved !== undefined)
      filtered = filtered.filter((t) => t.resolved === (resolved === "true"));

    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch support tickets." });
  }
});

// PATCH /api/support/:id
router.patch("/:id", authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    await db.update(supportTickets).set(updates).where(eq(supportTickets.id, Number(id)));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update ticket." });
  }
});

// GET /api/support/export/csv
router.get("/export/csv", authenticateJWT, async (req, res) => {
  try {
    const tickets = await db.select().from(supportTickets);
    const csv = parse(tickets);
    res.header("Content-Type", "text/csv");
    res.attachment("support_tickets.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "CSV export failed." });
  }
});

export default router;