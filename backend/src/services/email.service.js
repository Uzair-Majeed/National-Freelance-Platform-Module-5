const nodemailer = require('nodemailer');

/**
 * Creates a reusable transporter object using the default SMTP transport.
 * We are using Gmail as the service. Make sure to provide a valid Gmail address
 * and an App Password (not your regular account password) in the environment variables.
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Sends a workspace invitation email containing a link to accept the invite.
 *
 * @param {string} toEmail - The recipient's email address
 * @param {string} inviterName - The name (or ID) of the person inviting them
 * @param {string} workspaceName - The name of the workspace they are being invited to
 * @param {string} inviteLink - The full URL link for accepting the invitation
 * @returns {Promise<any>} - Resolves with the email delivery info, or rejects on error
 */
const sendWorkspaceInvitation = async (toEmail, inviterName, workspaceName, inviteLink) => {
  console.log(`\n--- [DEBUG: Email Service] Initiating Email Dispatch ---`);
  console.log(`[EmailService] Attempting to send invite to: ${toEmail}`);
  console.log(`[EmailService] Loaded GMAIL_USER: ${process.env.GMAIL_USER ? `'${process.env.GMAIL_USER}'` : 'UNDEFINED'}`);
  console.log(`[EmailService] Loaded GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? '******** (Loaded)' : 'UNDEFINED'}`);

  // Guard clause to handle missing credentials gracefully (e.g. in dev)
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error(`[EmailService] ❌ Missing Gmail credentials! Simulation mode active.`);
    console.warn(`[EmailService] Simulated link: ${inviteLink}`);
    return null;
  }

  const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-w-md; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #3b82f6;">You've been invited!</h2>
      <p>Hello,</p>
      <p><strong>User ${inviterName}</strong> has invited you to join the workspace <strong>${workspaceName}</strong> on our Collaboration Platform.</p>
      <p>By joining, you will have access to task boards, team management, and workspace activity.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${inviteLink}" style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Accept Invitation & Join
        </a>
      </div>
      <p style="font-size: 12px; color: #888;">If you did not expect this invitation, you can safely ignore this email.</p>
    </div>
  `;

  const mailOptions = {
    from: `"Collaboration Workspace" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: `Invitation to join ${workspaceName}`,
    html: htmlTemplate,
  };

  try {
    console.log(`[EmailService] Transporter configuration set, sending email...`);
    const info = await transporter.sendMail(mailOptions);
    console.log(`[EmailService] ✅ SUCCESS! Invitation sent to ${toEmail}`);
    console.log(`[EmailService] MessageID: ${info.messageId}\n------------------------------------------------------`);
    return info;
  } catch (error) {
    console.error(`[EmailService] ❌ ERROR sending email to ${toEmail}:`);
    console.error(error);
    console.log(`------------------------------------------------------\n`);
    throw error;
  }
};

module.exports = {
  sendWorkspaceInvitation,
};
