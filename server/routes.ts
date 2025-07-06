import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { cloneDetector } from "./ai-clone-detection";
import { insertLeadSchema, insertUserSchema, loginUserSchema, insertComplianceReportSchema, insertCloneDetectionScanSchema } from "@shared/schema";
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

  // Admin authentication middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    // Simple admin protection - can be enhanced with proper authentication
    const adminKey = req.headers['x-admin-key'];
    const expectedKey = process.env.ADMIN_KEY || 'dev-admin-key';
    
    if (adminKey !== expectedKey) {
      return res.status(403).json({ 
        success: false, 
        message: "Admin access required" 
      });
    }
    
    next();
  };

  // Get all users endpoint (admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
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

  // Admin user management endpoints
  app.put('/api/admin/users/:id/tier', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { tier } = req.body;
      
      if (!['free_trial', 'basic', 'professional', 'enterprise'].includes(tier)) {
        return res.status(400).json({ error: 'Invalid tier' });
      }
      
      await storage.updateUserTier(parseInt(id), tier);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating user tier:', error);
      res.status(500).json({ error: 'Failed to update user tier' });
    }
  });

  app.put('/api/admin/users/:id/subscription', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { status, expiresAt } = req.body;
      
      if (!['active', 'expired', 'cancelled', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid subscription status' });
      }
      
      const expirationDate = expiresAt ? new Date(expiresAt) : undefined;
      await storage.updateSubscriptionStatus(parseInt(id), status, expirationDate);
      res.json({ success: true });
    } catch (error) {
      console.error('Error updating subscription:', error);
      res.status(500).json({ error: 'Failed to update subscription' });
    }
  });

  app.put('/api/admin/users/:id/deactivate', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deactivateUser(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error deactivating user:', error);
      res.status(500).json({ error: 'Failed to deactivate user' });
    }
  });

  app.put('/api/admin/users/:id/activate', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.activateUser(parseInt(id));
      res.json({ success: true });
    } catch (error) {
      console.error('Error activating user:', error);
      res.status(500).json({ error: 'Failed to activate user' });
    }
  });

  app.get('/api/admin/analytics', requireAdmin, async (req, res) => {
    try {
      const analytics = await storage.getUserAnalytics();
      const subscriptionStats = await storage.getSubscriptionStats();
      res.json({ userAnalytics: analytics, subscriptionStats });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ error: 'Failed to fetch analytics' });
    }
  });

  app.get('/api/admin/users/tier/:tier', requireAdmin, async (req, res) => {
    try {
      const { tier } = req.params;
      const users = await storage.getUsersByTier(tier);
      res.json(users);
    } catch (error) {
      console.error('Error fetching users by tier:', error);
      res.status(500).json({ error: 'Failed to fetch users by tier' });
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

  // Clone Detection API Routes
  // Store active scans in memory (in production, use Redis or database)
  const activeScanStatuses = new Map<number, any>();

  // Initialize original website fingerprint
  app.post("/api/clone-detection/init", async (req, res) => {
    try {
      const { html, url } = req.body;
      await cloneDetector.setOriginalWebsite(html, url);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to initialize clone detector:", error);
      res.status(500).json({ error: "Failed to initialize clone detector" });
    }
  });

  // Start clone detection scan
  app.post("/api/clone-detection/scan", async (req, res) => {
    try {
      const { urls, scanType = 'manual' } = req.body;
      const userId = 1; // For demo purposes, use actual user from session

      if (!Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ error: "URLs array is required" });
      }

      // Create scan record
      const scan = await storage.createCloneDetectionScan({
        userId,
        scanType,
        targetUrls: urls,
        results: [],
        status: 'pending',
        totalSites: urls.length,
        clonesDetected: 0,
        highRiskSites: 0
      });

      // Initialize scan status
      activeScanStatuses.set(scan.id, {
        scanId: scan.id,
        status: 'running',
        progress: 0,
        currentUrl: '',
        results: [],
        totalUrls: urls.length,
        processedUrls: 0
      });

      // Start scanning in background
      processScanAsync(scan.id, urls);

      res.json({ scanId: scan.id, status: 'started' });
    } catch (error) {
      console.error("Failed to start scan:", error);
      res.status(500).json({ error: "Failed to start scan" });
    }
  });

  // Get scan status
  app.get("/api/clone-detection/scan/:scanId/status", async (req, res) => {
    try {
      const scanId = parseInt(req.params.scanId);
      const status = activeScanStatuses.get(scanId);
      
      if (!status) {
        const scan = await storage.getCloneDetectionScanById(scanId);
        if (!scan) {
          return res.status(404).json({ error: "Scan not found" });
        }
        return res.json({ 
          status: scan.status, 
          progress: 100,
          results: scan.results,
          clonesDetected: scan.clonesDetected 
        });
      }

      res.json(status);
    } catch (error) {
      console.error("Failed to get scan status:", error);
      res.status(500).json({ error: "Failed to get scan status" });
    }
  });

  // Get clone detection scans for user
  app.get("/api/clone-detection/scans", async (req, res) => {
    try {
      const userId = 1; // For demo purposes, use actual user from session
      const scans = await storage.getCloneDetectionScans(userId);
      res.json(scans);
    } catch (error) {
      console.error("Failed to fetch scans:", error);
      res.status(500).json({ error: "Failed to fetch scans" });
    }
  });

  // Background scan processing function
  async function processScanAsync(scanId: number, urls: string[]) {
    const status = activeScanStatuses.get(scanId);
    if (!status) return;

    try {
      const results = [];
      let clonesDetected = 0;
      let highRiskSites = 0;

      for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
        status.currentUrl = url;
        status.progress = Math.round((i / urls.length) * 100);
        
        try {
          // Fetch website content
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          
          const response = await fetch(url, { 
            signal: controller.signal,
            headers: { 'User-Agent': 'SafetySync Clone Detector 1.0' }
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const html = await response.text();
            const result = await cloneDetector.detectClone(html, url);
            results.push(result);
            
            if (result.recommendation === 'potential_clone' || result.recommendation === 'high_risk') {
              clonesDetected++;
            }
            if (result.recommendation === 'high_risk' || result.recommendation === 'potential_clone') {
              highRiskSites++;
            }
          } else {
            results.push({
              url,
              similarityScore: 0,
              analysis: { contentSimilarity: 0, structureSimilarity: 0, designSimilarity: 0, brandingSimilarity: 0 },
              suspiciousElements: [],
              recommendation: 'low_risk' as const,
              aiAnalysis: 'Unable to access website for analysis.',
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error(`Error scanning ${url}:`, error);
          results.push({
            url,
            similarityScore: 0,
            analysis: { contentSimilarity: 0, structureSimilarity: 0, designSimilarity: 0, brandingSimilarity: 0 },
            suspiciousElements: [],
            recommendation: 'low_risk' as const,
            aiAnalysis: 'Error occurred during analysis.',
            timestamp: new Date().toISOString()
          });
        }
        
        status.processedUrls = i + 1;
      }

      // Update scan in database
      await storage.updateCloneDetectionScan(scanId, {
        status: 'completed',
        results: results,
        clonesDetected,
        highRiskSites,
        completedAt: new Date()
      });

      // Update status
      status.status = 'completed';
      status.progress = 100;
      status.results = results;
      status.clonesDetected = clonesDetected;

    } catch (error) {
      console.error(`Scan ${scanId} failed:`, error);
      await storage.updateCloneDetectionScan(scanId, {
        status: 'failed',
        completedAt: new Date()
      });
      
      if (status) {
        status.status = 'failed';
        status.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }
  }

  const httpServer = createServer(app);

  return httpServer;
}
