import { Router } from "express";
import { db } from "../db";
import { supportTickets } from "../../shared/schema";
import { eq, desc } from "drizzle-orm";

const router = Router();

// GET all support tickets
router.get("/", async (req, res) => {
  try {
    const data = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
    res.json(data);
  } catch (err) {
    console.error("Error loading support tickets:", err);
    res.status(500).json({ error: "Failed to load tickets." });
  }
});

// GET specific support ticket by ID
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  
  try {
    const [ticket] = await db.select().from(supportTickets).where(eq(supportTickets.id, id));
    
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found." });
    }
    
    res.json(ticket);
  } catch (err) {
    console.error("Error loading support ticket:", err);
    res.status(500).json({ error: "Failed to load ticket." });
  }
});

// PATCH update a support ticket
router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updates = req.body;

  try {
    await db.update(supportTickets)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(supportTickets.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error("Error updating support ticket:", err);
    res.status(500).json({ error: "Failed to update ticket." });
  }
});

// PATCH assign ticket to support agent
router.patch("/:id/assign", async (req, res) => {
  const id = parseInt(req.params.id);
  const { assignedTo } = req.body;

  try {
    await db.update(supportTickets)
      .set({
        assignedTo,
        status: 'Open',
        updatedAt: new Date(),
      })
      .where(eq(supportTickets.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error("Error assigning support ticket:", err);
    res.status(500).json({ error: "Failed to assign ticket." });
  }
});

// PATCH resolve ticket
router.patch("/:id/resolve", async (req, res) => {
  const id = parseInt(req.params.id);
  const { internalNotes } = req.body;

  try {
    await db.update(supportTickets)
      .set({
        status: 'Resolved',
        resolved: true,
        internalNotes,
        updatedAt: new Date(),
      })
      .where(eq(supportTickets.id, id));
    res.json({ success: true });
  } catch (err) {
    console.error("Error resolving support ticket:", err);
    res.status(500).json({ error: "Failed to resolve ticket." });
  }
});

export default router;