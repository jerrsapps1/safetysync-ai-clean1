import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  company: text("company"),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
  isAdmin: boolean("is_admin").default(false),
  userTier: text("user_tier", { enum: ["free_trial", "basic", "professional", "enterprise"] }).default("free_trial"),
  subscriptionStatus: text("subscription_status", { enum: ["active", "expired", "cancelled", "pending"] }).default("pending"),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
  totalLogins: integer("total_logins").default(0),
  employeeCount: integer("employee_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  phone: text("phone"),
  message: text("message"),
  leadType: text("lead_type").notNull(), // 'trial' or 'demo'
  termsAccepted: boolean("terms_accepted").default(false),
  termsAcceptedAt: timestamp("terms_accepted_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complianceReports = pgTable("compliance_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  reportName: text("report_name").notNull(),
  reportType: text("report_type").notNull(), // 'full', 'summary', 'audit', 'training'
  reportData: text("report_data").notNull(), // JSON string containing report data
  generatedAt: timestamp("generated_at").defaultNow(),
  periodStart: timestamp("period_start"),
  periodEnd: timestamp("period_end"),
});

export const cloneDetectionScans = pgTable("clone_detection_scans", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  scanType: text("scan_type").notNull(), // 'manual', 'scheduled', 'bulk'
  targetUrls: jsonb("target_urls").notNull(), // Array of URLs to scan
  results: jsonb("results").notNull(), // Detection results
  status: text("status").notNull(), // 'pending', 'running', 'completed', 'failed'
  totalSites: integer("total_sites").notNull().default(0),
  clonesDetected: integer("clones_detected").notNull().default(0),
  highRiskSites: integer("high_risk_sites").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const helpDeskTickets = pgTable("help_desk_tickets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  ticketNumber: text("ticket_number").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium"),
  status: text("status", { enum: ["open", "in_progress", "resolved", "closed"] }).default("open"),
  category: text("category").notNull(), // 'sync_escalation', 'technical_support', 'compliance_question', 'training_issue'
  syncContext: jsonb("sync_context"), // SYNC conversation context and parameters
  assignedTo: text("assigned_to"), // Admin user who takes the ticket
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

// Promo code usage tracking - 30-day expiration from purchase
export const promoCodeUsage = pgTable("promo_code_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  promoCode: text("promo_code").notNull(),
  usedAt: timestamp("used_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at").notNull(), // 30 days from usedAt
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }),
  discountType: text("discount_type").notNull(), // 'percentage', 'fixed', 'months'
  planTier: text("plan_tier").notNull(),
  isActive: boolean("is_active").default(true),
  orderId: text("order_id"), // Link to billing system
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
  company: true,
  phone: true,
});

export const loginUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export const insertComplianceReportSchema = createInsertSchema(complianceReports).omit({
  id: true,
  generatedAt: true,
});

export const insertCloneDetectionScanSchema = createInsertSchema(cloneDetectionScans).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertHelpDeskTicketSchema = createInsertSchema(helpDeskTickets).omit({
  id: true,
  ticketNumber: true,
  createdAt: true,
  updatedAt: true,
  resolvedAt: true,
});

export const insertPromoCodeUsageSchema = createInsertSchema(promoCodeUsage).omit({
  id: true,
  usedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
export type InsertComplianceReport = z.infer<typeof insertComplianceReportSchema>;
export type ComplianceReport = typeof complianceReports.$inferSelect;
export type InsertCloneDetectionScan = z.infer<typeof insertCloneDetectionScanSchema>;
export type CloneDetectionScan = typeof cloneDetectionScans.$inferSelect;
export type InsertHelpDeskTicket = z.infer<typeof insertHelpDeskTicketSchema>;
export type HelpDeskTicket = typeof helpDeskTickets.$inferSelect;
export type InsertPromoCodeUsage = z.infer<typeof insertPromoCodeUsageSchema>;
export type PromoCodeUsage = typeof promoCodeUsage.$inferSelect;
