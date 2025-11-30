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
          body { font-family: 'Times New Roman', Times, serif; line-height: 1.8; color: #1a1a1a; background: #f5f5f5; padding: 20px; }
          .document { max-width: 700px; margin: 0 auto; background: white; padding: 60px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 5px; letter-spacing: 1px; }
          .subtitle { font-size: 12px; text-align: center; color: #666; }
          .date-line { text-align: right; font-size: 13px; margin-bottom: 30px; color: #666; }
          .salutation { margin-bottom: 25px; font-size: 14px; }
          .body-text { font-size: 14px; margin-bottom: 20px; text-align: justify; }
          .section-header { font-weight: bold; margin-top: 25px; margin-bottom: 12px; font-size: 14px; }
          .info-row { margin-bottom: 10px; display: flex; font-size: 14px; }
          .info-label { font-weight: bold; width: 150px; }
          .info-value { flex: 1; }
          .closing-section { margin-top: 35px; font-size: 14px; }
          .signature-line { margin-top: 40px; }
          .footer-line { border-top: 2px solid #333; margin-top: 30px; padding-top: 15px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="document">
          <div class="header">
            <div class="title">EQUIPMENT RESERVATION REQUEST</div>
            <div class="subtitle">Inventory Management System - Administrative Notice</div>
          </div>
          
          <div class="date-line">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          
          <div class="salutation">Dear Administrator,</div>
          
          <div class="body-text">
            We hereby notify you that a new equipment reservation request has been submitted and requires your review and approval. Please find the complete details of this request below.
          </div>

          <div class="section-header">REQUEST DETAILS</div>
          <div class="info-row">
            <div class="info-label">Equipment Item:</div>
            <div class="info-value">${data.itemName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Requested Period:</div>
            <div class="info-value">${data.startDate} to ${data.returnDate}</div>
          </div>

          <div class="section-header">REQUESTER INFORMATION</div>
          <div class="info-row">
            <div class="info-label">Full Name:</div>
            <div class="info-value">${data.userName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Email Address:</div>
            <div class="info-value"><a href="mailto:${data.userEmail}" style="color: #0066cc; text-decoration: none;">${data.userEmail}</a></div>
          </div>

          ${data.deliveryRequired === 'yes' ? `
          <div class="section-header">DELIVERY INFORMATION</div>
          <div class="body-text">The requester has indicated that delivery is required for this equipment. The following delivery details have been provided:</div>
          <div class="info-row">
            <div class="info-label">Delivery Location:</div>
            <div class="info-value">${data.deliveryLocation || 'Not specified'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Street Address:</div>
            <div class="info-value">${data.deliveryStreet || 'Not specified'}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Area/District:</div>
            <div class="info-value">${data.deliveryArea || 'Not specified'}</div>
          </div>
          ` : ''}

          ${data.notes ? `
          <div class="section-header">ADDITIONAL NOTES</div>
          <div class="body-text">${data.notes}</div>
          ` : ''}

          <div class="closing-section">
            <div class="body-text">
              Please proceed to the Inventory Management System to review this request. You may approve or reject the reservation based on the availability of the requested equipment and the feasibility of the requested dates. Should you require any additional information from the requester, please contact them directly at the email address provided above.
            </div>
            
            <div class="body-text">
              Thank you for your prompt attention to this matter.
            </div>
          </div>

          <div class="signature-line">
            <div>Inventory Management System</div>
            <div style="font-size: 13px; color: #666; margin-top: 8px;">Automated Administrative Notification</div>
          </div>

          <div class="footer-line">
            This is an automated communication from the Inventory Management System. Please do not reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `EQUIPMENT RESERVATION REQUEST - ${data.itemName}`,
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
          body { font-family: 'Times New Roman', Times, serif; line-height: 1.8; color: #1a1a1a; background: #f5f5f5; padding: 20px; }
          .document { max-width: 700px; margin: 0 auto; background: white; padding: 60px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 5px; letter-spacing: 1px; }
          .subtitle { font-size: 12px; text-align: center; color: #666; }
          .date-line { text-align: right; font-size: 13px; margin-bottom: 30px; color: #666; }
          .salutation { margin-bottom: 25px; font-size: 14px; }
          .body-text { font-size: 14px; margin-bottom: 20px; text-align: justify; line-height: 1.8; }
          .section-header { font-weight: bold; margin-top: 25px; margin-bottom: 12px; font-size: 14px; }
          .info-row { margin-bottom: 10px; display: flex; font-size: 14px; }
          .info-label { font-weight: bold; width: 150px; }
          .info-value { flex: 1; }
          .important-box { border: 1px solid #333; padding: 15px; margin: 20px 0; font-size: 14px; }
          .closing-section { margin-top: 35px; font-size: 14px; }
          .signature-line { margin-top: 40px; }
          .footer-line { border-top: 2px solid #333; margin-top: 30px; padding-top: 15px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="document">
          <div class="header">
            <div class="title">EQUIPMENT RESERVATION APPROVAL</div>
            <div class="subtitle">Inventory Management System - Approval Notice</div>
          </div>
          
          <div class="date-line">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          
          <div class="salutation">Dear ${data.userName},</div>
          
          <div class="body-text">
            We are pleased to inform you that your equipment reservation request has been reviewed and approved by the Inventory Management System. Your requested equipment is now reserved and ready for pickup.
          </div>

          <div class="section-header">RESERVATION CONFIRMATION</div>
          <div class="info-row">
            <div class="info-label">Equipment Item:</div>
            <div class="info-value">${data.itemName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Pickup Date:</div>
            <div class="info-value">${data.startDate}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Return Date:</div>
            <div class="info-value">${data.returnDate}</div>
          </div>

          <div class="important-box">
            <div style="font-weight: bold; margin-bottom: 10px;">IMPORTANT INSTRUCTIONS</div>
            <div style="margin-bottom: 8px;">1. Please inspect the equipment carefully upon pickup for any damage or defects.</div>
            <div style="margin-bottom: 8px;">2. Report any issues or damage immediately to the appropriate administrator.</div>
            <div style="margin-bottom: 8px;">3. Use the equipment in accordance with all applicable policies and guidelines.</div>
            <div>4. Ensure the equipment is returned in the same condition by the specified return date.</div>
          </div>

          <div class="closing-section">
            <div class="body-text">
              Please note that you are responsible for the safekeeping and proper use of this equipment during the reservation period. In the event of damage or loss, appropriate charges may be assessed as per company policy.
            </div>
            
            <div class="body-text">
              Should you have any questions regarding this approval or require further assistance, please contact the administrative office directly.
            </div>

            <div class="body-text">
              Yours sincerely,
            </div>
          </div>

          <div class="signature-line">
            <div style="height: 50px;"></div>
            <div>Inventory Management System</div>
            <div style="font-size: 13px; color: #666; margin-top: 8px;">Administrative Services</div>
          </div>

          <div class="footer-line">
            This is an automated communication from the Inventory Management System. Please do not reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `EQUIPMENT RESERVATION APPROVAL - ${data.itemName}`,
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
          body { font-family: 'Times New Roman', Times, serif; line-height: 1.8; color: #1a1a1a; background: #f5f5f5; padding: 20px; }
          .document { max-width: 700px; margin: 0 auto; background: white; padding: 60px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); }
          .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 5px; letter-spacing: 1px; }
          .subtitle { font-size: 12px; text-align: center; color: #666; }
          .date-line { text-align: right; font-size: 13px; margin-bottom: 30px; color: #666; }
          .salutation { margin-bottom: 25px; font-size: 14px; }
          .body-text { font-size: 14px; margin-bottom: 20px; text-align: justify; line-height: 1.8; }
          .section-header { font-weight: bold; margin-top: 25px; margin-bottom: 12px; font-size: 14px; }
          .info-row { margin-bottom: 10px; display: flex; font-size: 14px; }
          .info-label { font-weight: bold; width: 150px; }
          .info-value { flex: 1; }
          .reason-box { border: 1px solid #333; padding: 15px; margin: 20px 0; font-size: 14px; }
          .closing-section { margin-top: 35px; font-size: 14px; }
          .signature-line { margin-top: 40px; }
          .footer-line { border-top: 2px solid #333; margin-top: 30px; padding-top: 15px; font-size: 12px; color: #666; text-align: center; }
        </style>
      </head>
      <body>
        <div class="document">
          <div class="header">
            <div class="title">EQUIPMENT RESERVATION DECISION</div>
            <div class="subtitle">Inventory Management System - Notification of Status</div>
          </div>
          
          <div class="date-line">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          
          <div class="salutation">Dear ${data.userName},</div>
          
          <div class="body-text">
            We regret to inform you that your equipment reservation request has been reviewed and, unfortunately, cannot be approved at this time. Below you will find the details pertaining to your request and the reason for this decision.
          </div>

          <div class="section-header">REQUEST DETAILS</div>
          <div class="info-row">
            <div class="info-label">Equipment Item:</div>
            <div class="info-value">${data.itemName}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Requested Period:</div>
            <div class="info-value">${data.startDate} to ${data.returnDate}</div>
          </div>

          ${data.rejectionReason ? `
          <div class="reason-box">
            <div style="font-weight: bold; margin-bottom: 10px;">REASON FOR REJECTION</div>
            <div>${data.rejectionReason}</div>
          </div>
          ` : ''}

          <div class="closing-section">
            <div class="body-text">
              We understand that this may be disappointing. Should you wish to proceed, we recommend considering alternative dates for the same equipment, or exploring other available equipment that may meet your requirements. Additionally, you may wish to contact the administrative office directly to discuss your options and explore potential solutions.
            </div>
            
            <div class="body-text">
              We appreciate your understanding and remain available to assist you with future reservation requests.
            </div>

            <div class="body-text">
              Yours sincerely,
            </div>
          </div>

          <div class="signature-line">
            <div style="height: 50px;"></div>
            <div>Inventory Management System</div>
            <div style="font-size: 13px; color: #666; margin-top: 8px;">Administrative Services</div>
          </div>

          <div class="footer-line">
            This is an automated communication from the Inventory Management System. Please do not reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `EQUIPMENT RESERVATION DECISION - ${data.itemName}`,
    html
  });
}
