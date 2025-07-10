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

// Enhanced Employee Management
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  employeeId: text("employee_id").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  position: text("position"),
  department: text("department"),
  division: text("division"),
  location: text("location"),
  hireDate: timestamp("hire_date"),
  status: text("status", { enum: ["active", "inactive", "on_leave", "terminated"] }).default("active"),
  role: text("role", { enum: ["employee", "supervisor", "manager", "admin"] }).default("employee"),
  profileImage: text("profile_image"),
  emergencyContact: jsonb("emergency_contact"), // {name, phone, relationship}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training Programs and Courses
export const trainingPrograms = pgTable("training_programs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // OSHA, safety, compliance, etc.
  duration: integer("duration"), // in minutes
  validityPeriod: integer("validity_period"), // in days
  isRequired: boolean("is_required").default(false),
  requiresEvaluation: boolean("requires_evaluation").default(false),
  oshaStandard: text("osha_standard"), // 29 CFR reference
  materials: jsonb("materials"), // Array of documents, videos, etc.
  instructor: text("instructor"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training Sessions/Schedules
export const trainingSessions = pgTable("training_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  trainingProgramId: integer("training_program_id").references(() => trainingPrograms.id).notNull(),
  sessionName: text("session_name").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  location: text("location"),
  capacity: integer("capacity").default(20),
  instructor: text("instructor"),
  status: text("status", { enum: ["scheduled", "in_progress", "completed", "cancelled"] }).default("scheduled"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employee Training Records
export const employeeTraining = pgTable("employee_training", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  trainingProgramId: integer("training_program_id").references(() => trainingPrograms.id).notNull(),
  sessionId: integer("session_id").references(() => trainingSessions.id),
  status: text("status", { enum: ["assigned", "in_progress", "completed", "failed", "expired"] }).default("assigned"),
  assignedDate: timestamp("assigned_date").defaultNow(),
  startedDate: timestamp("started_date"),
  completedDate: timestamp("completed_date"),
  expirationDate: timestamp("expiration_date"),
  score: decimal("score", { precision: 5, scale: 2 }),
  certificateUrl: text("certificate_url"),
  evaluationRequired: boolean("evaluation_required").default(false),
  evaluationCompleted: boolean("evaluation_completed").default(false),
  evaluationDate: timestamp("evaluation_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Certificates Generated
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  trainingRecordId: integer("training_record_id").references(() => employeeTraining.id).notNull(),
  certificateNumber: text("certificate_number").notNull().unique(),
  certificateType: text("certificate_type", { enum: ["certificate", "wallet_card"] }).notNull(),
  format: text("format", { enum: ["pdf", "digital"] }).notNull(),
  filePath: text("file_path"),
  issuedDate: timestamp("issued_date").defaultNow(),
  expirationDate: timestamp("expiration_date"),
  instructorName: text("instructor_name"),
  instructorCredentials: text("instructor_credentials"),
  oshaStandards: text("osha_standards").array(),
  equipmentAuthorized: text("equipment_authorized").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Document Management
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // policy, procedure, form, safety_data_sheet, etc.
  fileType: text("file_type").notNull(), // pdf, doc, jpg, etc.
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  tags: text("tags").array(),
  isPublic: boolean("is_public").default(false),
  department: text("department"),
  location: text("location"),
  uploadedBy: integer("uploaded_by").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit Trail for Compliance Tracking
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  entityType: text("entity_type").notNull(), // employee, training, certificate, etc.
  entityId: integer("entity_id").notNull(),
  action: text("action").notNull(), // create, update, delete, assign, complete, etc.
  oldValues: jsonb("old_values"),
  newValues: jsonb("new_values"),
  performedBy: integer("performed_by").references(() => employees.id),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Email Notifications and Reminders
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  recipientId: integer("recipient_id").references(() => employees.id).notNull(),
  type: text("type").notNull(), // training_reminder, certification_expiry, audit_due, etc.
  title: text("title").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["pending", "sent", "failed", "read"] }).default("pending"),
  priority: text("priority", { enum: ["low", "medium", "high", "urgent"] }).default("medium"),
  scheduledFor: timestamp("scheduled_for"),
  sentAt: timestamp("sent_at"),
  readAt: timestamp("read_at"),
  metadata: jsonb("metadata"), // Additional context data
  createdAt: timestamp("created_at").defaultNow(),
});

// Integration APIs and External Systems
export const integrations = pgTable("integrations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // hris, lms, erp, etc.
  provider: text("provider"), // workday, successfactors, cornerstone, etc.
  configuration: jsonb("configuration"), // API keys, endpoints, mappings
  status: text("status", { enum: ["active", "inactive", "error"] }).default("inactive"),
  lastSync: timestamp("last_sync"),
  syncFrequency: text("sync_frequency"), // daily, weekly, monthly
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Locations and Multi-site Support
export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zip_code"),
  country: text("country").default("US"),
  timezone: text("timezone").default("America/New_York"),
  manager: integer("manager_id").references(() => employees.id),
  isActive: boolean("is_active").default(true),
  facilities: jsonb("facilities"), // Array of facility types
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

// New schemas for enhanced functionality
export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainingProgramSchema = createInsertSchema(trainingPrograms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTrainingSessionSchema = createInsertSchema(trainingSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmployeeTrainingSchema = createInsertSchema(employeeTraining).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({
  id: true,
  timestamp: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertIntegrationSchema = createInsertSchema(integrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLocationSchema = createInsertSchema(locations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Type exports
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

// Enhanced functionality types
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;
export type InsertTrainingProgram = z.infer<typeof insertTrainingProgramSchema>;
export type TrainingProgram = typeof trainingPrograms.$inferSelect;
export type InsertTrainingSession = z.infer<typeof insertTrainingSessionSchema>;
export type TrainingSession = typeof trainingSessions.$inferSelect;
export type InsertEmployeeTraining = z.infer<typeof insertEmployeeTrainingSchema>;
export type EmployeeTraining = typeof employeeTraining.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;
export type Certificate = typeof certificates.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertIntegration = z.infer<typeof insertIntegrationSchema>;
export type Integration = typeof integrations.$inferSelect;
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;
