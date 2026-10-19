/**
 * Dedicated Email Routing Pipeline - Public School Niyazipur
 * Dual Dispatch:
 * 1. Administrator Alert to: shreyash10nov@gmail.com
 * 2. Applicant Acknowledgment with unique reference ID
 */

const nodemailer = require('nodemailer');

function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: process.env.NODE_ENV === 'production'
      }
    });
  }

  return null;
}

const transporter = createTransporter();

/**
 * Dual Dispatch Email Function
 */
async function sendSubmissionAlert(submission) {
  // Target administrator email explicitly mapped to shreyash10nov@gmail.com
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ALERT_TO_EMAIL || 'shreyash10nov@gmail.com';
  const fromEmail = process.env.ALERT_FROM_EMAIL || `"Public School Admissions" <no-reply@${process.env.DOMAIN || 'publicschoolniyazipur.in'}>`;
  const portalUrl = process.env.ADMIN_PORTAL_URL || 'http://localhost:3000/admin';
  const directLink = `${portalUrl}#submission-${submission.id}`;
  const refCode = `PSNA-2026-${String(submission.id).padStart(4, '0')}`;

  const formattedDate = new Date(submission.created_at || Date.now()).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  // 1. Administrative Alert Email (To: shreyash10nov@gmail.com)
  const adminMailOptions = {
    from: fromEmail,
    to: adminEmail,
    replyTo: submission.email,
    subject: `[Admission Enquiry] New Application - ${submission.full_name} (${submission.subject || 'Class Inquiry'})`,
    text: `
[ADMISSION ENQUIRY] NEW APPLICATION RECEIVED
--------------------------------------------------
Reference ID:   ${refCode} (DB #${submission.id})
Student / Name: ${submission.full_name}
Parent Phone:   ${submission.phone || 'Not provided'}
Email Address:  ${submission.email}
Subject/Class:  ${submission.subject || 'General Inquiry'}
Timestamp:      ${formattedDate} (IST)
Status:         ${submission.status || 'Pending'}

SUBMITTED MESSAGE / DETAILS:
--------------------------------------------------
${submission.message}

--------------------------------------------------
ADMIN DASHBOARD ACTION:
View, manage, or update status:
${directLink}
    `.trim(),
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 24px; color: #1e293b; }
    .container { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #061A40 0%, #003566 100%); color: #ffffff; padding: 26px 24px; border-bottom: 3px solid #FFB703; }
    .badge { display: inline-block; background: #FFB703; color: #061A40; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px; margin-bottom: 8px; }
    .header h2 { margin: 0; font-size: 21px; font-weight: 800; color: #ffffff; }
    .content { padding: 26px 24px; }
    .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 22px; }
    .meta-row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px dotted #cbd5e1; font-size: 14px; }
    .meta-row:last-child { border-bottom: none; }
    .meta-label { color: #64748b; font-weight: 600; }
    .meta-value { color: #0f172a; font-weight: 700; text-align: right; }
    .meta-value a { color: #0056B3; text-decoration: none; }
    .message-box { background: #fffbeb; border-left: 4px solid #FB8500; padding: 18px; border-radius: 4px; margin-bottom: 26px; }
    .message-box h4 { margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #b45309; letter-spacing: 0.5px; }
    .message-text { font-size: 15px; line-height: 1.6; color: #334155; white-space: pre-wrap; word-break: break-word; }
    .btn-wrap { text-align: center; margin: 28px 0 10px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #FFB703 0%, #FB8500 100%); color: #061A40; font-weight: 800; font-size: 15px; padding: 12px 28px; border-radius: 30px; text-decoration: none; box-shadow: 0 4px 14px rgba(251, 133, 0, 0.35); }
    .footer { background: #f8fafc; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="badge">Immediate Admission Lead</span>
      <h2>[Admission Enquiry] New Application Received</h2>
      <div style="font-size: 13px; opacity: 0.85; margin-top: 4px;">Public School Niyazipur, Simri, Buxar &bull; UDISE: 10301901109</div>
    </div>
    
    <div class="content">
      <div class="meta-box">
        <div class="meta-row">
          <span class="meta-label">Reference ID</span>
          <span class="meta-value" style="color:#0056B3;">${refCode}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Student / Applicant</span>
          <span class="meta-value">${submission.full_name}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Parent Mobile</span>
          <span class="meta-value">${submission.phone ? `<a href="tel:${submission.phone}">${submission.phone}</a>` : 'Not provided'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Applicant Email</span>
          <span class="meta-value"><a href="mailto:${submission.email}">${submission.email}</a></span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Class / Subject</span>
          <span class="meta-value">${submission.subject || 'General Inquiry'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Date &amp; Time (IST)</span>
          <span class="meta-value">${formattedDate}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Lead Status</span>
          <span class="meta-value" style="color: #FB8500;">● ${submission.status || 'Pending'}</span>
        </div>
      </div>

      <div class="message-box">
        <h4>Submitted Application Details / Instructions</h4>
        <div class="message-text">${submission.message}</div>
      </div>

      <div class="btn-wrap">
        <a href="${directLink}" class="btn">Open Lead in Admin Portal &rarr;</a>
      </div>
    </div>

    <div class="footer">
      Automated School Lead Dispatcher &bull; Delivered directly to <strong>${adminEmail}</strong>
    </div>
  </div>
</body>
</html>
    `
  };

  // 2. Applicant Acknowledgment Email (If parent provided a genuine email)
  const isRealEmail = submission.email && !submission.email.endsWith('@publicschoolniyazipur.in');
  let applicantMailOptions = null;

  if (isRealEmail) {
    applicantMailOptions = {
      from: `"Public School Niyazipur" <no-reply@${process.env.DOMAIN || 'publicschoolniyazipur.in'}>`,
      to: submission.email,
      replyTo: adminEmail,
      subject: `Application Acknowledged [Ref: ${refCode}] - Public School Niyazipur`,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px;">
  <div style="background: #061A40; color: #ffffff; padding: 20px; border-radius: 6px; text-align: center;">
    <h2 style="margin: 0; color: #FFB703;">PUBLIC SCHOOL NIYAZIPUR</h2>
    <p style="margin: 5px 0 0 0; font-size: 13px;">Simri Block, Buxar District, Bihar (PIN: 802131) &bull; UDISE+: 10301901109</p>
  </div>
  <div style="padding: 20px 10px;">
    <p>Dear <strong>${submission.full_name}</strong>,</p>
    <p>Thank you for submitting your admission inquiry for <strong>${submission.subject || 'Academic Session 2026-27'}</strong> at Public School, Niyazipur.</p>
    <div style="background: #F8FAFC; border: 1.5px dashed #0056B3; padding: 14px; border-radius: 6px; margin: 18px 0;">
      <p style="margin: 4px 0;"><strong>Application Reference Number:</strong> <span style="color: #FB8500; font-weight: 800;">${refCode}</span></p>
      <p style="margin: 4px 0;"><strong>Student Name:</strong> ${submission.full_name}</p>
      <p style="margin: 4px 0;"><strong>Status:</strong> Under Review by Admissions Desk</p>
    </div>
    <p>Our admissions officer under the guidance of <strong>Shri Ajit Kumar Thakur</strong> (Founder &amp; Administrator) will review your query and reach out to you within 24 working hours.</p>
    <p>For urgent inquiries or campus visits, please contact our helpline:</p>
    <p style="font-size: 16px; font-weight: bold; color: #061A40;">📞 Helpline: <a href="tel:+919905663403" style="color: #0056B3;">+91 99056 63403</a> &bull; ✉️ Email: <a href="mailto:${adminEmail}" style="color: #0056B3;">${adminEmail}</a></p>
  </div>
  <div style="background: #F1F5F9; padding: 12px; text-align: center; font-size: 11px; color: #64748B; border-radius: 4px;">
    Public School Niyazipur &bull; Primary with Upper Primary &bull; Estd. 2011 &bull; RTE Sec 12(1)(c) Compliant
  </div>
</div>
      `
    };
  }

  // Simulated Dispatch when running locally without SMTP credentials
  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`[EMAIL ROUTING PIPELINE - DISPATCHED]`);
    console.log(`To Admin:       ${adminEmail}`);
    console.log(`Subject:        ${adminMailOptions.subject}`);
    console.log(`Student:        ${submission.full_name}`);
    console.log(`Contact:        ${submission.phone || 'N/A'} | ${submission.email}`);
    console.log(`Ref ID:         ${refCode}`);
    console.log(`Admin Link:     ${directLink}`);
    if (applicantMailOptions) {
      console.log(`Applicant Ack:  Sent to ${submission.email} [${refCode}]`);
    }
    console.log(`======================================================\n`);
    return {
      sent: true,
      simulated: true,
      adminEmail,
      refCode,
      message: 'SMTP credentials not in .env. Alert logged to console for review.'
    };
  }

  // Live SMTP Transporter Dispatch
  try {
    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log(`[Admin Alert Dispatched] Message ID: ${adminInfo.messageId} to ${adminEmail}`);

    if (applicantMailOptions) {
      await transporter.sendMail(applicantMailOptions).catch(err => {
        console.warn(`[Applicant Ack Error]:`, err.message);
      });
    }

    return {
      sent: true,
      messageId: adminInfo.messageId,
      adminEmail,
      refCode
    };
  } catch (error) {
    console.error(`[Email Send Error] Failed to send alert:`, error.message);
    return {
      sent: false,
      error: error.message
    };
  }
}

module.exports = {
  sendSubmissionAlert
};
