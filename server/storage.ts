import { 
  users, leads, complianceReports, cloneDetectionScans, helpDeskTickets, promoCodeUsage,
  employees, trainingPrograms, trainingSessions, employeeTraining, certificates, documents,
  auditLogs, notifications, integrations, locations, ticketResponses,
  type User, type InsertUser, type Lead, type InsertLead, type ComplianceReport, type InsertComplianceReport, 
  type CloneDetectionScan, type InsertCloneDetectionScan, type HelpDeskTicket, type InsertHelpDeskTicket, 
  type PromoCodeUsage, type InsertPromoCodeUsage, type Employee, type InsertEmployee,
  type TrainingProgram, type InsertTrainingProgram, type TrainingSession, type InsertTrainingSession,
  type EmployeeTraining, type InsertEmployeeTraining, type Certificate, type InsertCertificate,
  type Document, type InsertDocument, type AuditLog, type InsertAuditLog, type Notification, 
  type InsertNotification, type Integration, type InsertIntegration, type Location, type InsertLocation,
  companyProfiles, type CompanyProfile, type InsertCompanyProfile, type TicketResponse, type InsertTicketResponse
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gt } from "drizzle-orm";

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
    const [user] = await db.select().from(users).where(eq(users.email, email));
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
    return await db.select().from(employees).where(eq(employees.userId, userId));
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
    return await db.select().from(trainingSessions).where(eq(trainingSessions.userId, userId));
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
    const now = new Date();
    return await db.select().from(trainingSessions)
      .where(and(
        eq(trainingSessions.userId, userId),
        gt(trainingSessions.startDate, now)
      ));
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
    return await db.select().from(certificates).where(eq(certificates.userId, userId));
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
