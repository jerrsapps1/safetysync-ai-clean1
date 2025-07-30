import { Router } from "express";
import { db } from "../db";
import { supportTickets } from "../../shared/schema";
import { eq, desc } from "drizzle-orm";
import authenticateJWT from "../middleware/authenticateJWT";
import { insertSupportTicketSchema } from "../../shared/schema";

const router = Router();

// POST create new support ticket (public endpoint for customers)
router.post("/", async (req, res) => {
  try {
    const validatedData = insertSupportTicketSchema.parse(req.body);
    
    const [ticket] = await db.insert(supportTickets)
      .values({
        ...validatedData,
        status: 'New',
        resolved: false,
      })
      .returning();

    console.log('Support ticket created:', {
      id: ticket.id,
      name: ticket.name,
      email: ticket.email,
      topic: ticket.topic,
      urgency: ticket.urgency,
      timestamp: new Date().toISOString()
    });

    res.json({
      success: true,
      message: "Support request submitted successfully. We'll get back to you within 24 hours.",
      ticketId: ticket.id
    });
  } catch (err) {
    console.error("Error creating support ticket:", err);
    res.status(500).json({ error: "Failed to submit support request." });
  }
});

// GET all support tickets (admin only)
router.get("/", authenticateJWT, async (req, res) => {
  try {
    const data = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
    res.json(data);
  } catch (err) {
    console.error("Error loading support tickets:", err);
    res.status(500).json({ error: "Failed to load tickets." });
  }
});

// GET specific support ticket by ID (admin only)
router.get("/:id", authenticateJWT, async (req, res) => {
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

// PATCH update a support ticket (admin only)
router.patch("/:id", authenticateJWT, async (req, res) => {
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

// PATCH assign ticket to support agent (admin only)
router.patch("/:id/assign", authenticateJWT, async (req, res) => {
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

// PATCH resolve ticket (admin only)
router.patch("/:id/resolve", authenticateJWT, async (req, res) => {
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