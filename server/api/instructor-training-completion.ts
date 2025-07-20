import { Request, Response } from 'express';
import { db } from '../db';
import { trainingRequests, upcomingTrainingSessions } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

interface InstructorTrainingCompletion {
  sessionId: number;
  trainingTitle: string;
  instructorName: string;
  instructorCredentials: string;
  trainingDate: string;
  location: string;
  duration: string;
  trainingStandards: string[];
  employees: Array<{
    name: string;
    employeeId?: string;
    signature: boolean;
    completionStatus: 'completed' | 'partial' | 'absent';
    department?: string;
    position?: string;
  }>;
  certificationEligible: boolean;
  evaluationRequired: boolean;
  instructorNotes?: string;
}

export async function completeInstructorTraining(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const completionData: InstructorTrainingCompletion = req.body;

    if (!userId || !completionData.sessionId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    console.log(`📚 Processing instructor-led training completion for session ${completionData.sessionId}`);

    // Verify the training session exists and belongs to the user
    const [trainingSession] = await db
      .select()
      .from(upcomingTrainingSessions)
      .where(
        and(
          eq(upcomingTrainingSessions.id, completionData.sessionId),
          eq(upcomingTrainingSessions.userId, userId)
        )
      );

    if (!trainingSession) {
      return res.status(404).json({ success: false, error: 'Training session not found' });
    }

    // Create a training request to track this completion
    const [trainingRequest] = await db
      .insert(trainingRequests)
      .values({
        userId: userId,
        employeeName: `Multiple Employees (${completionData.employees.length})`,
        requestType: 'instructor_led',
        trainingType: completionData.trainingTitle,
        urgency: 'standard',
        preferredDate: new Date(completionData.trainingDate),
        location: completionData.location,
        specialRequirements: `Instructor-led training completed by ${completionData.instructorName}. ${completionData.employees.length} employees attended.`,
        status: 'completed',
        completedAt: new Date()
      })
      .returning();

    // Update the training session status
    await db
      .update(upcomingTrainingSessions)
      .set({
        status: 'completed',
        actualAttendees: completionData.employees.length
      })
      .where(eq(upcomingTrainingSessions.id, completionData.sessionId));

    // ENHANCED: Create or update employee profiles and assign certificates
    const { EmployeeCertificateService } = await import('../employee-certificate-service');
    const employeeCertService = new EmployeeCertificateService();

    const certificateIds = [];
    const employeeProfileUpdates = [];

    // Process each employee from the training session
    for (const employee of completionData.employees) {
      if (employee.completionStatus === 'completed') {
        try {
          // Create employee profile if needed and generate certificate
          const result = await employeeCertService.generateAndStoreEmployeeCertificate({
            employeeName: employee.name,
            employeeId: employee.employeeId || `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            trainingTitle: completionData.trainingTitle,
            instructorName: completionData.instructorName,
            instructorCredentials: completionData.instructorCredentials,
            trainingDate: completionData.trainingDate,
            location: completionData.location,
            duration: completionData.duration,
            trainingStandards: completionData.trainingStandards,
            certificationType: completionData.trainingTitle,
            expirationDate: new Date(new Date(completionData.trainingDate).getTime() + (365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // 1 year
            userId,
            companyName: 'SafetySync.AI'
          });

          if (result.success) {
            certificateIds.push(result.certificateId);
            employeeProfileUpdates.push({
              employeeName: employee.name,
              profileCreated: result.profileCreated,
              certificateId: result.certificateId,
              employeeId: result.employeeId
            });
          }
        } catch (employeeError) {
          console.error(`Error processing employee ${employee.name}:`, employeeError);
          // Continue with other employees even if one fails
        }
      }
    }

    // Log successful completion and employee profile integration
    console.log(`✓ Completed instructor-led training: ${completionData.trainingTitle}`);
    console.log(`✓ Generated ${certificateIds.length} certificates for user ${userId}`);
    console.log(`✓ Certificate IDs: ${certificateIds.join(', ')}`);
    console.log(`✓ Employee Profile Updates:`, employeeProfileUpdates);

    res.json({
      success: true,
      message: `Successfully completed instructor-led training and integrated with Employee Profile system`,
      trainingRequestId: trainingRequest.id,
      certificatesGenerated: certificateIds.length,
      certificateIds,
      employeeProfileUpdates,
      profilesCreated: employeeProfileUpdates.filter(e => e.profileCreated).length,
      totalEmployeesProcessed: completionData.employees.filter(e => e.completionStatus === 'completed').length
    });

  } catch (error) {
    console.error('Instructor training completion error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to complete instructor training and generate certificates' 
    });
  }
}

export async function getInstructorTrainingSessions(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    // Get upcoming training sessions for the instructor
    const sessions = await db
      .select()
      .from(upcomingTrainingSessions)
      .where(eq(upcomingTrainingSessions.userId, userId));

    res.json({
      success: true,
      sessions: sessions
    });

  } catch (error) {
    console.error('Error fetching instructor training sessions:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch training sessions' 
    });
  }
}