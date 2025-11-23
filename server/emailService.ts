import nodemailer from 'nodemailer';

// Email service configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // If no SMTP configured, log the email instead of failing
    if (!process.env.SMTP_HOST) {
      console.log('📧 Email would be sent to:', options.to);
      console.log('   Subject:', options.subject);
      console.log('   Body:', options.html.substring(0, 100) + '...');
      return true;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@inventory.local',
      ...options,
    });
    console.log('✅ Email sent to:', options.to);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}

export async function sendReservationRequestEmail(
  adminEmail: string,
  data: {
    itemName: string;
    userName: string;
    userEmail: string;
    startDate: string;
    returnDate: string;
    notes?: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #667eea; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #667eea; display: block; margin-bottom: 5px; }
          .value { margin-left: 20px; }
          .footer { margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Reservation Request</h2>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Item:</span>
              <div class="value">${data.itemName}</div>
            </div>
            <div class="field">
              <span class="label">Requested By:</span>
              <div class="value">${data.userName}</div>
            </div>
            <div class="field">
              <span class="label">User Email:</span>
              <div class="value"><a href="mailto:${data.userEmail}">${data.userEmail}</a></div>
            </div>
            <div class="field">
              <span class="label">Start Date:</span>
              <div class="value">${data.startDate}</div>
            </div>
            <div class="field">
              <span class="label">Return Date:</span>
              <div class="value">${data.returnDate}</div>
            </div>
            ${data.notes ? `
            <div class="field">
              <span class="label">Notes:</span>
              <div class="value">${data.notes}</div>
            </div>
            ` : ''}
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              Please review this reservation request and approve or reject it in the system.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Reservation Request for ${data.itemName}`,
    html
  });
}

export async function sendReservationApprovedEmail(
  userEmail: string,
  data: {
    itemName: string;
    userName: string;
    userEmail: string;
    startDate: string;
    returnDate: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #22c55e; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #22c55e; display: block; margin-bottom: 5px; }
          .value { margin-left: 20px; }
          .footer { margin-top: 20px; font-size: 12px; color: #999; }
          .success { color: #22c55e; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Reservation Approved ✓</h2>
          </div>
          <div class="content">
            <p class="success">Your reservation has been approved!</p>
            <div class="field">
              <span class="label">Item:</span>
              <div class="value">${data.itemName}</div>
            </div>
            <div class="field">
              <span class="label">Start Date:</span>
              <div class="value">${data.startDate}</div>
            </div>
            <div class="field">
              <span class="label">Return Date:</span>
              <div class="value">${data.returnDate}</div>
            </div>
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              Please pick up the item on the start date and ensure to return it in good condition by the return date.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Your Reservation for ${data.itemName} Has Been Approved`,
    html
  });
}

export async function sendReservationRejectedEmail(
  userEmail: string,
  data: {
    itemName: string;
    userName: string;
    userEmail: string;
    startDate: string;
    returnDate: string;
    rejectionReason?: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ef4444; color: white; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .content { background-color: #f9f9f9; padding: 20px; border-radius: 5px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #ef4444; display: block; margin-bottom: 5px; }
          .value { margin-left: 20px; }
          .footer { margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Reservation Rejected</h2>
          </div>
          <div class="content">
            <p>Unfortunately, your reservation request has been rejected.</p>
            <div class="field">
              <span class="label">Item:</span>
              <div class="value">${data.itemName}</div>
            </div>
            <div class="field">
              <span class="label">Requested Period:</span>
              <div class="value">${data.startDate} to ${data.returnDate}</div>
            </div>
            ${data.rejectionReason ? `
            <div class="field">
              <span class="label">Reason:</span>
              <div class="value">${data.rejectionReason}</div>
            </div>
            ` : ''}
            <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              If you have any questions, please contact the administrator.
            </p>
          </div>
          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Your Reservation for ${data.itemName} Has Been Rejected`,
    html
  });
}
