import { users, leads, complianceReports, cloneDetectionScans, helpDeskTickets, promoCodeUsage, type User, type InsertUser, type Lead, type InsertLead, type ComplianceReport, type InsertComplianceReport, type CloneDetectionScan, type InsertCloneDetectionScan, type HelpDeskTicket, type InsertHelpDeskTicket, type PromoCodeUsage, type InsertPromoCodeUsage } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLogin(id: number): Promise<void>;
  getAllUsers(): Promise<User[]>;
  createLead(lead: InsertLead): Promise<Lead>;
  getLeads(): Promise<Lead[]>;
  getLeadById(id: number): Promise<Lead | undefined>;
  createComplianceReport(report: InsertComplianceReport): Promise<ComplianceReport>;
  getComplianceReports(userId: number): Promise<ComplianceReport[]>;
  getComplianceReportById(id: number): Promise<ComplianceReport | undefined>;
  createCloneDetectionScan(scan: InsertCloneDetectionScan): Promise<CloneDetectionScan>;
  getCloneDetectionScans(userId: number): Promise<CloneDetectionScan[]>;
  getCloneDetectionScanById(id: number): Promise<CloneDetectionScan | undefined>;
  updateCloneDetectionScan(id: number, updates: Partial<CloneDetectionScan>): Promise<void>;
  
  // Help desk ticket operations
  createHelpDeskTicket(ticket: InsertHelpDeskTicket): Promise<HelpDeskTicket>;
  getHelpDeskTickets(): Promise<HelpDeskTicket[]>;
  getHelpDeskTicketById(id: number): Promise<HelpDeskTicket | undefined>;
  updateHelpDeskTicket(id: number, updates: Partial<HelpDeskTicket>): Promise<void>;
  assignHelpDeskTicket(id: number, assignedTo: string): Promise<void>;
  resolveHelpDeskTicket(id: number, resolutionNotes: string): Promise<void>;
  
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

  async getHelpDeskTickets(): Promise<HelpDeskTicket[]> {
    return await db.select().from(helpDeskTickets)
      .orderBy(helpDeskTickets.createdAt);
  }

  async getHelpDeskTicketById(id: number): Promise<HelpDeskTicket | undefined> {
    const [ticket] = await db.select().from(helpDeskTickets).where(eq(helpDeskTickets.id, id));
    return ticket || undefined;
  }

  async updateHelpDeskTicket(id: number, updates: Partial<HelpDeskTicket>): Promise<void> {
    await db.update(helpDeskTickets)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(helpDeskTickets.id, id));
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
}

export const storage = new DatabaseStorage();
