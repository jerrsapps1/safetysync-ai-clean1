import { Router } from 'express';
import OpenAI from 'openai';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';

const router = Router();

// JWT authentication middleware
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

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

interface ContextualHelpRequest {
  currentPage: string;
  question: string;
  prompt: string;
}

interface HelpResponse {
  answer: string;
  relatedFeatures: string[];
  quickActions: Array<{
    label: string;
    action: string;
  }>;
}

router.post('/contextual-help', authenticateToken, async (req, res) => {
  try {
    const { currentPage, question, prompt }: ContextualHelpRequest = req.body;

    if (!question || !prompt) {
      return res.status(400).json({
        success: false,
        message: 'Question and prompt are required'
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for SafetySync.AI, an OSHA compliance and safety management platform. Provide accurate, actionable guidance about workplace safety, OSHA compliance, training management, and platform features. Always respond in valid JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = response.choices[0].message.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    let parsedResponse: HelpResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback response if JSON parsing fails
      parsedResponse = {
        answer: "I'd be happy to help you with that question. Could you please rephrase it or be more specific about what you need assistance with?",
        relatedFeatures: ["Dashboard Overview", "Employee Management", "Training Documents"],
        quickActions: [
          { label: "View Help Documentation", action: "open_documentation" },
          { label: "Contact Support", action: "contact_support" }
        ]
      };
    }

    // Validate the response structure
    if (!parsedResponse.answer || !Array.isArray(parsedResponse.relatedFeatures) || !Array.isArray(parsedResponse.quickActions)) {
      throw new Error('Invalid response structure from AI');
    }

    res.json({
      success: true,
      response: parsedResponse,
      metadata: {
        currentPage,
        timestamp: new Date().toISOString(),
        model: "gpt-4o"
      }
    });

  } catch (error) {
    console.error('Error in contextual help:', error);
    
    // Provide a fallback response
    const fallbackResponse: HelpResponse = {
      answer: "I'm currently unable to process your request, but I'd be happy to help! For immediate assistance, please check our documentation or contact support.",
      relatedFeatures: ["User Guide", "Platform Dashboard", "Support Resources"],
      quickActions: [
        { label: "Open User Guide", action: "open_user_guide" },
        { label: "View Dashboard", action: "open_dashboard" }
      ]
    };

    res.status(500).json({
      success: false,
      message: 'Failed to get AI assistance',
      fallbackResponse,
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
});

export default router;