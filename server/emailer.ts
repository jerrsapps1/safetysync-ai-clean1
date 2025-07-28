import nodemailer from "nodemailer";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface InvoiceEmailOptions {
  to: string;
  invoiceUrl: string;
  customerName?: string;
  invoiceNumber?: string;
  amount?: number;
}

export async function sendInvoiceEmail(email: string, invoiceUrl: string, options?: Partial<InvoiceEmailOptions>): Promise<void> {
  // Try Nodemailer first, fallback to Brevo if needed
  try {
    await sendViaNodemailer(email, invoiceUrl, options);
    console.log('Invoice email sent successfully via Nodemailer');
  } catch (nodemailerError) {
    console.warn('Nodemailer failed, trying Brevo fallback:', nodemailerError);
    await sendViaBrevo(email, invoiceUrl, options);
  }
}

async function sendViaNodemailer(toEmail: string, invoiceUrl: string, options?: Partial<InvoiceEmailOptions>): Promise<void> {
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: toEmail,
    subject: "Your Invoice and W-9 Form",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563EB, #1D4ED8); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">SafetySync.AI</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Enterprise Safety Management</p>
        </div>
        
        <div style="padding: 30px; background: #f8fafc;">
          <p>Hi${options?.customerName ? ` ${options.customerName}` : ''},</p>
          <p>Your invoice is ready: <a href="${invoiceUrl}" style="color: #2563EB; text-decoration: none; font-weight: 600;">View Invoice</a></p>
          <p>You can download our W-9 form <a href="${process.env.BASE_URL || 'https://safetysync.ai'}/W9.pdf" style="color: #2563EB; text-decoration: none; font-weight: 600;">here</a>.</p>
          
          <div style="background: #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Payment Terms</h3>
            <ul style="color: #475569; line-height: 1.6;">
              <li>Payment is due within 30 days</li>
              <li>Late payments may incur additional fees</li>
              <li>For questions, contact support@safetysync.ai</li>
            </ul>
          </div>
          
          <p>Thank you!</p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            If you have any questions about this invoice, please contact our support team at 
            <a href="mailto:support@safetysync.ai" style="color: #2563EB;">support@safetysync.ai</a>
          </p>
        </div>
        
        <div style="background: #1e293b; padding: 20px; text-align: center;">
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">
            © 2025 SafetySync.AI. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendViaBrevo(email: string, invoiceUrl: string, options?: Partial<InvoiceEmailOptions>): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY;
  
  if (!apiKey) {
    throw new Error('Brevo API key not configured');
  }

  const baseUrl = 'https://api.brevo.com/v3';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #2563EB, #1D4ED8); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">SafetySync.AI</h1>
        <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Enterprise Safety Management</p>
      </div>
      
      <div style="padding: 30px; background: #f8fafc;">
        <h2 style="color: #1e293b; margin-bottom: 20px;">Invoice Ready for Payment</h2>
        
        <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
          Hello${options?.customerName ? ` ${options.customerName}` : ''},
        </p>
        
        <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
          Your invoice is ready for payment. Please click the button below to view and pay your invoice securely.
        </p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${invoiceUrl}" 
             style="background: #2563EB; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
            View & Pay Invoice
          </a>
        </div>
        
        <div style="background: #e2e8f0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #1e293b; margin-top: 0;">Payment Terms</h3>
          <ul style="color: #475569; line-height: 1.6;">
            <li>Payment is due within 30 days</li>
            <li>Late payments may incur additional fees</li>
            <li>For questions, contact support@safetysync.ai</li>
          </ul>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        
        <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
          If you have any questions about this invoice, please contact our support team at 
          <a href="mailto:support@safetysync.ai" style="color: #2563EB;">support@safetysync.ai</a>
        </p>
      </div>
      
      <div style="background: #1e293b; padding: 20px; text-align: center;">
        <p style="color: #94a3b8; margin: 0; font-size: 14px;">
          © 2025 SafetySync.AI. All rights reserved.
        </p>
      </div>
    </div>
  `;

  const textContent = `
SafetySync.AI Invoice Ready for Payment

Hello${options?.customerName ? ` ${options.customerName}` : ''},

Your invoice is ready for payment. Please visit the following link to view and pay your invoice securely:

${invoiceUrl}

Payment Terms:
- Payment is due within 30 days
- Late payments may incur additional fees
- For questions, contact support@safetysync.ai

If you have any questions about this invoice, please contact our support team at support@safetysync.ai

© 2025 SafetySync.AI. All rights reserved.
  `;

  const emailData = {
    sender: {
      name: "SafetySync.AI Billing",
      email: "billing@safetysync.ai"
    },
    to: [{ email: email, name: options?.customerName || email.split('@')[0] }],
    subject: `Invoice Ready for Payment${options?.invoiceNumber ? ` - #${options.invoiceNumber}` : ''}`,
    htmlContent: htmlContent,
    textContent: textContent
  };

  try {
    const response = await axios.post(
      `${baseUrl}/smtp/email`,
      emailData,
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        }
      }
    );

    console.log('Invoice email sent successfully:', response.data);
  } catch (error: any) {
    console.error('Failed to send invoice email:', error.response?.data || error.message);
    throw new Error(`Invoice email sending failed: ${error.response?.data?.message || error.message}`);
  }
}