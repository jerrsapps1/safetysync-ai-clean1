import { Router } from "express";
import { db } from "../db";
import { supportTickets } from "../../shared/schema";
import { eq, desc, and } from "drizzle-orm";
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
    const { status, urgency, resolved } = req.query;
    
    // Build where conditions
    const conditions = [];
    if (status && typeof status === 'string') {
      conditions.push(eq(supportTickets.status, status));
    }
    if (urgency && typeof urgency === 'string') {
      conditions.push(eq(supportTickets.urgency, urgency));
    }
    if (resolved !== undefined && typeof resolved === 'string') {
      conditions.push(eq(supportTickets.resolved, resolved === 'true'));
    }
    
    let query = db.select().from(supportTickets);
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    const data = await query.orderBy(desc(supportTickets.createdAt));
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

// GET CSV export of support tickets (admin only)
router.get("/export/csv", authenticateJWT, async (req, res) => {
  try {
    const tickets = await db.select().from(supportTickets).orderBy(desc(supportTickets.createdAt));
    
    // Create CSV content
    const headers = ['ID', 'Name', 'Email', 'Company', 'Role', 'Topic', 'Urgency', 'Status', 'Message', 'Internal Notes', 'Assigned To', 'Resolved', 'Created At', 'Updated At'];
    const csvContent = [
      headers.join(','),
      ...tickets.map(ticket => [
        ticket.id,
        `"${ticket.name}"`,
        `"${ticket.email}"`,
        `"${ticket.company || ''}"`,
        `"${ticket.role || ''}"`,
        `"${ticket.topic || ''}"`,
        `"${ticket.urgency || ''}"`,
        `"${ticket.status || ''}"`,
        `"${ticket.message.replace(/"/g, '""')}"`,
        `"${(ticket.internalNotes || '').replace(/"/g, '""')}"`,
        `"${ticket.assignedTo || ''}"`,
        ticket.resolved ? 'Yes' : 'No',
        `"${ticket.createdAt}"`,
        `"${ticket.updatedAt || ''}"`
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="support-tickets-${new Date().toISOString().split('T')[0]}.csv"`);
    res.send(csvContent);
  } catch (err) {
    console.error("Error exporting CSV:", err);
    res.status(500).json({ error: "Failed to export CSV." });
  }
});

export default router;