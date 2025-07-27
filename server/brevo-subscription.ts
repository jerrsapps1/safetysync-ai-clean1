// Brevo Email Subscription Service for SafetySync.AI
import type { Request, Response } from 'express';

export async function subscribeToBrevo(req: Request, res: Response) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
      },
      body: JSON.stringify({
        email,
        attributes: { 
          FIRSTNAME: name,
          SOURCE: 'SafetySync.AI'
        },
        listIds: [1], // Default list ID - user can update with actual Brevo list ID
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Brevo subscription error:', error);
      return res.status(500).json({ error: 'Failed to subscribe to newsletter' });
    }

    const data = await response.json();
    console.log('✅ Brevo subscription successful:', { email, name });
    
    res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to SafetySync.AI updates',
      contactId: data.id 
    });
  } catch (err: any) {
    console.error('❌ Brevo subscription error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}