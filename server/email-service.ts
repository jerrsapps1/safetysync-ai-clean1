// Email service now uses Brevo API to eliminate SMTP authentication errors

interface EmailVerificationData {
  email: string;
  name: string;
  verificationToken: string;
  company?: string;
}

export async function sendVerificationEmail(data: EmailVerificationData): Promise<boolean> {
  try {
    // Use Brevo API for email verification to avoid SMTP authentication errors
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || '',
      },
      body: JSON.stringify({
        email: data.email,
        attributes: { 
          FIRSTNAME: data.name,
          SOURCE: 'SafetySync.AI Verification',
          TOKEN: data.verificationToken
        },
        listIds: [1], // Default verification list
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      console.error('Brevo verification email error:', await response.text());
      return false;
    }

    console.log('✅ Email verification contact created in Brevo:', data.email);
    return true;
  } catch (error: any) {
    console.error(`❌ EMAIL: Failed to send verification email via Brevo:`, error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  try {
    // Use Brevo API for welcome emails to avoid SMTP authentication errors
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
          SOURCE: 'SafetySync.AI Welcome',
          STATUS: 'VERIFIED'
        },
        listIds: [2], // Welcome list
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      console.error('Brevo welcome email error:', await response.text());
      return false;
    }

    console.log('✅ Welcome email contact created in Brevo:', email);
    return true;
  } catch (error: any) {
    console.error('❌ EMAIL: Failed to send welcome email via Brevo:', error);
    return false;
  }
}