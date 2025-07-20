import { Request, Response } from 'express';
import { complianceEngine } from '../compliance-recommendation-engine';

export async function getPersonalizedRecommendations(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    console.log(`🔍 Generating personalized compliance recommendations for user ${userId}`);
    
    const result = await complianceEngine.generatePersonalizedRecommendations(userId);
    
    res.json({
      success: true,
      recommendations: result.recommendations,
      analytics: result.analytics,
      generatedAt: new Date().toISOString(),
      message: `Generated ${result.recommendations.length} personalized recommendations`
    });

  } catch (error) {
    console.error('Compliance recommendations error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate compliance recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export async function getComplianceAnalytics(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const result = await complianceEngine.generatePersonalizedRecommendations(userId);
    
    res.json({
      success: true,
      analytics: result.analytics,
      generatedAt: new Date().toISOString()
    });

  } catch (error) {
    console.error('Compliance analytics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get compliance analytics' 
    });
  }
}

export async function dismissRecommendation(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const { recommendationId, reason } = req.body;
    
    if (!userId || !recommendationId) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    // In a full implementation, you would store dismissed recommendations
    // For now, we'll just return success
    console.log(`📝 User ${userId} dismissed recommendation ${recommendationId}: ${reason || 'No reason provided'}`);
    
    res.json({
      success: true,
      message: 'Recommendation dismissed successfully'
    });

  } catch (error) {
    console.error('Dismiss recommendation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to dismiss recommendation' 
    });
  }
}