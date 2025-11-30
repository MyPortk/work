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
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f7fa; }
          .wrapper { background-color: #f5f7fa; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.1); }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .content { padding: 40px 30px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 14px; font-weight: 600; color: #667eea; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
          .info-card { background-color: #f8f9fb; border-left: 4px solid #667eea; padding: 16px; border-radius: 4px; margin-bottom: 12px; }
          .info-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5e7eb; }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: 600; color: #667eea; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-value { font-size: 15px; color: #333; font-weight: 500; }
          .notes-section { background-color: #fef9e7; border: 1px solid #fce8b2; border-radius: 6px; padding: 16px; margin-top: 20px; }
          .notes-label { font-size: 12px; font-weight: 600; color: #b8860b; text-transform: uppercase; letter-spacing: 0.5px; }
          .notes-value { font-size: 14px; color: #333; margin-top: 8px; line-height: 1.5; }
          .action-section { background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); padding: 20px; border-radius: 6px; margin-top: 30px; text-align: center; }
          .action-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 12px; transition: transform 0.2s; }
          .action-button:hover { transform: translateY(-2px); }
          .footer { background-color: #f8f9fb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer-text { font-size: 12px; color: #999; line-height: 1.6; }
          .footer-logo { font-weight: 700; color: #667eea; font-size: 13px; margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>New Reservation Request</h1>
              <p>Action required: Please review this request</p>
            </div>
            <div class="content">
              <div class="section">
                <div class="section-title">Requested Item</div>
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Item Name</span>
                    <span class="info-value">${data.itemName}</span>
                  </div>
                </div>
              </div>
              
              <div class="section">
                <div class="section-title">Requester Information</div>
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Name</span>
                    <span class="info-value">${data.userName}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Email</span>
                    <span class="info-value"><a href="mailto:${data.userEmail}" style="color: #667eea; text-decoration: none; font-weight: 500;">${data.userEmail}</a></span>
                  </div>
                </div>
              </div>

              <div class="section">
                <div class="section-title">Reservation Dates</div>
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Start Date</span>
                    <span class="info-value">${data.startDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Return Date</span>
                    <span class="info-value">${data.returnDate}</span>
                  </div>
                </div>
              </div>

              ${data.notes ? `
              <div class="section">
                <div class="notes-section">
                  <div class="notes-label">Additional Notes</div>
                  <div class="notes-value">${data.notes}</div>
                </div>
              </div>
              ` : ''}

              <div class="action-section">
                <p style="color: #667eea; font-weight: 600; margin-bottom: 10px;">Ready to Review?</p>
                <p style="color: #666; font-size: 13px; margin-bottom: 12px;">Log in to the Inventory Management System to approve or reject this request</p>
                <a href="https://inventory.example.com" class="action-button">Review in System</a>
              </div>
            </div>
            <div class="footer">
              <div class="footer-logo">Inventory Management System</div>
              <p class="footer-text">
                This is an automated notification. Please do not reply directly to this email.<br>
                Contact your administrator for assistance.
              </p>
            </div>
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
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f7fa; }
          .wrapper { background-color: #f5f7fa; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(34, 197, 94, 0.1); }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .success-banner { background-color: #ecfdf5; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center; }
          .success-icon { font-size: 40px; margin-bottom: 10px; }
          .success-text { color: #16a34a; font-weight: 700; font-size: 18px; margin-bottom: 5px; }
          .success-subtext { color: #059669; font-size: 14px; }
          .content { padding: 40px 30px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 14px; font-weight: 600; color: #22c55e; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
          .info-card { background-color: #f8fdf9; border-left: 4px solid #22c55e; padding: 16px; border-radius: 4px; margin-bottom: 12px; }
          .info-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e5f3e8; }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: 600; color: #22c55e; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-value { font-size: 15px; color: #333; font-weight: 500; }
          .instruction-section { background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.05) 100%); padding: 20px; border-radius: 6px; margin-top: 30px; border-left: 4px solid #22c55e; }
          .instruction-title { color: #22c55e; font-weight: 700; margin-bottom: 12px; font-size: 14px; }
          .instruction-text { color: #666; font-size: 14px; line-height: 1.7; margin-bottom: 10px; }
          .instruction-text:last-child { margin-bottom: 0; }
          .action-button { display: inline-block; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 16px; }
          .footer { background-color: #f8fdf9; padding: 24px 30px; text-align: center; border-top: 1px solid #e5f3e8; }
          .footer-text { font-size: 12px; color: #999; line-height: 1.6; }
          .footer-logo { font-weight: 700; color: #22c55e; font-size: 13px; margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Reservation Approved</h1>
              <p>Your request has been successfully approved</p>
            </div>
            <div class="content">
              <div class="success-banner">
                <div class="success-icon">✓</div>
                <div class="success-text">Great News!</div>
                <div class="success-subtext">Your reservation has been approved</div>
              </div>

              <div class="section">
                <div class="section-title">Reservation Details</div>
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Item</span>
                    <span class="info-value">${data.itemName}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Pickup Date</span>
                    <span class="info-value">${data.startDate}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Return Date</span>
                    <span class="info-value">${data.returnDate}</span>
                  </div>
                </div>
              </div>

              <div class="instruction-section">
                <div class="instruction-title">Next Steps</div>
                <div class="instruction-text">• Pick up the item on the scheduled start date</div>
                <div class="instruction-text">• Inspect the item for any damage or defects</div>
                <div class="instruction-text">• Use the item according to the policy guidelines</div>
                <div class="instruction-text">• Return the item in the same condition by the return date</div>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://inventory.example.com" class="action-button">Go to System</a>
              </div>
            </div>
            <div class="footer">
              <div class="footer-logo">Inventory Management System</div>
              <p class="footer-text">
                Questions about your reservation? Contact your administrator<br>
                This is an automated notification. Please do not reply directly to this email.
              </p>
            </div>
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
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f5f7fa; }
          .wrapper { background-color: #f5f7fa; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(239, 68, 68, 0.1); }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 8px; }
          .header p { font-size: 14px; opacity: 0.9; }
          .alert-banner { background-color: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center; }
          .alert-icon { font-size: 40px; margin-bottom: 10px; }
          .alert-text { color: #dc2626; font-weight: 700; font-size: 18px; margin-bottom: 5px; }
          .alert-subtext { color: #991b1b; font-size: 14px; }
          .content { padding: 40px 30px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 14px; font-weight: 600; color: #ef4444; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; }
          .info-card { background-color: #fdf8f8; border-left: 4px solid #ef4444; padding: 16px; border-radius: 4px; margin-bottom: 12px; }
          .info-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #fedcdc; }
          .info-row:last-child { border-bottom: none; }
          .info-label { font-weight: 600; color: #ef4444; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .info-value { font-size: 15px; color: #333; font-weight: 500; }
          .reason-section { background: linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.05) 100%); padding: 20px; border-radius: 6px; margin-top: 30px; border-left: 4px solid #ef4444; }
          .reason-title { color: #dc2626; font-weight: 700; margin-bottom: 12px; font-size: 14px; }
          .reason-text { color: #333; font-size: 14px; line-height: 1.7; }
          .next-steps-section { background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-top: 30px; }
          .next-steps-title { color: #667eea; font-weight: 700; margin-bottom: 12px; font-size: 14px; }
          .next-steps-text { color: #666; font-size: 14px; line-height: 1.7; margin-bottom: 10px; }
          .contact-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; margin-top: 16px; }
          .footer { background-color: #fdf8f8; padding: 24px 30px; text-align: center; border-top: 1px solid #fedcdc; }
          .footer-text { font-size: 12px; color: #999; line-height: 1.6; }
          .footer-logo { font-weight: 700; color: #ef4444; font-size: 13px; margin-bottom: 8px; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="container">
            <div class="header">
              <h1>Reservation Status Update</h1>
              <p>Your request requires attention</p>
            </div>
            <div class="content">
              <div class="alert-banner">
                <div class="alert-icon">✕</div>
                <div class="alert-text">Request Not Approved</div>
                <div class="alert-subtext">Unfortunately, your reservation could not be approved at this time</div>
              </div>

              <div class="section">
                <div class="section-title">Reservation Details</div>
                <div class="info-card">
                  <div class="info-row">
                    <span class="info-label">Item</span>
                    <span class="info-value">${data.itemName}</span>
                  </div>
                  <div class="info-row">
                    <span class="info-label">Requested Period</span>
                    <span class="info-value">${data.startDate} to ${data.returnDate}</span>
                  </div>
                </div>
              </div>

              ${data.rejectionReason ? `
              <div class="reason-section">
                <div class="reason-title">Reason for Rejection</div>
                <div class="reason-text">${data.rejectionReason}</div>
              </div>
              ` : ''}

              <div class="next-steps-section">
                <div class="next-steps-title">What You Can Do</div>
                <div class="next-steps-text">• Try requesting different dates for the same item</div>
                <div class="next-steps-text">• Look for an alternative item that meets your needs</div>
                <div class="next-steps-text">• Contact your administrator to discuss options</div>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://inventory.example.com" class="contact-button">Back to Inventory System</a>
              </div>
            </div>
            <div class="footer">
              <div class="footer-logo">Inventory Management System</div>
              <p class="footer-text">
                Need help? Contact your administrator for assistance<br>
                This is an automated notification. Please do not reply directly to this email.
              </p>
            </div>
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
