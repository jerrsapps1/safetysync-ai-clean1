import { 
  users, leads, complianceReports, cloneDetectionScans, helpDeskTickets, promoCodeUsage,
  employees, instructors, externalStudents, trainingPrograms, trainingSessions, employeeTraining, certificates, documents,
  auditLogs, notifications, integrations, locations, ticketResponses, specials, featureUpdates,
  upcomingSoftware, softwareVotes, clientComments, commentLikes,
  type User, type InsertUser, type Lead, type InsertLead, type ComplianceReport, type InsertComplianceReport, 
  type CloneDetectionScan, type InsertCloneDetectionScan, type HelpDeskTicket, type InsertHelpDeskTicket, 
  type PromoCodeUsage, type InsertPromoCodeUsage, type Employee, type InsertEmployee,
  type Instructor, type InsertInstructor, type ExternalStudent, type InsertExternalStudent,
  type TrainingProgram, type InsertTrainingProgram, 
  type TrainingSession, type InsertTrainingSession, type EmployeeTraining, type InsertEmployeeTraining, 
  type Certificate, type InsertCertificate, type Document, type InsertDocument, type AuditLog, 
  type InsertAuditLog, type Notification, type InsertNotification, type Integration, 
  type InsertIntegration, type Location, type InsertLocation,
  companyProfiles, type CompanyProfile, type InsertCompanyProfile, type TicketResponse, type InsertTicketResponse,
  type Special, type InsertSpecial, type FeatureUpdate, type InsertFeatureUpdate,
  type UpcomingSoftware, type InsertUpcomingSoftware, type ClientComment, type InsertClientComment
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, sql } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLogin(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  
  // Lead management
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  
  // Compliance reports
  createComplianceReport(report: InsertComplianceReport): Promise<ComplianceReport>;
  getComplianceReports(userId: number): Promise<ComplianceReport[]>;
  getComplianceReportById(id: number): Promise<ComplianceReport | undefined>;
  
  // Clone detection
  createCloneDetectionScan(scan: InsertCloneDetectionScan): Promise<CloneDetectionScan>;
  getCloneDetectionScans(userId: number): Promise<CloneDetectionScan[]>;
  getCloneDetectionScanById(id: number): Promise<CloneDetectionScan | undefined>;
  updateCloneDetectionScan(id: number, updates: Partial<CloneDetectionScan>): Promise<void>;
  
  // Help desk ticket operations
  createHelpDeskTicket(ticket: InsertHelpDeskTicket): Promise<HelpDeskTicket>;
  getHelpDeskTickets(userId: number): Promise<HelpDeskTicket[]>;
  getHelpDeskTicketById(id: number, userId: number): Promise<HelpDeskTicket | undefined>;
  updateHelpDeskTicket(id: number, userId: number, updates: Partial<HelpDeskTicket>): Promise<HelpDeskTicket>;
  assignHelpDeskTicket(id: number, assignedTo: string): Promise<void>;
  resolveHelpDeskTicket(id: number, resolutionNotes: string): Promise<void>;
  
  // Ticket response operations
  createTicketResponse(response: InsertTicketResponse): Promise<TicketResponse>;
  getTicketResponses(ticketId: number): Promise<TicketResponse[]>;
  
  // Admin-only user management functions
  updateUserTier(userId: number, tier: string): Promise<void>;
  updateSubscriptionStatus(userId: number, status: string, expiresAt?: Date): Promise<void>;
  deactivateUser(userId: number): Promise<void>;
  activateUser(userId: number): Promise<void>;
  getUsersByTier(tier: string): Promise<User[]>;
  getSubscriptionStats(): Promise<{ total: number; active: number; expired: number; cancelled: number; pending: number }>;
  getUserAnalytics(): Promise<{ totalUsers: number; activeUsers: number; newUsersThisMonth: number; usersByTier: Record<string, number> }>;
  
  // Promo code management - 30-day expiration system
  createPromoCodeUsage(usage: InsertPromoCodeUsage): Promise<PromoCodeUsage>;
  getPromoCodeUsage(userId: number, promoCode: string): Promise<PromoCodeUsage | undefined>;
  getActivePromoCodes(userId: number): Promise<PromoCodeUsage[]>;
  validatePromoCode(promoCode: string, userId: number): Promise<{ valid: boolean; usage?: PromoCodeUsage; reason?: string }>;
  deactivatePromoCode(userId: number, promoCode: string): Promise<void>;
  
  // Employee Management
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  getEmployees(userId: number): Promise<Employee[]>;
  getEmployeeById(id: number): Promise<Employee | undefined>;
  updateEmployee(id: number, updates: Partial<Employee>): Promise<void>;
  deleteEmployee(id: number): Promise<void>;
  getEmployeesByDepartment(userId: number, department: string): Promise<Employee[]>;
  getEmployeesByLocation(userId: number, location: string): Promise<Employee[]>;
  
  // Instructor Management
  createInstructor(instructor: InsertInstructor): Promise<Instructor>;
  getInstructors(userId: number): Promise<Instructor[]>;
  getInstructorById(id: number): Promise<Instructor | undefined>;
  updateInstructor(id: number, updates: Partial<Instructor>): Promise<void>;
  deleteInstructor(id: number): Promise<void>;
  getInstructorsByType(userId: number, type: "internal" | "visiting"): Promise<Instructor[]>;
  
  // External Students Management
  createExternalStudent(student: InsertExternalStudent): Promise<ExternalStudent>;
  getExternalStudents(userId: number): Promise<ExternalStudent[]>;
  getExternalStudentById(id: number): Promise<ExternalStudent | undefined>;
  updateExternalStudent(id: number, updates: Partial<ExternalStudent>): Promise<void>;
  deleteExternalStudent(id: number): Promise<void>;
  searchExternalStudents(userId: number, query: string): Promise<ExternalStudent[]>;
  
  // Training Program Management
  createTrainingProgram(program: InsertTrainingProgram): Promise<TrainingProgram>;
  getTrainingPrograms(userId: number): Promise<TrainingProgram[]>;
  getTrainingProgramById(id: number): Promise<TrainingProgram | undefined>;
  updateTrainingProgram(id: number, updates: Partial<TrainingProgram>): Promise<void>;
  deleteTrainingProgram(id: number): Promise<void>;
  getTrainingProgramsByCategory(userId: number, category: string): Promise<TrainingProgram[]>;
  
  // Training Session Management
  createTrainingSession(session: InsertTrainingSession): Promise<TrainingSession>;
  getTrainingSessions(userId: number): Promise<TrainingSession[]>;
  getTrainingSessionById(id: number): Promise<TrainingSession | undefined>;
  updateTrainingSession(id: number, updates: Partial<TrainingSession>): Promise<void>;
  deleteTrainingSession(id: number): Promise<void>;
  getTrainingSessionsByProgram(programId: number): Promise<TrainingSession[]>;
  getUpcomingTrainingSessions(userId: number): Promise<TrainingSession[]>;
  
  // Employee Training Management
  createEmployeeTraining(training: InsertEmployeeTraining): Promise<EmployeeTraining>;
  getEmployeeTraining(employeeId: number, trainingProgramId: number): Promise<EmployeeTraining | undefined>;
  getEmployeeTrainingByEmployee(employeeId: number): Promise<EmployeeTraining[]>;
  getEmployeeTrainingByProgram(programId: number): Promise<EmployeeTraining[]>;
  updateEmployeeTraining(id: number, updates: Partial<EmployeeTraining>): Promise<void>;
  getExpiringTraining(userId: number, days: number): Promise<EmployeeTraining[]>;
  getOverdueTraining(userId: number): Promise<EmployeeTraining[]>;
  
  // Certificate Management
  createCertificate(certificate: InsertCertificate): Promise<Certificate>;
  getCertificates(userId: number): Promise<Certificate[]>;
  getCertificateById(id: number): Promise<Certificate | undefined>;
  getCertificatesByEmployee(employeeId: number): Promise<Certificate[]>;
  getExpiringCertificates(userId: number, days: number): Promise<Certificate[]>;
  
  // Document Management
  createDocument(document: InsertDocument): Promise<Document>;
  getDocuments(userId: number): Promise<Document[]>;
  getDocumentById(id: number): Promise<Document | undefined>;
  updateDocument(id: number, updates: Partial<Document>): Promise<void>;
  deleteDocument(id: number): Promise<void>;
  getDocumentsByCategory(userId: number, category: string): Promise<Document[]>;
  getDocumentsByDepartment(userId: number, department: string): Promise<Document[]>;
  
  // Audit Log Management
  createAuditLog(log: InsertAuditLog): Promise<AuditLog>;
  getAuditLogs(userId: number): Promise<AuditLog[]>;
  getAuditLogsByEntity(userId: number, entityType: string, entityId: number): Promise<AuditLog[]>;
  getAuditLogsByUser(userId: number, performedBy: number): Promise<AuditLog[]>;
  
  // Notification Management
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(userId: number): Promise<Notification[]>;
  getNotificationsByRecipient(recipientId: number): Promise<Notification[]>;
  getUnreadNotifications(recipientId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;
  markNotificationAsSent(id: number): Promise<void>;
  getPendingNotifications(): Promise<Notification[]>;
  
  // Integration Management
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  getIntegrations(userId: number): Promise<Integration[]>;
  getIntegrationById(id: number): Promise<Integration | undefined>;
  updateIntegration(id: number, updates: Partial<Integration>): Promise<void>;
  deleteIntegration(id: number): Promise<void>;
  getActiveIntegrations(userId: number): Promise<Integration[]>;
  
  // Location Management
  createLocation(location: InsertLocation): Promise<Location>;
  getLocations(userId: number): Promise<Location[]>;
  getLocationById(id: number): Promise<Location | undefined>;
  updateLocation(id: number, updates: Partial<Location>): Promise<void>;
  deleteLocation(id: number): Promise<void>;
  getActiveLocations(userId: number): Promise<Location[]>;
  
  // Company Profile Management
  getCompanyProfile(userId: number): Promise<CompanyProfile | undefined>;
  createCompanyProfile(profile: InsertCompanyProfile): Promise<CompanyProfile>;
  updateCompanyProfile(userId: number, updates: Partial<CompanyProfile>): Promise<CompanyProfile>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(sql`LOWER(${users.email})`, email.toLowerCase()));
    return user || undefined;
  }

  async updateUserLogin(id: number): Promise<void> {
    await db.update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, id));
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createLead(insertLead: InsertLead): Promise<Lead> {
    const [lead] = await db
      .insert(leads)
      .values(insertLead)
      .returning();
    return lead;
  }

  async getLeads(): Promise<Lead[]> {
    return await db.select().from(leads);
  }

  async getLeadById(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createComplianceReport(insertReport: InsertComplianceReport): Promise<ComplianceReport> {
    const [report] = await db
      .insert(complianceReports)
      .values(insertReport)
      .returning();
    return report;
  }

  async getComplianceReports(userId: number): Promise<ComplianceReport[]> {
    return await db.select().from(complianceReports).where(eq(complianceReports.userId, userId));
  }

  async getComplianceReportById(id: number): Promise<ComplianceReport | undefined> {
    const [report] = await db.select().from(complianceReports).where(eq(complianceReports.id, id));
    return report || undefined;
  }

  async createCloneDetectionScan(insertScan: InsertCloneDetectionScan): Promise<CloneDetectionScan> {
    const [scan] = await db
      .insert(cloneDetectionScans)
      .values(insertScan)
      .returning();
    return scan;
  }

  async getCloneDetectionScans(userId: number): Promise<CloneDetectionScan[]> {
    return await db.select().from(cloneDetectionScans)
      .where(eq(cloneDetectionScans.userId, userId))
      .orderBy(cloneDetectionScans.createdAt);
  }

  async getCloneDetectionScanById(id: number): Promise<CloneDetectionScan | undefined> {
    const [scan] = await db.select().from(cloneDetectionScans).where(eq(cloneDetectionScans.id, id));
    return scan || undefined;
  }

  async updateCloneDetectionScan(id: number, updates: Partial<CloneDetectionScan>): Promise<void> {
    await db.update(cloneDetectionScans)
      .set(updates)
      .where(eq(cloneDetectionScans.id, id));
  }

  // Help desk ticket operations
  async createHelpDeskTicket(insertTicket: InsertHelpDeskTicket): Promise<HelpDeskTicket> {
    // Generate unique ticket number
    const ticketNumber = `SYNC-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    const [ticket] = await db
      .insert(helpDeskTickets)
      .values({ ...insertTicket, ticketNumber })
      .returning();
    return ticket;
  }

  async getHelpDeskTickets(userId: number): Promise<HelpDeskTicket[]> {
    const tickets = await db.select().from(helpDeskTickets)
      .where(eq(helpDeskTickets.userId, userId))
      .orderBy(helpDeskTickets.createdAt);
    
    // Get responses for each ticket
    const ticketsWithResponses = await Promise.all(
      tickets.map(async (ticket) => {
        const responses = await this.getTicketResponses(ticket.id);
        return { ...ticket, responses };
      })
    );
    
    return ticketsWithResponses;
  }

  async getHelpDeskTicketById(id: number, userId: number): Promise<HelpDeskTicket | undefined> {
    const [ticket] = await db.select().from(helpDeskTickets)
      .where(and(eq(helpDeskTickets.id, id), eq(helpDeskTickets.userId, userId)));
    
    if (!ticket) return undefined;
    
    // Get responses for this ticket
    const responses = await this.getTicketResponses(ticket.id);
    return { ...ticket, responses };
  }

  async updateHelpDeskTicket(id: number, userId: number, updates: Partial<HelpDeskTicket>): Promise<HelpDeskTicket> {
    const [ticket] = await db.update(helpDeskTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(helpDeskTickets.id, id), eq(helpDeskTickets.userId, userId)))
      .returning();
    
    // Get responses for this ticket
    const responses = await this.getTicketResponses(ticket.id);
    return { ...ticket, responses };
  }

  async assignHelpDeskTicket(id: number, assignedTo: string): Promise<void> {
    await db.update(helpDeskTickets)
      .set({ 
        assignedTo, 
        status: 'in_progress',
        updatedAt: new Date()
      })
      .where(eq(helpDeskTickets.id, id));
  }

  async resolveHelpDeskTicket(id: number, resolutionNotes: string): Promise<void> {
    await db.update(helpDeskTickets)
      .set({ 
        status: 'resolved',
        resolutionNotes,
        resolvedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(helpDeskTickets.id, id));
  }

  // Ticket response operations
  async createTicketResponse(insertResponse: InsertTicketResponse): Promise<TicketResponse> {
    const [response] = await db
      .insert(ticketResponses)
      .values(insertResponse)
      .returning();
    return response;
  }

  async getTicketResponses(ticketId: number): Promise<TicketResponse[]> {
    return await db.select().from(ticketResponses)
      .where(eq(ticketResponses.ticketId, ticketId))
      .orderBy(ticketResponses.createdAt);
  }

  // Client Portal operations
  async getActiveSpecials(): Promise<Special[]> {
    return await db.select().from(specials)
      .where(eq(specials.isActive, true))
      .orderBy(specials.createdAt);
  }

  async getActiveFeatureUpdates(): Promise<FeatureUpdate[]> {
    return await db.select().from(featureUpdates)
      .where(eq(featureUpdates.isActive, true))
      .orderBy(featureUpdates.releaseDate);
  }

  async getActiveUpcomingSoftware(): Promise<UpcomingSoftware[]> {
    return await db.select().from(upcomingSoftware)
      .where(eq(upcomingSoftware.isActive, true))
      .orderBy(upcomingSoftware.votes);
  }

  async getActiveClientComments(): Promise<ClientComment[]> {
    return await db.select().from(clientComments)
      .where(eq(clientComments.isActive, true))
      .orderBy(clientComments.createdAt);
  }

  async createClientComment(insertComment: InsertClientComment): Promise<ClientComment> {
    const [comment] = await db
      .insert(clientComments)
      .values(insertComment)
      .returning();
    return comment;
  }

  async voteForSoftware(userId: string, softwareId: number): Promise<void> {
    // Check if user already voted
    const existingVote = await db.select().from(softwareVotes)
      .where(and(eq(softwareVotes.userId, userId), eq(softwareVotes.softwareId, softwareId)))
      .limit(1);

    if (existingVote.length === 0) {
      // Add vote
      await db.insert(softwareVotes).values({ userId, softwareId });
      
      // Update vote count
      await db.update(upcomingSoftware)
        .set({ votes: sql`${upcomingSoftware.votes} + 1` })
        .where(eq(upcomingSoftware.id, softwareId));
    }
  }

  async likeComment(userId: string, commentId: number): Promise<void> {
    // Check if user already liked
    const existingLike = await db.select().from(commentLikes)
      .where(and(eq(commentLikes.userId, userId), eq(commentLikes.commentId, commentId)))
      .limit(1);

    if (existingLike.length === 0) {
      // Add like
      await db.insert(commentLikes).values({ userId, commentId });
      
      // Update like count
      await db.update(clientComments)
        .set({ likes: sql`${clientComments.likes} + 1` })
        .where(eq(clientComments.id, commentId));
    } else {
      // Remove like
      await db.delete(commentLikes)
        .where(and(eq(commentLikes.userId, userId), eq(commentLikes.commentId, commentId)));
      
      // Update like count
      await db.update(clientComments)
        .set({ likes: sql`${clientComments.likes} - 1` })
        .where(eq(clientComments.id, commentId));
    }
  }

  async getUserVotedSoftware(userId: string): Promise<number[]> {
    const votes = await db.select({ softwareId: softwareVotes.softwareId })
      .from(softwareVotes)
      .where(eq(softwareVotes.userId, userId));
    return votes.map(v => v.softwareId);
  }

  async getUserLikedComments(userId: string): Promise<number[]> {
    const likes = await db.select({ commentId: commentLikes.commentId })
      .from(commentLikes)
      .where(eq(commentLikes.userId, userId));
    return likes.map(l => l.commentId);
  }

  // Admin-only user management functions
  async updateUserTier(userId: number, tier: string): Promise<void> {
    await db
      .update(users)
      .set({ userTier: tier as any })
      .where(eq(users.id, userId));
  }

  async updateSubscriptionStatus(userId: number, status: string, expiresAt?: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        subscriptionStatus: status as any,
        subscriptionExpiresAt: expiresAt
      })
      .where(eq(users.id, userId));
  }

  async deactivateUser(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ isActive: false })
      .where(eq(users.id, userId));
  }

  async activateUser(userId: number): Promise<void> {
    await db
      .update(users)
      .set({ isActive: true })
      .where(eq(users.id, userId));
  }

  async getUsersByTier(tier: string): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .where(eq(users.userTier, tier as any));
  }

  async getSubscriptionStats(): Promise<{ total: number; active: number; expired: number; cancelled: number; pending: number }> {
    const allUsers = await db.select().from(users);
    
    return {
      total: allUsers.length,
      active: allUsers.filter(u => u.subscriptionStatus === 'active').length,
      expired: allUsers.filter(u => u.subscriptionStatus === 'expired').length,
      cancelled: allUsers.filter(u => u.subscriptionStatus === 'cancelled').length,
      pending: allUsers.filter(u => u.subscriptionStatus === 'pending').length
    };
  }

  async getUserAnalytics(): Promise<{ totalUsers: number; activeUsers: number; newUsersThisMonth: number; usersByTier: Record<string, number> }> {
    const allUsers = await db.select().from(users);
    const currentMonth = new Date();
    currentMonth.setDate(1);
    
    const usersByTier = allUsers.reduce((acc, user) => {
      const tier = user.userTier || 'free_trial';
      acc[tier] = (acc[tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalUsers: allUsers.length,
      activeUsers: allUsers.filter(u => u.isActive).length,
      newUsersThisMonth: allUsers.filter(u => u.createdAt && u.createdAt >= currentMonth).length,
      usersByTier
    };
  }

  // Promo code management - 30-day expiration system
  async createPromoCodeUsage(insertUsage: InsertPromoCodeUsage): Promise<PromoCodeUsage> {
    const [usage] = await db
      .insert(promoCodeUsage)
      .values(insertUsage)
      .returning();
    return usage;
  }

  async getPromoCodeUsage(userId: number, promoCode: string): Promise<PromoCodeUsage | undefined> {
    const [usage] = await db
      .select()
      .from(promoCodeUsage)
      .where(and(eq(promoCodeUsage.userId, userId), eq(promoCodeUsage.promoCode, promoCode)));
    return usage || undefined;
  }

  async getActivePromoCodes(userId: number): Promise<PromoCodeUsage[]> {
    const now = new Date();
    return await db
      .select()
      .from(promoCodeUsage)
      .where(
        and(
          eq(promoCodeUsage.userId, userId),
          eq(promoCodeUsage.isActive, true),
          gt(promoCodeUsage.expiresAt, now)
        )
      );
  }

  async validatePromoCode(promoCode: string, userId: number): Promise<{ valid: boolean; usage?: PromoCodeUsage; reason?: string }> {
    // Check if user has already used this promo code
    const existingUsage = await this.getPromoCodeUsage(userId, promoCode);
    
    if (existingUsage) {
      const now = new Date();
      if (existingUsage.expiresAt < now) {
        return { valid: false, reason: "Promo code has expired (30 days from purchase)" };
      }
      if (!existingUsage.isActive) {
        return { valid: false, reason: "Promo code has been deactivated" };
      }
      return { valid: false, reason: "Promo code has already been used. Each code can only be used once." };
    }
    
    // New promo code - check if it exists in the system
    // Define valid promo codes (in production, this would be a database table)
    const validCodes = ['SMALLBIZ', 'STARTUP40', 'FREEMONTH', 'LAUNCH25', 'GROWTH15', 'ENTERPRISE15', 'CORP500'];
    
    if (!validCodes.includes(promoCode)) {
      return { valid: false, reason: "Invalid promo code" };
    }
    
    return { valid: true, reason: "New promo code available for use" };
  }

  async deactivatePromoCode(userId: number, promoCode: string): Promise<void> {
    await db
      .update(promoCodeUsage)
      .set({ isActive: false })
      .where(
        and(
          eq(promoCodeUsage.userId, userId),
          eq(promoCodeUsage.promoCode, promoCode)
        )
      );
  }

  // Employee Management
  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db
      .insert(employees)
      .values(insertEmployee)
      .returning();
    return employee;
  }

  async getEmployees(userId: number): Promise<Employee[]> {
    // Return comprehensive 200 employee dataset for testing
    const mockEmployees: Employee[] = Array.from({ length: 200 }, (_, i) => {
      const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Lisa', 'Robert', 'Jennifer', 'William', 'Amy', 'James', 'Maria', 'Christopher', 'Michelle', 'Daniel', 'Patricia', 'Matthew', 'Linda', 'Anthony', 'Elizabeth', 'Mark', 'Barbara', 'Donald', 'Susan', 'Steven', 'Jessica', 'Paul', 'Nancy', 'Andrew', 'Dorothy', 'Joshua', 'Lisa', 'Kenneth', 'Karen', 'Kevin', 'Helen', 'Brian', 'Sandra', 'George', 'Donna', 'Edward', 'Carol', 'Ronald', 'Ruth', 'Timothy', 'Sharon', 'Jason', 'Michelle', 'Jeffrey', 'Laura', 'Ryan', 'Sarah', 'Jacob', 'Kimberly', 'Gary', 'Deborah', 'Nicholas', 'Dorothy', 'Eric', 'Lisa', 'Jonathan', 'Nancy', 'Stephen', 'Karen', 'Larry', 'Betty', 'Justin', 'Helen', 'Scott', 'Sandra', 'Brandon', 'Donna', 'Benjamin', 'Carol', 'Samuel', 'Ruth', 'Frank', 'Sharon', 'Raymond', 'Michelle', 'Alexander', 'Laura', 'Patrick', 'Sarah', 'Jack', 'Kimberly', 'Dennis', 'Deborah', 'Jerry', 'Dorothy', 'Tyler', 'Lisa', 'Aaron', 'Nancy', 'Jose', 'Karen', 'Henry', 'Betty', 'Adam', 'Helen', 'Douglas', 'Sandra', 'Nathan', 'Donna', 'Peter', 'Carol', 'Zachary', 'Ruth', 'Kyle', 'Sharon', 'Walter', 'Michelle', 'Harold', 'Laura', 'Carl', 'Sarah', 'Arthur', 'Kimberly', 'Gerald', 'Deborah', 'Wayne', 'Dorothy', 'Louis', 'Lisa', 'Ralph', 'Nancy', 'Roy', 'Karen', 'Eugene', 'Betty', 'Louis', 'Helen', 'Philip', 'Sandra', 'Bobby', 'Donna'];
      
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts', 'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes', 'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper', 'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson', 'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes', 'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez'];
      
      const departments = ['Construction', 'Safety', 'Operations', 'Management', 'Quality', 'Environmental', 'HR', 'Engineering', 'Warehouse', 'Manufacturing', 'Maintenance', 'Security', 'Administration', 'Transportation', 'Procurement', 'IT', 'Finance', 'Customer Service', 'Sales', 'Marketing', 'Legal', 'Research', 'Documentation', 'Risk Management', 'Insurance'];
      
      const positions = ['Safety Manager', 'Site Supervisor', 'Construction Worker', 'Equipment Operator', 'Quality Inspector', 'Environmental Specialist', 'HR Coordinator', 'Project Engineer', 'Warehouse Associate', 'Machine Operator', 'Maintenance Technician', 'Security Guard', 'Administrative Assistant', 'Truck Driver', 'Procurement Specialist', 'IT Support', 'Financial Analyst', 'Customer Service Rep', 'Sales Representative', 'Marketing Coordinator', 'Legal Assistant', 'Research Analyst', 'Documentation Specialist', 'Risk Analyst', 'Insurance Coordinator'];
      
      const locations = ['Main Office', 'Construction Site A', 'Construction Site B', 'Warehouse 1', 'Warehouse 2', 'Manufacturing Plant', 'Field Office', 'Remote Location', 'Corporate HQ', 'Training Center'];
      
      const statuses: ('active' | 'inactive' | 'terminated')[] = ['active', 'inactive', 'terminated'];
      const roles = ['employee', 'supervisor', 'manager', 'admin'];
      
      const firstName = firstNames[i % firstNames.length];
      const lastName = lastNames[i % lastNames.length];
      
      return {
        id: i + 1,
        userId: userId,
        employeeId: `EMP-${(i + 1).toString().padStart(4, '0')}`,
        firstName,
        lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@safetysync.ai`,
        phone: `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        position: positions[i % positions.length],
        department: departments[i % departments.length],
        division: `${departments[i % departments.length]} Division`,
        location: locations[i % locations.length],
        hireDate: new Date(`202${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`),
        status: statuses[i % statuses.length],
        role: roles[i % roles.length],
        profileImage: null,
        emergencyContact: { 
          name: `${firstNames[(i + 1) % firstNames.length]} ${lastNames[(i + 1) % lastNames.length]}`, 
          phone: `555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`, 
          relationship: ['Spouse', 'Parent', 'Sibling', 'Child', 'Friend'][i % 5] 
        },
        createdAt: new Date(`202${Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`),
        updatedAt: new Date('2024-01-15')
      };
    });
    
    return mockEmployees;
  }

  async getEmployeeById(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async updateEmployee(id: number, updates: Partial<Employee>): Promise<void> {
    await db.update(employees)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(employees.id, id));
  }

  async deleteEmployee(id: number): Promise<void> {
    await db.delete(employees).where(eq(employees.id, id));
  }

  async getEmployeesByDepartment(userId: number, department: string): Promise<Employee[]> {
    return await db.select().from(employees)
      .where(and(eq(employees.userId, userId), eq(employees.department, department)));
  }

  async getEmployeesByLocation(userId: number, location: string): Promise<Employee[]> {
    return await db.select().from(employees)
      .where(and(eq(employees.userId, userId), eq(employees.location, location)));
  }

  // Instructor Management
  async createInstructor(insertInstructor: InsertInstructor): Promise<Instructor> {
    const [instructor] = await db
      .insert(instructors)
      .values(insertInstructor)
      .returning();
    return instructor;
  }

  async getInstructors(userId: number): Promise<Instructor[]> {
    return await db.select().from(instructors).where(eq(instructors.userId, userId));
  }

  async getInstructorById(id: number): Promise<Instructor | undefined> {
    const [instructor] = await db.select().from(instructors).where(eq(instructors.id, id));
    return instructor || undefined;
  }

  async updateInstructor(id: number, updates: Partial<Instructor>): Promise<void> {
    await db.update(instructors)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(instructors.id, id));
  }

  async deleteInstructor(id: number): Promise<void> {
    await db.delete(instructors).where(eq(instructors.id, id));
  }

  async getInstructorsByType(userId: number, type: "internal" | "visiting"): Promise<Instructor[]> {
    return await db.select().from(instructors)
      .where(and(eq(instructors.userId, userId), eq(instructors.type, type)));
  }

  // External Students Management
  async createExternalStudent(insertStudent: InsertExternalStudent): Promise<ExternalStudent> {
    const [student] = await db
      .insert(externalStudents)
      .values(insertStudent)
      .returning();
    return student;
  }

  async getExternalStudents(userId: number): Promise<ExternalStudent[]> {
    return await db.select().from(externalStudents).where(eq(externalStudents.userId, userId));
  }

  async getExternalStudentById(id: number): Promise<ExternalStudent | undefined> {
    const [student] = await db.select().from(externalStudents).where(eq(externalStudents.id, id));
    return student || undefined;
  }

  async updateExternalStudent(id: number, updates: Partial<ExternalStudent>): Promise<void> {
    await db.update(externalStudents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(externalStudents.id, id));
  }

  async deleteExternalStudent(id: number): Promise<void> {
    await db.delete(externalStudents).where(eq(externalStudents.id, id));
  }

  async searchExternalStudents(userId: number, query: string): Promise<ExternalStudent[]> {
    return await db.select().from(externalStudents)
      .where(and(
        eq(externalStudents.userId, userId),
        sql`(${externalStudents.firstName} ILIKE ${`%${query}%`} OR ${externalStudents.lastName} ILIKE ${`%${query}%`} OR ${externalStudents.company} ILIKE ${`%${query}%`})`
      ));
  }

  // Training Program Management
  async createTrainingProgram(insertProgram: InsertTrainingProgram): Promise<TrainingProgram> {
    const [program] = await db
      .insert(trainingPrograms)
      .values(insertProgram)
      .returning();
    return program;
  }

  async getTrainingPrograms(userId: number): Promise<TrainingProgram[]> {
    return await db.select().from(trainingPrograms).where(eq(trainingPrograms.userId, userId));
  }

  async getTrainingProgramById(id: number): Promise<TrainingProgram | undefined> {
    const [program] = await db.select().from(trainingPrograms).where(eq(trainingPrograms.id, id));
    return program || undefined;
  }

  async updateTrainingProgram(id: number, updates: Partial<TrainingProgram>): Promise<void> {
    await db.update(trainingPrograms)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(trainingPrograms.id, id));
  }

  async deleteTrainingProgram(id: number): Promise<void> {
    await db.delete(trainingPrograms).where(eq(trainingPrograms.id, id));
  }

  async getTrainingProgramsByCategory(userId: number, category: string): Promise<TrainingProgram[]> {
    return await db.select().from(trainingPrograms)
      .where(and(eq(trainingPrograms.userId, userId), eq(trainingPrograms.category, category)));
  }

  // Training Session Management
  async createTrainingSession(insertSession: InsertTrainingSession): Promise<TrainingSession> {
    const [session] = await db
      .insert(trainingSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getTrainingSessions(userId: number): Promise<TrainingSession[]> {
    // Return comprehensive mock training session data
    const mockTrainingSessions: TrainingSession[] = [
      {
        id: 1,
        userId: userId,
        programId: 1,
        sessionName: "OSHA 30-Hour Construction - Session 1",
        description: "Comprehensive construction safety training covering OSHA regulations",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2024-02-03"),
        location: "Chicago Training Center",
        maxParticipants: 20,
        currentParticipants: 15,
        instructor: "John Safety",
        status: "completed",
        materials: ["OSHA Manual", "Safety Checklist", "Training Videos"],
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-02-03")
      },
      {
        id: 2,
        userId: userId,
        programId: 2,
        sessionName: "Fall Protection Training",
        description: "Hands-on training for fall protection equipment and procedures",
        startDate: new Date("2024-02-15"),
        endDate: new Date("2024-02-15"),
        location: "Field Training Site",
        maxParticipants: 12,
        currentParticipants: 10,
        instructor: "Sarah Protection",
        status: "completed",
        materials: ["Fall Protection Manual", "Equipment Checklist", "Safety Harness"],
        createdAt: new Date("2024-02-01"),
        updatedAt: new Date("2024-02-15")
      },
      {
        id: 3,
        userId: userId,
        programId: 3,
        sessionName: "First Aid/CPR Certification",
        description: "Emergency response training and certification",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2024-03-01"),
        location: "Milwaukee Training Center",
        maxParticipants: 16,
        currentParticipants: 14,
        instructor: "Medical Trainer",
        status: "completed",
        materials: ["First Aid Manual", "CPR Kit", "Emergency Procedures"],
        createdAt: new Date("2024-02-15"),
        updatedAt: new Date("2024-03-01")
      },
      {
        id: 4,
        userId: userId,
        programId: 4,
        sessionName: "Forklift Operation Training",
        description: "Equipment operation training for warehouse staff",
        startDate: new Date("2024-03-15"),
        endDate: new Date("2024-03-16"),
        location: "Detroit Warehouse",
        maxParticipants: 8,
        currentParticipants: 6,
        instructor: "Mike Equipment",
        status: "scheduled",
        materials: ["Forklift Manual", "Safety Guidelines", "Equipment Checklist"],
        createdAt: new Date("2024-03-01"),
        updatedAt: new Date("2024-03-01")
      },
      {
        id: 5,
        userId: userId,
        programId: 5,
        sessionName: "Hazard Communication Update",
        description: "Updated training on chemical hazard communication",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2024-04-01"),
        location: "Cleveland Training Room",
        maxParticipants: 25,
        currentParticipants: 18,
        instructor: "Lisa Chemical",
        status: "scheduled",
        materials: ["HazCom Manual", "Chemical Safety Data", "Labels Guide"],
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15")
      },
      {
        id: 6,
        userId: userId,
        programId: 6,
        sessionName: "Confined Space Entry Training",
        description: "Safety procedures for confined space work",
        startDate: new Date("2024-04-15"),
        endDate: new Date("2024-04-16"),
        location: "Industrial Training Site",
        maxParticipants: 10,
        currentParticipants: 8,
        instructor: "Safety Expert",
        status: "scheduled",
        materials: ["Confined Space Manual", "Entry Procedures", "Emergency Protocols"],
        createdAt: new Date("2024-04-01"),
        updatedAt: new Date("2024-04-01")
      }
    ];

    // Add more training sessions
    for (let i = 7; i <= 30; i++) {
      const sessionTypes = ["Respiratory Protection", "Hearing Conservation", "Lockout/Tagout", "Crane Operation", "Fire Safety", "Chemical Handling", "Electrical Safety", "Emergency Response"];
      const sessionName = sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
      const startDate = new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000);
      const endDate = new Date(startDate.getTime() + (Math.random() * 3 + 1) * 24 * 60 * 60 * 1000);
      
      mockTrainingSessions.push({
        id: i,
        userId: userId,
        programId: Math.floor(Math.random() * 10) + 1,
        sessionName: `${sessionName} Training Session`,
        description: `Professional training session for ${sessionName.toLowerCase()}`,
        startDate: startDate,
        endDate: endDate,
        location: ["Chicago Training Center", "Milwaukee Training Center", "Detroit Warehouse", "Cleveland Training Room"][Math.floor(Math.random() * 4)],
        maxParticipants: Math.floor(Math.random() * 20) + 10,
        currentParticipants: Math.floor(Math.random() * 15) + 5,
        instructor: ["John Safety", "Sarah Protection", "Mike Equipment", "Lisa Chemical"][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.3 ? "scheduled" : "completed",
        materials: ["Training Manual", "Safety Guidelines", "Equipment Checklist"],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    }

    return mockTrainingSessions;
  }

  async getTrainingSessionById(id: number): Promise<TrainingSession | undefined> {
    const [session] = await db.select().from(trainingSessions).where(eq(trainingSessions.id, id));
    return session || undefined;
  }

  async updateTrainingSession(id: number, updates: Partial<TrainingSession>): Promise<void> {
    await db.update(trainingSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(trainingSessions.id, id));
  }

  async deleteTrainingSession(id: number): Promise<void> {
    await db.delete(trainingSessions).where(eq(trainingSessions.id, id));
  }

  async getTrainingSessionsByProgram(programId: number): Promise<TrainingSession[]> {
    return await db.select().from(trainingSessions)
      .where(eq(trainingSessions.trainingProgramId, programId));
  }

  async getUpcomingTrainingSessions(userId: number): Promise<TrainingSession[]> {
    const mockUpcomingSessions = [
      {
        id: 20,
        userId: userId,
        programId: 1,
        sessionName: "OSHA 30-Hour Construction - Session 2",
        description: "Advanced construction safety training",
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        endDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
        location: "Chicago Training Center",
        maxParticipants: 20,
        currentParticipants: 12,
        instructor: "John Safety",
        status: "scheduled",
        materials: ["OSHA Manual", "Safety Checklist", "Training Videos"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 21,
        userId: userId,
        programId: 2,
        sessionName: "Fall Protection Refresher",
        description: "Annual fall protection training update",
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // same day
        location: "Field Training Site",
        maxParticipants: 15,
        currentParticipants: 8,
        instructor: "Sarah Protection",
        status: "scheduled",
        materials: ["Fall Protection Manual", "Equipment Checklist", "Safety Harness"],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 22,
        userId: userId,
        programId: 3,
        sessionName: "Emergency Response Drill",
        description: "Monthly emergency response training",
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // same day
        location: "All Locations",
        maxParticipants: 50,
        currentParticipants: 32,
        instructor: "Emergency Team",
        status: "scheduled",
        materials: ["Emergency Manual", "Response Procedures", "Communication Plan"],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return mockUpcomingSessions;
  }

  // Employee Training Management
  async createEmployeeTraining(insertTraining: InsertEmployeeTraining): Promise<EmployeeTraining> {
    const [training] = await db
      .insert(employeeTraining)
      .values(insertTraining)
      .returning();
    return training;
  }

  async getEmployeeTraining(employeeId: number, trainingProgramId: number): Promise<EmployeeTraining | undefined> {
    const [training] = await db.select().from(employeeTraining)
      .where(and(
        eq(employeeTraining.employeeId, employeeId),
        eq(employeeTraining.trainingProgramId, trainingProgramId)
      ));
    return training || undefined;
  }

  async getEmployeeTrainingByEmployee(employeeId: number): Promise<EmployeeTraining[]> {
    return await db.select().from(employeeTraining)
      .where(eq(employeeTraining.employeeId, employeeId));
  }

  async getEmployeeTrainingByProgram(programId: number): Promise<EmployeeTraining[]> {
    return await db.select().from(employeeTraining)
      .where(eq(employeeTraining.trainingProgramId, programId));
  }

  async updateEmployeeTraining(id: number, updates: Partial<EmployeeTraining>): Promise<void> {
    await db.update(employeeTraining)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(employeeTraining.id, id));
  }

  async getExpiringTraining(userId: number, days: number): Promise<EmployeeTraining[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await db.select().from(employeeTraining)
      .innerJoin(employees, eq(employeeTraining.employeeId, employees.id))
      .where(and(
        eq(employees.userId, userId),
        gt(employeeTraining.expirationDate, new Date()),
        gt(futureDate, employeeTraining.expirationDate)
      ));
  }

  async getOverdueTraining(userId: number): Promise<EmployeeTraining[]> {
    const now = new Date();
    return await db.select().from(employeeTraining)
      .innerJoin(employees, eq(employeeTraining.employeeId, employees.id))
      .where(and(
        eq(employees.userId, userId),
        gt(now, employeeTraining.expirationDate)
      ));
  }

  // Certificate Management
  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const [certificate] = await db
      .insert(certificates)
      .values(insertCertificate)
      .returning();
    return certificate;
  }

  async getCertificates(userId: number): Promise<Certificate[]> {
    // Return comprehensive mock certificate data
    const mockCertificates: Certificate[] = [
      {
        id: 1,
        userId: userId,
        employeeId: 1,
        certificateName: "OSHA 30-Hour Construction",
        issueDate: new Date("2023-01-20"),
        expirationDate: new Date("2024-01-20"),
        certificateNumber: "OSHA-30-001",
        issuer: "OSHA Training Institute",
        issuedBy: "John Instructor",
        trainingHours: 30,
        status: "active",
        documentPath: null,
        createdAt: new Date("2023-01-20"),
        updatedAt: new Date("2023-01-20")
      },
      {
        id: 2,
        userId: userId,
        employeeId: 1,
        certificateName: "Fall Protection",
        issueDate: new Date("2023-02-15"),
        expirationDate: new Date("2024-02-15"),
        certificateNumber: "FALL-PROT-001",
        issuer: "SafetySync Training Center",
        issuedBy: "Sarah Safety",
        trainingHours: 8,
        status: "active",
        documentPath: null,
        createdAt: new Date("2023-02-15"),
        updatedAt: new Date("2023-02-15")
      },
      {
        id: 3,
        userId: userId,
        employeeId: 2,
        certificateName: "First Aid/CPR",
        issueDate: new Date("2023-03-10"),
        expirationDate: new Date("2025-03-10"),
        certificateNumber: "CPR-001",
        issuer: "American Red Cross",
        issuedBy: "Medical Instructor",
        trainingHours: 4,
        status: "active",
        documentPath: null,
        createdAt: new Date("2023-03-10"),
        updatedAt: new Date("2023-03-10")
      },
      {
        id: 4,
        userId: userId,
        employeeId: 3,
        certificateName: "Forklift Operation",
        issueDate: new Date("2023-04-05"),
        expirationDate: new Date("2026-04-05"),
        certificateNumber: "FORK-001",
        issuer: "Equipment Training Institute",
        issuedBy: "Mike Trainer",
        trainingHours: 6,
        status: "active",
        documentPath: null,
        createdAt: new Date("2023-04-05"),
        updatedAt: new Date("2023-04-05")
      },
      {
        id: 5,
        userId: userId,
        employeeId: 4,
        certificateName: "Hazard Communication",
        issueDate: new Date("2023-05-12"),
        expirationDate: new Date("2024-05-12"),
        certificateNumber: "HAZCOM-001",
        issuer: "SafetySync Training Center",
        issuedBy: "Lisa Instructor",
        trainingHours: 2,
        status: "expiring",
        documentPath: null,
        createdAt: new Date("2023-05-12"),
        updatedAt: new Date("2023-05-12")
      },
      {
        id: 6,
        userId: userId,
        employeeId: 5,
        certificateName: "Confined Space Entry",
        issueDate: new Date("2022-12-01"),
        expirationDate: new Date("2023-12-01"),
        certificateNumber: "CSE-001",
        issuer: "Industrial Safety Training",
        issuedBy: "Safety Expert",
        trainingHours: 8,
        status: "expired",
        documentPath: null,
        createdAt: new Date("2022-12-01"),
        updatedAt: new Date("2022-12-01")
      }
    ];

    // Add more certificates for different employees
    for (let i = 7; i <= 50; i++) {
      const employeeId = Math.floor(Math.random() * 10) + 1;
      const certTypes = ["OSHA 10-Hour", "Respiratory Protection", "Hearing Conservation", "Lockout/Tagout", "Crane Operation", "Fire Safety", "Chemical Handling", "Electrical Safety"];
      const certName = certTypes[Math.floor(Math.random() * certTypes.length)];
      const issueDate = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
      const expirationDate = new Date(issueDate.getTime() + (365 * 24 * 60 * 60 * 1000));
      
      mockCertificates.push({
        id: i,
        userId: userId,
        employeeId: employeeId,
        certificateName: certName,
        issueDate: issueDate,
        expirationDate: expirationDate,
        certificateNumber: `CERT-${i.toString().padStart(3, '0')}`,
        issuer: "SafetySync Training Center",
        issuedBy: "Training Instructor",
        trainingHours: Math.floor(Math.random() * 30) + 2,
        status: expirationDate < new Date() ? "expired" : (expirationDate.getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000 ? "expiring" : "active",
        documentPath: null,
        createdAt: issueDate,
        updatedAt: issueDate
      });
    }

    return mockCertificates;
  }

  async getCertificateById(id: number): Promise<Certificate | undefined> {
    const [certificate] = await db.select().from(certificates).where(eq(certificates.id, id));
    return certificate || undefined;
  }

  async getCertificatesByEmployee(employeeId: number): Promise<Certificate[]> {
    return await db.select().from(certificates)
      .where(eq(certificates.employeeId, employeeId));
  }

  async getExpiringCertificates(userId: number, days: number): Promise<Certificate[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return await db.select().from(certificates)
      .where(and(
        eq(certificates.userId, userId),
        gt(certificates.expirationDate, new Date()),
        gt(futureDate, certificates.expirationDate)
      ));
  }

  // Document Management
  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db
      .insert(documents)
      .values(insertDocument)
      .returning();
    return document;
  }

  async getDocuments(userId: number): Promise<Document[]> {
    return await db.select().from(documents).where(eq(documents.userId, userId));
  }

  async getDocumentById(id: number): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document || undefined;
  }

  async updateDocument(id: number, updates: Partial<Document>): Promise<void> {
    await db.update(documents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(documents.id, id));
  }

  async deleteDocument(id: number): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }

  async getDocumentsByCategory(userId: number, category: string): Promise<Document[]> {
    return await db.select().from(documents)
      .where(and(eq(documents.userId, userId), eq(documents.category, category)));
  }

  async getDocumentsByDepartment(userId: number, department: string): Promise<Document[]> {
    return await db.select().from(documents)
      .where(and(eq(documents.userId, userId), eq(documents.department, department)));
  }

  // Audit Log Management
  async createAuditLog(insertLog: InsertAuditLog): Promise<AuditLog> {
    const [log] = await db
      .insert(auditLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getAuditLogs(userId: number): Promise<AuditLog[]> {
    return await db.select().from(auditLogs).where(eq(auditLogs.userId, userId));
  }

  async getAuditLogsByEntity(userId: number, entityType: string, entityId: number): Promise<AuditLog[]> {
    return await db.select().from(auditLogs)
      .where(and(
        eq(auditLogs.userId, userId),
        eq(auditLogs.entityType, entityType),
        eq(auditLogs.entityId, entityId)
      ));
  }

  async getAuditLogsByUser(userId: number, performedBy: number): Promise<AuditLog[]> {
    return await db.select().from(auditLogs)
      .where(and(
        eq(auditLogs.userId, userId),
        eq(auditLogs.performedBy, performedBy)
      ));
  }

  // Notification Management
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return notification;
  }

  async getNotifications(userId: number): Promise<Notification[]> {
    return await db.select().from(notifications).where(eq(notifications.userId, userId));
  }

  async getNotificationsByRecipient(recipientId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.recipientId, recipientId));
  }

  async getUnreadNotifications(recipientId: number): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(and(
        eq(notifications.recipientId, recipientId),
        eq(notifications.status, 'sent')
      ));
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db.update(notifications)
      .set({ status: 'read', readAt: new Date() })
      .where(eq(notifications.id, id));
  }

  async markNotificationAsSent(id: number): Promise<void> {
    await db.update(notifications)
      .set({ status: 'sent', sentAt: new Date() })
      .where(eq(notifications.id, id));
  }

  async getPendingNotifications(): Promise<Notification[]> {
    return await db.select().from(notifications)
      .where(eq(notifications.status, 'pending'));
  }

  // Integration Management
  async createIntegration(insertIntegration: InsertIntegration): Promise<Integration> {
    const [integration] = await db
      .insert(integrations)
      .values(insertIntegration)
      .returning();
    return integration;
  }

  async getIntegrations(userId: number): Promise<Integration[]> {
    return await db.select().from(integrations).where(eq(integrations.userId, userId));
  }

  async getIntegrationById(id: number): Promise<Integration | undefined> {
    const [integration] = await db.select().from(integrations).where(eq(integrations.id, id));
    return integration || undefined;
  }

  async updateIntegration(id: number, updates: Partial<Integration>): Promise<void> {
    await db.update(integrations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(integrations.id, id));
  }

  async deleteIntegration(id: number): Promise<void> {
    await db.delete(integrations).where(eq(integrations.id, id));
  }

  async getActiveIntegrations(userId: number): Promise<Integration[]> {
    return await db.select().from(integrations)
      .where(and(eq(integrations.userId, userId), eq(integrations.isActive, true)));
  }

  // Location Management
  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const [location] = await db
      .insert(locations)
      .values(insertLocation)
      .returning();
    return location;
  }

  async getLocations(userId: number): Promise<Location[]> {
    return await db.select().from(locations).where(eq(locations.userId, userId));
  }

  async getLocationById(id: number): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location || undefined;
  }

  async updateLocation(id: number, updates: Partial<Location>): Promise<void> {
    await db.update(locations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(locations.id, id));
  }

  async deleteLocation(id: number): Promise<void> {
    await db.delete(locations).where(eq(locations.id, id));
  }

  async getActiveLocations(userId: number): Promise<Location[]> {
    return await db.select().from(locations)
      .where(and(eq(locations.userId, userId), eq(locations.isActive, true)));
  }

  // Company Profile Management
  async getCompanyProfile(userId: number): Promise<CompanyProfile | undefined> {
    const [profile] = await db.select().from(companyProfiles).where(eq(companyProfiles.userId, userId));
    return profile || undefined;
  }

  async createCompanyProfile(profile: InsertCompanyProfile): Promise<CompanyProfile> {
    const [newProfile] = await db
      .insert(companyProfiles)
      .values(profile)
      .returning();
    return newProfile;
  }

  async updateCompanyProfile(userId: number, updates: Partial<CompanyProfile>): Promise<CompanyProfile> {
    const [updatedProfile] = await db
      .update(companyProfiles)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(companyProfiles.userId, userId))
      .returning();
    return updatedProfile;
  }
}

export const storage = new DatabaseStorage();
