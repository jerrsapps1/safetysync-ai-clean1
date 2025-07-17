import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar, date } from "drizzle-orm/pg-core";
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

export const ticketResponses = pgTable("ticket_responses", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id").references(() => helpDeskTickets.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  isStaff: boolean("is_staff").default(false),
  author: text("author").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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

// Instructors Management
export const instructors = pgTable("instructors", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  credentials: text("credentials"),
  company: text("company"),
  email: text("email"),
  phone: text("phone"),
  specializations: text("specializations").array(),
  type: text("type", { enum: ["internal", "visiting"] }).default("internal"),
  isActive: boolean("is_active").default(true),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// External Students Management
export const externalStudents = pgTable("external_students", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email"),
  phone: text("phone"),
  company: text("company").notNull(),
  position: text("position"),
  department: text("department"),
  studentId: text("student_id"), // External student ID or badge number
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
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
  userTier: true,
  subscriptionStatus: true,
}).extend({
  termsAccepted: z.boolean().optional(),
  termsAcceptedAt: z.string().optional(),
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

export const insertInstructorSchema = createInsertSchema(instructors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExternalStudentSchema = createInsertSchema(externalStudents).omit({
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

// Client Portal Tables
export const specials = pgTable("specials", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  discount: varchar("discount", { length: 100 }).notNull(),
  validUntil: date("valid_until").notNull(),
  badge: varchar("badge", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const featureUpdates = pgTable("feature_updates", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  releaseDate: date("release_date").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'released' or 'coming-soon'
  category: varchar("category", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const upcomingSoftware = pgTable("upcoming_software", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  expectedRelease: varchar("expected_release", { length: 50 }).notNull(),
  votes: integer("votes").default(0),
  category: varchar("category", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const softwareVotes = pgTable("software_votes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  softwareId: integer("software_id").notNull().references(() => upcomingSoftware.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clientComments = pgTable("client_comments", {
  id: serial("id").primaryKey(),
  userName: varchar("user_name", { length: 255 }).notNull(),
  text: text("text").notNull(),
  likes: integer("likes").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentLikes = pgTable("comment_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  commentId: integer("comment_id").notNull().references(() => clientComments.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// File Management System Tables
export const fileSystemFolders = pgTable("file_system_folders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  parentId: integer("parent_id").references(() => fileSystemFolders.id),
  path: text("path").notNull(), // Full path like "/Documents/Training Records/Fall Protection"
  isRoot: boolean("is_root").default(false),
  color: text("color").default("#3b82f6"), // Folder color
  icon: text("icon").default("folder"), // Folder icon
  isShared: boolean("is_shared").default(false),
  permissions: jsonb("permissions"), // Access permissions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fileSystemFiles = pgTable("file_system_files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  folderId: integer("folder_id").references(() => fileSystemFolders.id),
  name: text("name").notNull(),
  originalName: text("original_name").notNull(),
  fileName: text("file_name").notNull(), // Stored filename
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  fileExtension: text("file_extension"),
  filePath: text("file_path").notNull(), // Storage path
  fileUrl: text("file_url"), // Access URL
  description: text("description"),
  tags: text("tags").array(),
  isShared: boolean("is_shared").default(false),
  permissions: jsonb("permissions"), // Access permissions
  downloadCount: integer("download_count").default(0),
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const fileSystemShares = pgTable("file_system_shares", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  itemId: integer("item_id").notNull(), // Can be file or folder ID
  itemType: text("item_type", { enum: ["file", "folder"] }).notNull(),
  shareType: text("share_type", { enum: ["public", "private", "link"] }).default("private"),
  shareToken: text("share_token").unique(),
  permissions: text("permissions", { enum: ["read", "write", "admin"] }).default("read"),
  expiresAt: timestamp("expires_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fileSystemFavorites = pgTable("file_system_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  itemId: integer("item_id").notNull(), // Can be file or folder ID
  itemType: text("item_type", { enum: ["file", "folder"] }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const fileSystemRecent = pgTable("file_system_recent", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  itemId: integer("item_id").notNull(), // Can be file or folder ID
  itemType: text("item_type", { enum: ["file", "folder"] }).notNull(),
  accessedAt: timestamp("accessed_at").defaultNow(),
});

export const insertSpecialSchema = createInsertSchema(specials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFeatureUpdateSchema = createInsertSchema(featureUpdates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUpcomingSoftwareSchema = createInsertSchema(upcomingSoftware).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientCommentSchema = createInsertSchema(clientComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// File Management Insert Schemas
export const insertFileSystemFolderSchema = createInsertSchema(fileSystemFolders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSystemFileSchema = createInsertSchema(fileSystemFiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFileSystemShareSchema = createInsertSchema(fileSystemShares).omit({
  id: true,
  createdAt: true,
});

export const insertFileSystemFavoriteSchema = createInsertSchema(fileSystemFavorites).omit({
  id: true,
  createdAt: true,
});

export const insertFileSystemRecentSchema = createInsertSchema(fileSystemRecent).omit({
  id: true,
  accessedAt: true,
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
export type InsertInstructor = z.infer<typeof insertInstructorSchema>;
export type Instructor = typeof instructors.$inferSelect;
export type InsertExternalStudent = z.infer<typeof insertExternalStudentSchema>;
export type ExternalStudent = typeof externalStudents.$inferSelect;
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

export type InsertSpecial = z.infer<typeof insertSpecialSchema>;
export type Special = typeof specials.$inferSelect;
export type InsertFeatureUpdate = z.infer<typeof insertFeatureUpdateSchema>;
export type FeatureUpdate = typeof featureUpdates.$inferSelect;
export type InsertUpcomingSoftware = z.infer<typeof insertUpcomingSoftwareSchema>;
export type UpcomingSoftware = typeof upcomingSoftware.$inferSelect;
export type InsertClientComment = z.infer<typeof insertClientCommentSchema>;
export type ClientComment = typeof clientComments.$inferSelect;

// File Management Types
export type FileSystemFolder = typeof fileSystemFolders.$inferSelect;
export type InsertFileSystemFolder = z.infer<typeof insertFileSystemFolderSchema>;
export type FileSystemFile = typeof fileSystemFiles.$inferSelect;
export type InsertFileSystemFile = z.infer<typeof insertFileSystemFileSchema>;
export type FileSystemShare = typeof fileSystemShares.$inferSelect;
export type InsertFileSystemShare = z.infer<typeof insertFileSystemShareSchema>;
export type FileSystemFavorite = typeof fileSystemFavorites.$inferSelect;
export type InsertFileSystemFavorite = z.infer<typeof insertFileSystemFavoriteSchema>;
export type FileSystemRecent = typeof fileSystemRecent.$inferSelect;
export type InsertFileSystemRecent = z.infer<typeof insertFileSystemRecentSchema>;

// Company Profile Schema
export const companyProfiles = pgTable("company_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  companySize: text("company_size").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  country: text("country").notNull().default("United States"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  website: text("website"),
  description: text("description"),
  safetyOfficer: text("safety_officer").notNull(),
  safetyOfficerEmail: text("safety_officer_email").notNull(),
  safetyOfficerPhone: text("safety_officer_phone").notNull(),
  complianceManager: text("compliance_manager").notNull(),
  complianceManagerEmail: text("compliance_manager_email").notNull(),
  primaryColor: text("primary_color").default("#10b981"),
  secondaryColor: text("secondary_color").default("#1e40af"),
  showBranding: boolean("show_branding").default(true),
  customDomain: text("custom_domain"),
  logoUrl: text("logo_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCompanyProfileSchema = createInsertSchema(companyProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTicketResponseSchema = createInsertSchema(ticketResponses).omit({
  id: true,
  createdAt: true,
});

export type InsertCompanyProfile = z.infer<typeof insertCompanyProfileSchema>;
export type CompanyProfile = typeof companyProfiles.$inferSelect;
export type InsertTicketResponse = z.infer<typeof insertTicketResponseSchema>;
export type TicketResponse = typeof ticketResponses.$inferSelect;
