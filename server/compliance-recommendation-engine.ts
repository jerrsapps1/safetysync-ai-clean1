import { db } from "./db";
import { employees, certificates, trainingSessions, processedDocuments } from "@shared/schema";
import { eq, and, gte, lte, sql, desc } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ComplianceRecommendation {
  id: string;
  employeeId?: number;
  employeeName?: string;
  department?: string;
  type: 'training_required' | 'certification_expiring' | 'compliance_gap' | 'proactive_training' | 'risk_mitigation';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actionRequired: string;
  dueDate?: Date;
  estimatedCompletionTime: string;
  complianceStandards: string[];
  costImpact?: 'low' | 'medium' | 'high';
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
  recommendedTraining?: string[];
  aiInsight?: string;
  createdAt: Date;
}

export interface ComplianceAnalytics {
  overallComplianceScore: number;
  departmentScores: Record<string, number>;
  riskAreas: string[];
  upcomingRequirements: number;
  criticalGaps: number;
  recommendationsCount: number;
  trendsAnalysis: {
    improvingAreas: string[];
    decliningAreas: string[];
  };
}

export class ComplianceRecommendationEngine {
  
  async generatePersonalizedRecommendations(userId: number): Promise<{
    recommendations: ComplianceRecommendation[];
    analytics: ComplianceAnalytics;
  }> {
    console.log(`🤖 Generating personalized compliance recommendations for user ${userId}`);
    
    // Fetch all relevant data
    const [employeeData, certificateData, trainingData, documentData] = await Promise.all([
      this.getEmployeeData(userId),
      this.getCertificateData(userId),
      this.getTrainingData(userId),
      this.getDocumentData(userId)
    ]);

    console.log(`📊 Data collected: ${employeeData.length} employees, ${certificateData.length} certificates, ${trainingData.length} training sessions`);

    // Generate AI-powered insights
    const aiInsights = await this.generateAIInsights(employeeData, certificateData, trainingData);
    
    // Generate specific recommendations
    const recommendations = await this.analyzeAndRecommend(
      employeeData, 
      certificateData, 
      trainingData, 
      documentData,
      aiInsights
    );

    // Calculate analytics
    const analytics = this.calculateComplianceAnalytics(
      employeeData, 
      certificateData, 
      recommendations
    );

    console.log(`✅ Generated ${recommendations.length} personalized recommendations`);
    
    return { recommendations, analytics };
  }

  private async getEmployeeData(userId: number) {
    return await db
      .select()
      .from(employees)
      .where(eq(employees.userId, userId));
  }

  private async getCertificateData(userId: number) {
    return await db
      .select()
      .from(certificates)
      .where(eq(certificates.userId, userId))
      .orderBy(desc(certificates.createdAt));
  }

  private async getTrainingData(userId: number) {
    return await db
      .select()
      .from(trainingSessions)
      .where(eq(trainingSessions.userId, userId))
      .orderBy(desc(trainingSessions.createdAt));
  }

  private async getDocumentData(userId: number) {
    return await db
      .select()
      .from(processedDocuments)
      .where(eq(processedDocuments.userId, userId))
      .orderBy(desc(processedDocuments.processingDate));
  }

  private async generateAIInsights(employeeData: any[], certificateData: any[], trainingData: any[]): Promise<string> {
    try {
      const prompt = `
        Analyze the following safety compliance data and provide intelligent insights:

        EMPLOYEE DATA:
        - Total Employees: ${employeeData.length}
        - Departments: ${[...new Set(employeeData.map(e => e.department))].join(', ')}
        - Positions: ${[...new Set(employeeData.map(e => e.position))].join(', ')}

        CERTIFICATE DATA:
        - Active Certificates: ${certificateData.filter(c => c.status === 'active').length}
        - Expiring Soon (30 days): ${certificateData.filter(c => 
          c.expirationDate && 
          new Date(c.expirationDate) > new Date() && 
          new Date(c.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        ).length}
        - Certificate Types: ${[...new Set(certificateData.map(c => c.certificationType))].join(', ')}

        TRAINING DATA:
        - Recent Training Sessions: ${trainingData.length}
        - Training Types: ${[...new Set(trainingData.map(t => t.sessionName))].join(', ')}

        Provide insights on:
        1. Risk patterns and compliance gaps
        2. Proactive training opportunities
        3. Department-specific recommendations
        4. Cost-effective compliance strategies
        5. Emerging compliance trends

        Return your analysis as a comprehensive insight summary focusing on actionable recommendations.
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "You are an expert OSHA compliance analyst specializing in workplace safety recommendations. Provide detailed, actionable insights based on compliance data."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000
      });

      return response.choices[0]?.message?.content || "AI analysis unavailable";
    } catch (error) {
      console.error('AI insights generation error:', error);
      return "AI analysis temporarily unavailable - using fallback compliance analysis";
    }
  }

  private async analyzeAndRecommend(
    employees: any[], 
    certificates: any[], 
    trainingSessions: any[], 
    documents: any[],
    aiInsights: string
  ): Promise<ComplianceRecommendation[]> {
    const recommendations: ComplianceRecommendation[] = [];
    const now = new Date();
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);

    // 1. Expiring Certificates Analysis
    for (const cert of certificates) {
      if (cert.expirationDate && new Date(cert.expirationDate) < thirtyDaysFromNow) {
        const isExpired = new Date(cert.expirationDate) < now;
        
        recommendations.push({
          id: `cert-renewal-${cert.id}`,
          employeeId: employees.find(e => e.firstName + ' ' + e.lastName === cert.employeeName)?.id,
          employeeName: cert.employeeName,
          department: employees.find(e => e.firstName + ' ' + e.lastName === cert.employeeName)?.department,
          type: isExpired ? 'compliance_gap' : 'certification_expiring',
          priority: isExpired ? 'critical' : 'high',
          title: `${cert.certificationType} ${isExpired ? 'Expired' : 'Expiring Soon'}`,
          description: `${cert.employeeName}'s ${cert.certificationType} certificate ${isExpired ? 'has expired' : 'expires on ' + new Date(cert.expirationDate).toLocaleDateString()}`,
          actionRequired: `Schedule immediate renewal training for ${cert.certificationType}`,
          dueDate: isExpired ? now : new Date(cert.expirationDate),
          estimatedCompletionTime: "4-8 hours",
          complianceStandards: cert.trainingStandards || [],
          costImpact: 'medium',
          riskLevel: isExpired ? 'critical' : 'high',
          recommendedTraining: [cert.certificationType],
          createdAt: now
        });
      }
    }

    // 2. Employees Without Required Certifications
    const departmentRequirements = this.getDepartmentRequirements();
    
    for (const employee of employees) {
      const employeeCerts = certificates.filter(c => 
        c.employeeName === `${employee.firstName} ${employee.lastName}` && 
        c.status === 'active' &&
        new Date(c.expirationDate) > now
      );
      
      const requiredCerts = departmentRequirements[employee.department] || [];
      const employeeCertTypes = employeeCerts.map(c => c.certificationType);
      
      for (const requiredCert of requiredCerts) {
        if (!employeeCertTypes.includes(requiredCert.name)) {
          recommendations.push({
            id: `missing-cert-${employee.id}-${requiredCert.name.replace(/\s+/g, '-')}`,
            employeeId: employee.id,
            employeeName: `${employee.firstName} ${employee.lastName}`,
            department: employee.department,
            type: 'training_required',
            priority: requiredCert.criticality as 'low' | 'medium' | 'high' | 'critical',
            title: `Missing Required Certification: ${requiredCert.name}`,
            description: `${employee.firstName} ${employee.lastName} requires ${requiredCert.name} certification for their role in ${employee.department}`,
            actionRequired: `Enroll in ${requiredCert.name} training program`,
            dueDate: new Date(Date.now() + requiredCert.gracePeriod * 24 * 60 * 60 * 1000),
            estimatedCompletionTime: requiredCert.duration,
            complianceStandards: requiredCert.standards,
            costImpact: 'medium',
            riskLevel: requiredCert.criticality as 'low' | 'medium' | 'high' | 'critical',
            recommendedTraining: [requiredCert.name],
            createdAt: now
          });
        }
      }
    }

    // 3. Proactive Training Recommendations Based on Recent Incidents/Trends
    const recentDocuments = documents.filter(d => 
      new Date(d.processingDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
    );

    if (recentDocuments.length > 0) {
      // Analyze training patterns from recent documents
      const trainingTypes = recentDocuments
        .map(d => d.aiExtractedData)
        .filter(data => typeof data === 'object' && data.trainingTitle)
        .map(data => data.trainingTitle);

      const trainingFrequency = trainingTypes.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      // Recommend additional training for high-frequency areas
      Object.entries(trainingFrequency).forEach(([trainingType, frequency]) => {
        if (frequency >= 2) {
          recommendations.push({
            id: `proactive-${trainingType.replace(/\s+/g, '-')}-${Date.now()}`,
            type: 'proactive_training',
            priority: 'medium',
            title: `Enhanced ${trainingType} Program Recommended`,
            description: `Recent training data shows increased focus on ${trainingType}. Consider implementing advanced modules.`,
            actionRequired: `Evaluate and potentially implement advanced ${trainingType} training modules`,
            dueDate: sixtyDaysFromNow,
            estimatedCompletionTime: "2-4 hours per employee",
            complianceStandards: ["29 CFR 1926.95", "29 CFR 1926.501"],
            costImpact: 'low',
            riskLevel: 'low',
            recommendedTraining: [`Advanced ${trainingType}`],
            aiInsight: aiInsights,
            createdAt: now
          });
        }
      });
    }

    // 4. Department-Specific Risk Analysis
    const departmentRisks = this.analyzeDepartmentRisks(employees, certificates);
    
    Object.entries(departmentRisks).forEach(([department, riskData]) => {
      if (riskData.riskScore > 0.7) {
        recommendations.push({
          id: `dept-risk-${department.replace(/\s+/g, '-')}-${Date.now()}`,
          department,
          type: 'risk_mitigation',
          priority: riskData.riskScore > 0.9 ? 'critical' : 'high',
          title: `High Risk Department: ${department}`,
          description: `${department} shows elevated compliance risk with ${riskData.issues.join(', ')}`,
          actionRequired: `Implement comprehensive safety review and targeted training for ${department}`,
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          estimatedCompletionTime: "1-2 weeks",
          complianceStandards: ["29 CFR 1926", "29 CFR 1910"],
          costImpact: 'high',
          riskLevel: 'critical',
          recommendedTraining: riskData.recommendedTraining,
          aiInsight: aiInsights,
          createdAt: now
        });
      }
    });

    // Sort by priority and due date
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      if (a.dueDate && b.dueDate) {
        return a.dueDate.getTime() - b.dueDate.getTime();
      }
      return 0;
    });
  }

  private getDepartmentRequirements() {
    return {
      'Construction': [
        { name: 'Fall Protection', criticality: 'critical', duration: '8 hours', standards: ['29 CFR 1926.501'], gracePeriod: 30 },
        { name: 'OSHA 10-Hour Construction', criticality: 'high', duration: '10 hours', standards: ['29 CFR 1926'], gracePeriod: 60 },
        { name: 'Scaffold Safety', criticality: 'high', duration: '4 hours', standards: ['29 CFR 1926.451'], gracePeriod: 45 }
      ],
      'Manufacturing': [
        { name: 'Machine Guarding', criticality: 'critical', duration: '4 hours', standards: ['29 CFR 1910.212'], gracePeriod: 30 },
        { name: 'Lockout/Tagout', criticality: 'critical', duration: '6 hours', standards: ['29 CFR 1910.147'], gracePeriod: 30 },
        { name: 'Hearing Conservation', criticality: 'medium', duration: '2 hours', standards: ['29 CFR 1910.95'], gracePeriod: 90 }
      ],
      'Maintenance': [
        { name: 'Confined Space Entry', criticality: 'critical', duration: '8 hours', standards: ['29 CFR 1910.146'], gracePeriod: 30 },
        { name: 'Electrical Safety', criticality: 'critical', duration: '6 hours', standards: ['29 CFR 1910.331'], gracePeriod: 30 },
        { name: 'Arc Flash Safety', criticality: 'high', duration: '4 hours', standards: ['NFPA 70E'], gracePeriod: 45 }
      ],
      'Warehouse': [
        { name: 'Forklift Operation', criticality: 'critical', duration: '8 hours', standards: ['29 CFR 1910.178'], gracePeriod: 30 },
        { name: 'Material Handling', criticality: 'medium', duration: '4 hours', standards: ['29 CFR 1910.176'], gracePeriod: 60 },
        { name: 'Ergonomics', criticality: 'medium', duration: '2 hours', standards: ['Guidelines'], gracePeriod: 90 }
      ]
    };
  }

  private analyzeDepartmentRisks(employees: any[], certificates: any[]) {
    const departmentData: Record<string, any> = {};
    
    // Group employees by department
    employees.forEach(emp => {
      if (!departmentData[emp.department]) {
        departmentData[emp.department] = {
          employees: [],
          certificates: [],
          riskScore: 0,
          issues: [],
          recommendedTraining: []
        };
      }
      departmentData[emp.department].employees.push(emp);
    });

    // Analyze each department
    Object.keys(departmentData).forEach(dept => {
      const deptData = departmentData[dept];
      const deptEmployees = deptData.employees;
      const deptCerts = certificates.filter(c => 
        deptEmployees.some(e => `${e.firstName} ${e.lastName}` === c.employeeName)
      );

      let riskFactors = 0;
      const totalEmployees = deptEmployees.length;

      // Risk Factor 1: Low certification coverage
      const certifiedEmployees = new Set(deptCerts.map(c => c.employeeName)).size;
      const certificationRate = certifiedEmployees / totalEmployees;
      if (certificationRate < 0.8) {
        riskFactors += 0.3;
        deptData.issues.push('low certification coverage');
        deptData.recommendedTraining.push('Department-wide certification program');
      }

      // Risk Factor 2: Expiring certificates
      const now = new Date();
      const expiringCerts = deptCerts.filter(c => 
        c.expirationDate && new Date(c.expirationDate) < new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      );
      const expiringRate = expiringCerts.length / deptCerts.length;
      if (expiringRate > 0.2) {
        riskFactors += 0.3;
        deptData.issues.push('multiple expiring certificates');
        deptData.recommendedTraining.push('Renewal training program');
      }

      // Risk Factor 3: No recent training activity
      const recentCerts = deptCerts.filter(c => 
        new Date(c.createdAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      );
      if (recentCerts.length === 0 && deptCerts.length > 0) {
        riskFactors += 0.4;
        deptData.issues.push('no recent training activity');
        deptData.recommendedTraining.push('Refresher training sessions');
      }

      deptData.riskScore = Math.min(riskFactors, 1.0);
    });

    return departmentData;
  }

  private calculateComplianceAnalytics(
    employees: any[], 
    certificates: any[], 
    recommendations: ComplianceRecommendation[]
  ): ComplianceAnalytics {
    const now = new Date();
    
    // Overall compliance score calculation
    const totalEmployees = employees.length;
    const employeesWithActiveCerts = new Set(
      certificates
        .filter(c => c.status === 'active' && new Date(c.expirationDate) > now)
        .map(c => c.employeeName)
    ).size;
    
    const overallComplianceScore = totalEmployees > 0 
      ? Math.round((employeesWithActiveCerts / totalEmployees) * 100) 
      : 100;

    // Department scores
    const departmentScores: Record<string, number> = {};
    const departmentGroups = employees.reduce((acc, emp) => {
      if (!acc[emp.department]) acc[emp.department] = [];
      acc[emp.department].push(emp);
      return acc;
    }, {} as Record<string, any[]>);

    Object.entries(departmentGroups).forEach(([dept, deptEmployees]) => {
      const deptEmployeesWithCerts = deptEmployees.filter(emp => 
        certificates.some(c => 
          c.employeeName === `${emp.firstName} ${emp.lastName}` && 
          c.status === 'active' && 
          new Date(c.expirationDate) > now
        )
      ).length;
      
      departmentScores[dept] = Math.round((deptEmployeesWithCerts / deptEmployees.length) * 100);
    });

    // Risk areas and trends
    const riskAreas = Object.entries(departmentScores)
      .filter(([, score]) => score < 80)
      .map(([dept]) => dept);

    const criticalGaps = recommendations.filter(r => r.priority === 'critical').length;
    const upcomingRequirements = recommendations.filter(r => 
      r.dueDate && r.dueDate > now && r.dueDate < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    ).length;

    // Trends analysis (simplified for now)
    const trendsAnalysis = {
      improvingAreas: Object.entries(departmentScores)
        .filter(([, score]) => score >= 90)
        .map(([dept]) => dept),
      decliningAreas: Object.entries(departmentScores)
        .filter(([, score]) => score < 70)
        .map(([dept]) => dept)
    };

    return {
      overallComplianceScore,
      departmentScores,
      riskAreas,
      upcomingRequirements,
      criticalGaps,
      recommendationsCount: recommendations.length,
      trendsAnalysis
    };
  }
}

export const complianceEngine = new ComplianceRecommendationEngine();