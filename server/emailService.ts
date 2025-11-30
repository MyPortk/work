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
    deliveryRequired?: string;
    deliveryLocation?: string;
    deliveryStreet?: string;
    deliveryArea?: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2d3748; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; }
          .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); overflow: hidden; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
          .header p { font-size: 14px; margin: 8px 0 0 0; opacity: 0.95; }
          .content { padding: 40px 30px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 12px; font-weight: 700; color: #667eea; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
          .info-grid { display: table; width: 100%; border-spacing: 0; }
          .info-row { display: table-row; border-bottom: 1px solid #f0f0f0; }
          .info-row:last-child { border-bottom: none; }
          .info-cell { display: table-cell; padding: 12px 0; }
          .info-label { font-weight: 700; color: #667eea; font-size: 13px; width: 120px; }
          .info-value { color: #2d3748; font-size: 14px; word-break: break-word; }
          .highlight-box { background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); border: 1px solid rgba(102, 126, 234, 0.2); border-left: 4px solid #667eea; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .delivery-box { background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%); border: 1px solid rgba(59, 130, 246, 0.2); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .delivery-title { font-weight: 700; color: #3b82f6; font-size: 14px; margin-bottom: 12px; }
          .notes-box { background: #fffbf0; border: 1px solid #fde68a; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 8px; margin: 20px 0; }
          .notes-label { font-weight: 700; color: #b45309; font-size: 12px; margin-bottom: 8px; }
          .notes-text { color: #78350f; font-size: 14px; line-height: 1.6; }
          .cta-section { background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%); padding: 24px; border-radius: 8px; text-align: center; margin-top: 30px; }
          .cta-text { font-size: 14px; color: #2d3748; margin: 0; }
          .footer { background: #f8f9fa; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer-text { font-size: 12px; color: #718096; line-height: 1.6; margin: 0; }
          .divider { height: 1px; background: #e5e7eb; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>📋 New Reservation Request</h1>
            <p>Action Required: Review this request</p>
          </div>
          <div class="content">
            <div class="section">
              <div class="section-title">Equipment Details</div>
              <div class="highlight-box">
                <div class="info-grid">
                  <div class="info-row">
                    <div class="info-cell"><span class="info-label">Item:</span></div>
                    <div class="info-cell"><span class="info-value">${data.itemName}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Requester Information</div>
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-cell"><span class="info-label">Name:</span></div>
                  <div class="info-cell"><span class="info-value">${data.userName}</span></div>
                </div>
                <div class="info-row">
                  <div class="info-cell"><span class="info-label">Email:</span></div>
                  <div class="info-cell"><span class="info-value"><a href="mailto:${data.userEmail}" style="color: #667eea; text-decoration: none; font-weight: 500;">${data.userEmail}</a></span></div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="section-title">Reservation Period</div>
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-cell"><span class="info-label">Start Date:</span></div>
                  <div class="info-cell"><span class="info-value">${data.startDate}</span></div>
                </div>
                <div class="info-row">
                  <div class="info-cell"><span class="info-label">Return Date:</span></div>
                  <div class="info-cell"><span class="info-value">${data.returnDate}</span></div>
                </div>
              </div>
            </div>

            ${data.deliveryRequired === 'yes' ? `
            <div class="section">
              <div class="section-title">Delivery Information</div>
              <div class="delivery-box">
                <div class="delivery-title">🚚 Delivery Requested</div>
                <div class="info-grid">
                  <div class="info-row">
                    <div class="info-cell"><span class="info-label">Location:</span></div>
                    <div class="info-cell"><span class="info-value">${data.deliveryLocation || 'N/A'}</span></div>
                  </div>
                  <div class="info-row">
                    <div class="info-cell"><span class="info-label">Street:</span></div>
                    <div class="info-cell"><span class="info-value">${data.deliveryStreet || 'N/A'}</span></div>
                  </div>
                  <div class="info-row">
                    <div class="info-cell"><span class="info-label">Area:</span></div>
                    <div class="info-cell"><span class="info-value">${data.deliveryArea || 'N/A'}</span></div>
                  </div>
                </div>
              </div>
            </div>
            ` : ''}

            ${data.notes ? `
            <div class="section">
              <div class="notes-box">
                <div class="notes-label">📝 Additional Notes</div>
                <div class="notes-text">${data.notes}</div>
              </div>
            </div>
            ` : ''}

            <div class="cta-section">
              <p class="cta-text"><strong>Log in to the Inventory Management System</strong> to review, approve, or reject this reservation request.</p>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">This is an automated notification from your Inventory Management System.<br>Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `📋 New Reservation Request for ${data.itemName}`,
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
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2d3748; background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; }
          .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); overflow: hidden; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
          .header p { font-size: 14px; margin: 8px 0 0 0; opacity: 0.95; }
          .success-banner { background: linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.1) 100%); border: 2px solid #86efac; border-radius: 8px; padding: 24px; text-align: center; margin: 30px 0; }
          .success-badge { font-size: 40px; margin-bottom: 12px; }
          .success-title { font-size: 18px; font-weight: 700; color: #16a34a; margin: 12px 0; }
          .success-text { font-size: 14px; color: #22c55e; }
          .content { padding: 40px 30px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 12px; font-weight: 700; color: #22c55e; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
          .info-grid { display: table; width: 100%; border-spacing: 0; }
          .info-row { display: table-row; border-bottom: 1px solid #f0f0f0; }
          .info-row:last-child { border-bottom: none; }
          .info-cell { display: table-cell; padding: 12px 0; }
          .info-label { font-weight: 700; color: #22c55e; font-size: 13px; width: 120px; }
          .info-value { color: #2d3748; font-size: 14px; word-break: break-word; }
          .highlight-box { background: linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(22, 163, 74, 0.05) 100%); border: 1px solid rgba(34, 197, 94, 0.2); border-left: 4px solid #22c55e; padding: 20px; border-radius: 8px; }
          .checklist { background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #22c55e; }
          .checklist-title { font-weight: 700; color: #22c55e; font-size: 14px; margin-bottom: 12px; }
          .checklist ul { list-style: none; margin: 0; padding: 0; }
          .checklist li { padding: 8px 0; color: #166534; font-size: 14px; padding-left: 24px; position: relative; }
          .checklist li:before { content: "✓"; position: absolute; left: 0; font-weight: bold; color: #22c55e; }
          .footer { background: #f8f9fa; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer-text { font-size: 12px; color: #718096; line-height: 1.6; margin: 0; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>✅ Reservation Approved</h1>
            <p>Your request has been approved</p>
          </div>
          <div class="content">
            <div class="success-banner">
              <div class="success-badge">🎉</div>
              <div class="success-title">Great News!</div>
              <div class="success-text">Your equipment reservation has been approved and is ready for pickup.</div>
            </div>

            <div class="section">
              <div class="section-title">Reservation Details</div>
              <div class="highlight-box">
                <div class="info-grid">
                  <div class="info-row">
                    <div class="info-cell"><span class="info-label">Equipment:</span></div>
                    <div class="info-cell"><span class="info-value">${data.itemName}</span></div>
                  </div>
                  <div class="info-row">
                    <div class="info-cell"><span class="info-label">Pickup Date:</span></div>
                    <div class="info-cell"><span class="info-value">${data.startDate}</span></div>
                  </div>
                  <div class="info-row">
                    <div class="info-cell"><span class="info-label">Return Date:</span></div>
                    <div class="info-cell"><span class="info-value">${data.returnDate}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section">
              <div class="checklist">
                <div class="checklist-title">Before You Pick Up</div>
                <ul>
                  <li>Inspect the item for any damage or defects</li>
                  <li>Report any issues immediately to the system</li>
                  <li>Use the item according to the guidelines</li>
                  <li>Return the item in the same condition by the return date</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">This is an automated notification from your Inventory Management System.<br>Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `✅ Your Reservation for ${data.itemName} Has Been Approved`,
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
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #2d3748; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 40px 20px; }
          .wrapper { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15); overflow: hidden; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 30px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px; }
          .header p { font-size: 14px; margin: 8px 0 0 0; opacity: 0.95; }
          .alert-banner { background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%); border: 2px solid #fecaca; border-radius: 8px; padding: 24px; text-align: center; margin: 30px 0; }
          .alert-badge { font-size: 40px; margin-bottom: 12px; }
          .alert-title { font-size: 18px; font-weight: 700; color: #dc2626; margin: 12px 0; }
          .alert-text { font-size: 14px; color: #ef4444; }
          .content { padding: 40px 30px; }
          .section { margin-bottom: 30px; }
          .section-title { font-size: 12px; font-weight: 700; color: #ef4444; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
          .info-grid { display: table; width: 100%; border-spacing: 0; }
          .info-row { display: table-row; border-bottom: 1px solid #f0f0f0; }
          .info-row:last-child { border-bottom: none; }
          .info-cell { display: table-cell; padding: 12px 0; }
          .info-label { font-weight: 700; color: #ef4444; font-size: 13px; width: 120px; }
          .info-value { color: #2d3748; font-size: 14px; word-break: break-word; }
          .reason-box { background: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; }
          .reason-title { font-weight: 700; color: #dc2626; font-size: 14px; margin-bottom: 12px; }
          .reason-text { color: #7f1d1d; font-size: 14px; line-height: 1.6; }
          .help-box { background: #f3f4f6; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; margin: 20px 0; }
          .help-title { font-weight: 700; color: #667eea; font-size: 14px; margin-bottom: 12px; }
          .help-text { color: #4b5563; font-size: 14px; line-height: 1.6; }
          .help-text ul { list-style: none; margin: 0; padding: 0; margin-top: 8px; }
          .help-text li { padding: 6px 0; padding-left: 20px; position: relative; }
          .help-text li:before { content: "→"; position: absolute; left: 0; color: #667eea; font-weight: bold; }
          .footer { background: #f8f9fa; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb; }
          .footer-text { font-size: 12px; color: #718096; line-height: 1.6; margin: 0; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header">
            <h1>❌ Reservation Not Approved</h1>
            <p>Your request requires attention</p>
          </div>
          <div class="content">
            <div class="alert-banner">
              <div class="alert-badge">⚠️</div>
              <div class="alert-title">Request Not Approved</div>
              <div class="alert-text">Unfortunately, your reservation could not be approved at this time.</div>
            </div>

            <div class="section">
              <div class="section-title">Reservation Details</div>
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-cell"><span class="info-label">Equipment:</span></div>
                  <div class="info-cell"><span class="info-value">${data.itemName}</span></div>
                </div>
                <div class="info-row">
                  <div class="info-cell"><span class="info-label">Requested Period:</span></div>
                  <div class="info-cell"><span class="info-value">${data.startDate} to ${data.returnDate}</span></div>
                </div>
              </div>
            </div>

            ${data.rejectionReason ? `
            <div class="section">
              <div class="reason-box">
                <div class="reason-title">📋 Reason for Rejection</div>
                <div class="reason-text">${data.rejectionReason}</div>
              </div>
            </div>
            ` : ''}

            <div class="help-box">
              <div class="help-title">What You Can Do</div>
              <div class="help-text">
                <ul>
                  <li>Request different dates for the same equipment</li>
                  <li>Look for alternative equipment that meets your needs</li>
                  <li>Contact your administrator to discuss options</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="footer">
            <p class="footer-text">This is an automated notification from your Inventory Management System.<br>Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `❌ Your Reservation for ${data.itemName} Has Been Rejected`,
    html
  });
}
