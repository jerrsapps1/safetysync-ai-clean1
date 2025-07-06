import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertLeadSchema, insertUserSchema, loginUserSchema, insertComplianceReportSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Generate compliance report data based on type
async function generateComplianceReportData(reportType: string, periodStart?: string, periodEnd?: string) {
  const mockEmployeeData = [
    { id: 1, name: "John Smith", position: "Site Supervisor", department: "Construction", hireDate: "2023-01-15" },
    { id: 2, name: "Sarah Johnson", position: "Safety Coordinator", department: "Safety", hireDate: "2022-08-20" },
    { id: 3, name: "Mike Rodriguez", position: "Equipment Operator", department: "Operations", hireDate: "2023-03-10" },
    { id: 4, name: "Lisa Chen", position: "Project Manager", department: "Management", hireDate: "2021-11-05" },
    { id: 5, name: "David Wilson", position: "Quality Inspector", department: "Quality", hireDate: "2023-02-28" },
    { id: 6, name: "Emma Thompson", position: "Environmental Specialist", department: "Environmental", hireDate: "2022-12-12" },
    { id: 7, name: "James Brown", position: "Crane Operator", department: "Operations", hireDate: "2023-04-18" },
    { id: 8, name: "Maria Garcia", position: "Training Coordinator", department: "HR", hireDate: "2022-09-30" },
  ];

  const mockTrainingData = [
    { name: "OSHA 30-Hour Construction", required: true, frequency: "Annual" },
    { name: "Fall Protection", required: true, frequency: "Annual" },
    { name: "Hazard Communication", required: true, frequency: "Annual" },
    { name: "Confined Space Entry", required: true, frequency: "Annual" },
    { name: "First Aid/CPR", required: true, frequency: "Biennial" },
    { name: "Forklift Operation", required: false, frequency: "Triennial" },
    { name: "Crane Operation", required: false, frequency: "Annual" },
    { name: "Respiratory Protection", required: true, frequency: "Annual" },
  ];

  const mockComplianceData = mockEmployeeData.map(employee => ({
    employeeId: employee.id,
    employeeName: employee.name,
    position: employee.position,
    department: employee.department,
    trainings: mockTrainingData.map(training => ({
      trainingName: training.name,
      status: Math.random() > 0.15 ? 'completed' : Math.random() > 0.5 ? 'pending' : 'expired',
      completedDate: Math.random() > 0.15 ? new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : null,
      expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      certificateNumber: Math.random() > 0.15 ? `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}` : null,
      required: training.required
    }))
  }));

  const complianceStats = {
    totalEmployees: mockEmployeeData.length,
    compliantEmployees: mockComplianceData.filter(emp => 
      emp.trainings.filter(t => t.required).every(t => t.status === 'completed')
    ).length,
    pendingTraining: mockComplianceData.flatMap(emp => emp.trainings).filter(t => t.status === 'pending').length,
    expiredCertifications: mockComplianceData.flatMap(emp => emp.trainings).filter(t => t.status === 'expired').length,
    complianceScore: Math.round(
      (mockComplianceData.flatMap(emp => emp.trainings).filter(t => t.status === 'completed').length / 
       mockComplianceData.flatMap(emp => emp.trainings).length) * 100
    )
  };

  const reportData = {
    reportType,
    generatedAt: new Date().toISOString(),
    periodStart: periodStart || new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    periodEnd: periodEnd || new Date().toISOString().split('T')[0],
    complianceStats,
    employees: mockEmployeeData,
    trainings: mockTrainingData,
    complianceData: mockComplianceData,
    summary: {
      overallComplianceRate: `${complianceStats.complianceScore}%`,
      criticalFindings: complianceStats.expiredCertifications,
      actionItems: [
        `${complianceStats.pendingTraining} training sessions need to be completed`,
        `${complianceStats.expiredCertifications} certifications require renewal`,
        `${mockEmployeeData.length - complianceStats.compliantEmployees} employees need attention`
      ],
      recommendations: [
        "Implement automated reminder system for expiring certifications",
        "Schedule quarterly compliance review meetings",
        "Consider additional safety training for high-risk departments"
      ]
    }
  };

  return reportData;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // User registration endpoint
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "User already exists with this email" 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Don't return password in response
      const { password, ...userWithoutPassword } = user;

      res.status(201).json({ 
        success: true, 
        message: "User registered successfully",
        user: userWithoutPassword 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error registering user:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // User login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginUserSchema.parse(req.body);
      
      // Find user by email
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid email or password" 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(loginData.password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid email or password" 
        });
      }

      // Update last login
      await storage.updateUserLogin(user.id);

      // Don't return password in response
      const { password, ...userWithoutPassword } = user;

      res.json({ 
        success: true, 
        message: "Login successful",
        user: userWithoutPassword 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error logging in user:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Lead submission endpoint
  app.post("/api/leads", async (req, res) => {
    try {
      const leadData = insertLeadSchema.parse(req.body);
      const lead = await storage.createLead(leadData);
      
      // Log the lead creation for demonstration (in production, this would send emails)
      console.log(`New ${lead.leadType} lead created:`, {
        name: lead.name,
        email: lead.email,
        company: lead.company,
        leadType: lead.leadType,
        createdAt: lead.createdAt
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Lead submitted successfully",
        leadId: lead.id 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Invalid form data", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating lead:", error);
        res.status(500).json({ 
          success: false, 
          message: "Internal server error" 
        });
      }
    }
  });

  // Get all leads endpoint (for admin purposes)
  app.get("/api/leads", async (req, res) => {
    try {
      const leads = await storage.getLeads();
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Get all users endpoint (for admin purposes)
  app.get("/api/admin/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ 
        success: false, 
        message: "Internal server error" 
      });
    }
  });

  // Generate compliance report endpoint
  app.post("/api/compliance/reports/generate", async (req, res) => {
    try {
      const { reportType, periodStart, periodEnd, userId } = req.body;
      
      // Generate report data based on type
      const reportData = await generateComplianceReportData(reportType, periodStart, periodEnd);
      
      // Create report record
      const reportRecord = await storage.createComplianceReport({
        userId: userId || 1, // Default to user 1 for demo
        reportName: `${reportType.toUpperCase()} Compliance Report - ${new Date().toLocaleDateString()}`,
        reportType,
        reportData: JSON.stringify(reportData),
        periodStart: periodStart ? new Date(periodStart) : null,
        periodEnd: periodEnd ? new Date(periodEnd) : null,
      });

      res.json({
        success: true,
        report: reportRecord,
        data: reportData
      });
    } catch (error) {
      console.error("Error generating compliance report:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to generate report" 
      });
    }
  });

  // Get compliance reports for a user
  app.get("/api/compliance/reports/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reports = await storage.getComplianceReports(userId);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching compliance reports:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch reports" 
      });
    }
  });

  // Get specific compliance report
  app.get("/api/compliance/reports/view/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getComplianceReportById(id);
      if (!report) {
        return res.status(404).json({ 
          success: false, 
          message: "Report not found" 
        });
      }
      res.json({
        ...report,
        reportData: JSON.parse(report.reportData)
      });
    } catch (error) {
      console.error("Error fetching compliance report:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to fetch report" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
