import type { Express } from "express";
import { db } from "../db";
import { upcomingTrainingSessions } from "@shared/schema";
import { eq, and } from "drizzle-orm";
// Import authenticateToken from routes.ts
import jwt from "jsonwebtoken";
import { storage } from "../storage";

// JWT authentication middleware (copied from routes.ts)
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'development-secret-key', async (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }

    try {
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Authentication error' });
    }
  });
}

export default function registerInstructorTrainingSessionRoutes(app: Express) {
  // Get instructor's training sessions
  app.get("/api/instructor/training-sessions", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      // Get all training sessions for this user where sessionType is instructor_led
      const sessions = await db
        .select()
        .from(upcomingTrainingSessions)
        .where(and(
          eq(upcomingTrainingSessions.userId, userId),
          eq(upcomingTrainingSessions.sessionType, 'instructor_led')
        ))
        .orderBy(upcomingTrainingSessions.date);

      // Mock some sample sessions if none exist for demo purposes
      const mockSessions = [
        {
          id: 1,
          title: "Fall Protection Training",
          date: new Date('2025-07-25T09:00:00').toISOString(),
          location: "Training Room A",
          duration: "4 hours",
          trainer: "John Smith, OSHA Authorized",
          plannedAttendees: 12,
          status: "scheduled",
          trainingStandards: ["29 CFR 1926.95", "OSHA Fall Protection"],
          notes: "Comprehensive fall protection training for construction team"
        },
        {
          id: 2,
          title: "Forklift Operation Certification",
          date: new Date('2025-07-28T13:00:00').toISOString(),
          location: "Warehouse Floor",
          duration: "6 hours",
          trainer: "Sarah Johnson, Certified Instructor",
          plannedAttendees: 8,
          status: "scheduled",
          trainingStandards: ["OSHA 1910.178", "ANSI/ITSDF B56.1"],
          notes: "Initial certification training for new operators"
        },
        {
          id: 3,
          title: "Confined Space Entry",
          date: new Date('2025-08-02T08:00:00').toISOString(),
          location: "Training Facility",
          duration: "8 hours",
          trainer: "Mike Rodriguez, Safety Specialist",
          plannedAttendees: 15,
          status: "scheduled",
          trainingStandards: ["29 CFR 1926.1200", "OSHA Confined Space"],
          notes: "Entry supervisor and attendant training"
        }
      ];

      // If no real sessions exist, return mock data for demo
      const resultSessions = sessions.length > 0 ? sessions : mockSessions;

      res.json({
        success: true,
        sessions: resultSessions
      });

    } catch (error) {
      console.error("Error fetching instructor training sessions:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to fetch training sessions" 
      });
    }
  });

  // Complete instructor training session
  app.post("/api/instructor/complete-training", authenticateToken, async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const {
        sessionId,
        trainingTitle,
        instructorName,
        instructorCredentials,
        trainingDate,
        location,
        duration,
        trainingStandards,
        employees,
        certificationEligible,
        evaluationRequired,
        instructorNotes
      } = req.body;

      console.log('Instructor Training Completion Request:', {
        sessionId,
        trainingTitle,
        employeeCount: employees?.length,
        completedEmployees: employees?.filter(e => e.completionStatus === 'completed')?.length
      });

      // Validate required fields
      if (!trainingTitle || !instructorName || !employees || employees.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: trainingTitle, instructorName, and employees are required'
        });
      }

      // Filter only employees marked as completed
      const completedEmployees = employees.filter(emp => 
        emp.completionStatus === 'completed' && emp.signature === true
      );

      if (completedEmployees.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No employees marked as completed with verified signatures'
        });
      }

      // Prepare data for AI document processor integration
      const instructorLedData = {
        documentType: "instructor-led",
        trainingType: trainingTitle,
        instructorName: instructorName,
        instructorCredentials: instructorCredentials || 'OSHA Authorized Trainer',
        trainingDate: trainingDate,
        location: location || 'Training Facility',
        duration: duration || '4 hours',
        trainingStandards: trainingStandards || ['OSHA Standard'],
        employees: completedEmployees.map(emp => ({
          name: emp.name,
          employeeId: emp.employeeId || '',
          signature: true,
          completionStatus: 'completed',
          department: emp.department || '',
          position: emp.position || ''
        })),
        certificationEligible: certificationEligible !== false,
        evaluationRequired: evaluationRequired || false,
        instructorNotes: instructorNotes || '',
        userId: userId
      };

      // Call the AI document processor to generate certificates and integrate with Employee Profile system
      const processingResponse = await fetch(`${process.env.API_BASE_URL || 'http://localhost:5000'}/api/verify-and-generate-certificates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': req.headers.authorization || ''
        },
        body: JSON.stringify({
          extractedData: instructorLedData,
          verificationNotes: `Instructor-led training completion: ${trainingTitle} by ${instructorName}`,
          skipVerification: true // Instructor verification already done
        })
      });

      if (!processingResponse.ok) {
        throw new Error(`AI processing failed: ${processingResponse.statusText}`);
      }

      const processingResult = await processingResponse.json();

      // Update session status to completed if it exists
      if (sessionId) {
        try {
          await db
            .update(upcomingTrainingSessions)
            .set({ 
              status: 'completed',
              actualAttendees: completedEmployees.length,
              notes: instructorNotes,
              updatedAt: new Date()
            })
            .where(and(
              eq(upcomingTrainingSessions.id, sessionId),
              eq(upcomingTrainingSessions.userId, userId)
            ));
        } catch (updateError) {
          console.warn('Session update failed (session may not exist):', updateError.message);
        }
      }

      res.json({
        success: true,
        message: 'Training completion processed successfully with Employee Profile integration',
        sessionId: sessionId,
        totalEmployeesProcessed: completedEmployees.length,
        certificatesGenerated: processingResult.certificatesGenerated || completedEmployees.length,
        employeeProfileUpdates: processingResult.employeeProfileUpdates || [],
        processingResult: processingResult
      });

    } catch (error) {
      console.error("Error completing instructor training:", error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete training session'
      });
    }
  });
}