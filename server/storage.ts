import { users, leads, complianceReports, cloneDetectionScans, type User, type InsertUser, type Lead, type InsertLead, type ComplianceReport, type InsertComplianceReport, type CloneDetectionScan, type InsertCloneDetectionScan } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
}

export const storage = new DatabaseStorage();
