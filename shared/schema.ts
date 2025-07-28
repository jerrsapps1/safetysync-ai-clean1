import { pgTable, text, serial, integer, boolean, timestamp, jsonb, decimal, varchar, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
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
  isEmailVerified: boolean("is_email_verified").default(false),
  emailVerificationToken: varchar("email_verification_token", { length: 255 }),
  emailVerificationExpires: timestamp("email_verification_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  role: text("role"), // User's role/title
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

// Shopping cart items
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"), // For anonymous users
  itemType: text("item_type").notNull(), // 'certificate', 'wallet_card', 'training_package', 'ai_credits', 'branding_package'
  itemName: text("item_name").notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  discountApplied: decimal("discount_applied", { precision: 10, scale: 2 }).default("0"),
  metadata: jsonb("metadata"), // Additional item details
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Purchase orders
export const purchaseOrders = pgTable("purchase_orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  orderNumber: text("order_number").notNull().unique(),
  status: text("status", { enum: ["pending", "processing", "completed", "failed", "refunded"] }).default("pending"),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method"), // 'stripe', 'paypal', 'invoice'
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Purchase order items
export const purchaseOrderItems = pgTable("purchase_order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => purchaseOrders.id).notNull(),
  itemType: text("item_type").notNull(),
  itemName: text("item_name").notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  metadata: jsonb("metadata"),
});

// Certificate and wallet card balances
export const userBalances = pgTable("user_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  certificatesRemaining: integer("certificates_remaining").default(0),
  walletCardsRemaining: integer("wallet_cards_remaining").default(0),
  aiCreditsRemaining: integer("ai_credits_remaining").default(0),
  lastPurchaseAt: timestamp("last_purchase_at"),
  lowBalanceAlertSent: boolean("low_balance_alert_sent").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Certificate and wallet card usage tracking
export const usageHistory = pgTable("usage_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  itemType: text("item_type").notNull(), // 'certificate', 'wallet_card', 'ai_credit'
  action: text("action").notNull(), // 'purchased', 'used', 'refunded'
  quantity: integer("quantity").notNull(),
  description: text("description"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
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

// Employee Certificates - stores all certificates for each employee profile
export const employeeCertificates = pgTable("employee_certificates", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  certificateName: text("certificate_name").notNull(),
  certificationType: text("certificate_type").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  expirationDate: timestamp("expiration_date"),
  issuingOrganization: text("issuing_organization"),
  instructorName: text("instructor_name"),
  instructorCredentials: text("instructor_credentials"),
  trainingStandards: text("training_standards").array(),
  certificateNumber: text("certificate_number"),
  certificateFilePath: text("certificate_file_path"), // File path for certificate
  walletCardFilePath: text("wallet_card_file_path"), // File path for wallet card
  uploadedFromExternal: boolean("uploaded_from_external").default(false), // From previous company
  notes: text("notes"), // HR notes about the certificate
  status: text("status", { enum: ["active", "expired", "revoked"] }).default("active"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Employee QR Codes - for quick access to all certificates
export const employeeQrCodes = pgTable("employee_qr_codes", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  qrCodeData: text("qr_code_data").notNull(), // Unique identifier for QR access
  qrCodeImagePath: text("qr_code_image_path"), // Path to QR code image file
  isActive: boolean("is_active").default(true),
  accessCount: integer("access_count").default(0), // Track how many times scanned
  lastAccessedAt: timestamp("last_accessed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Training requests from employees AND instructor-led training tracking
export const trainingRequests = pgTable("training_requests", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id), // Optional for instructor-led
  userId: integer("user_id").references(() => users.id).notNull(),
  employeeName: text("employee_name"), // For instructor-led training with multiple employees
  requestType: text("request_type").default("employee_request"), // employee_request, instructor_led
  trainingName: text("training_name"), // Deprecated - use trainingType
  trainingType: text("training_type").notNull(),
  urgency: text("urgency").default("standard"), // low, standard, high, urgent
  preferredDate: timestamp("preferred_date"),
  location: text("location"),
  specialRequirements: text("special_requirements"),
  requestDate: timestamp("request_date").defaultNow(),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, scheduled, completed
  notes: text("notes"),
  approvedBy: integer("approved_by").references(() => employees.id),
  scheduledDate: timestamp("scheduled_date"),
  completedAt: timestamp("completed_at"), // For instructor-led completions
  createdAt: timestamp("created_at").defaultNow(),
});

// Upcoming training sessions for employees AND instructor-led sessions
export const upcomingTrainingSessions = pgTable("upcoming_training_sessions", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id), // Optional for instructor-led
  userId: integer("user_id").references(() => users.id).notNull(),
  sessionType: text("session_type").default("employee_session"), // employee_session, instructor_led
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  location: text("location"),
  duration: text("duration"),
  trainer: text("trainer"),
  plannedAttendees: integer("planned_attendees").default(1),
  actualAttendees: integer("actual_attendees"),
  status: varchar("status", { length: 20 }).default("scheduled"), // scheduled, in_progress, completed, cancelled
  trainingStandards: text("training_standards").array(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI Generated Certificates (Legacy - for backward compatibility)
export const certificates = pgTable("certificates", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  employeeName: text("employee_name").notNull(),
  employeeId: text("employee_id"),
  certificationType: text("certificate_type").notNull(),
  issueDate: timestamp("issue_date").notNull(),
  expirationDate: timestamp("expiration_date").notNull(),
  instructorName: text("instructor_name").notNull(),
  instructorCredentials: text("instructor_credentials").notNull(),
  trainingStandards: text("training_standards").array().notNull(),
  certificateNumber: text("certificate_number").notNull(), // Unique certificate number
  certificateContent: text("certificate_content").notNull(), // URL to certificate file
  walletCardContent: text("wallet_card_content"), // URL to wallet card file
  status: text("status", { enum: ["active", "expired", "revoked"] }).default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Document Management
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category", { 
    enum: [
      "sign_in_sheet", "training_material", "certificate", "instructor_resource", 
      "student_record", "evaluation_form", "training_roster", "compliance_doc",
      "policy", "procedure", "form", "safety_data_sheet", "other"
    ] 
  }).notNull(),
  fileType: text("file_type").notNull(), // pdf, doc, jpg, etc.
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size"),
  tags: text("tags").array(),
  isPublic: boolean("is_public").default(false),
  department: text("department"),
  location: text("location"),
  uploadedBy: integer("uploaded_by").references(() => employees.id),
  // Training-specific fields
  trainingSessionId: integer("training_session_id").references(() => trainingSessions.id),
  instructorId: integer("instructor_id").references(() => instructors.id),
  employeeId: integer("employee_id").references(() => employees.id),
  expirationDate: timestamp("expiration_date"),
  status: text("status", { enum: ["active", "expired", "archived", "pending_review"] }).default("active"),
  accessLevel: text("access_level", { enum: ["public", "internal", "restricted", "confidential"] }).default("internal"),
  version: text("version").default("1.0"),
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

// Schema types for Employee Certificates
export const insertEmployeeCertificateSchema = createInsertSchema(employeeCertificates);
export type InsertEmployeeCertificate = z.infer<typeof insertEmployeeCertificateSchema>;
export type EmployeeCertificate = typeof employeeCertificates.$inferSelect;

// Schema types for Employee QR Codes
export const insertEmployeeQrCodeSchema = createInsertSchema(employeeQrCodes);
export type InsertEmployeeQrCode = z.infer<typeof insertEmployeeQrCodeSchema>;
export type EmployeeQrCode = typeof employeeQrCodes.$inferSelect;

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
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
  username: true,
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

// Shopping cart and purchase schemas
export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrders).omit({
  id: true,
  orderNumber: true,
  createdAt: true,
  completedAt: true,
});

export const insertPurchaseOrderItemSchema = createInsertSchema(purchaseOrderItems).omit({
  id: true,
});

export const insertUserBalanceSchema = createInsertSchema(userBalances).omit({
  id: true,
  updatedAt: true,
});

export const insertUsageHistorySchema = createInsertSchema(usageHistory).omit({
  id: true,
  createdAt: true,
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
  parentId: integer("parent_id"),
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

// Shopping cart and purchase types
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type PurchaseOrder = typeof purchaseOrders.$inferSelect;
export type InsertPurchaseOrderItem = z.infer<typeof insertPurchaseOrderItemSchema>;
export type PurchaseOrderItem = typeof purchaseOrderItems.$inferSelect;
export type InsertUserBalance = z.infer<typeof insertUserBalanceSchema>;
export type UserBalance = typeof userBalances.$inferSelect;
export type InsertUsageHistory = z.infer<typeof insertUsageHistorySchema>;
export type UsageHistory = typeof usageHistory.$inferSelect;

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

// AI Document Processing tables
export const processedDocuments = pgTable('processed_documents', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  originalFileName: text('original_file_name').notNull(),
  documentType: text('document_type').notNull(), // signin, evaluation, certificate
  aiExtractedData: text('ai_extracted_data').notNull(), // JSON string
  verificationStatus: text('verification_status').default('pending'), // pending, verified, rejected
  instructorNotes: text('instructor_notes'),
  processingDate: timestamp('processing_date').defaultNow().notNull(),
  certificatesGenerated: integer('certificates_generated').default(0),
});

export const insertProcessedDocumentSchema = createInsertSchema(processedDocuments);
export type SelectProcessedDocument = typeof processedDocuments.$inferSelect;
export type InsertProcessedDocument = z.infer<typeof insertProcessedDocumentSchema>;

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  createdAt: true,
});

export const insertTrainingRequestSchema = createInsertSchema(trainingRequests).omit({
  id: true,
  createdAt: true,
  requestDate: true,
});

export const insertUpcomingTrainingSessionSchema = createInsertSchema(upcomingTrainingSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type SelectCertificate = typeof certificates.$inferSelect;
export type TrainingRequest = typeof trainingRequests.$inferSelect;
export type InsertTrainingRequest = z.infer<typeof insertTrainingRequestSchema>;
export type UpcomingTrainingSession = typeof upcomingTrainingSessions.$inferSelect;
export type InsertUpcomingTrainingSession = z.infer<typeof insertUpcomingTrainingSessionSchema>;


