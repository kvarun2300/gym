const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send an email
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.html
 * @param {Array} [options.attachments]
 */
const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Xtreme Fitness" <no-reply@xtremefitness.com>',
      to,
      subject,
      html,
      attachments,
    });
    return true;
  } catch (error) {
    console.error('Email send failed:', error.message);
    // Do not throw - email failure should not break core business flows
    return false;
  }
};

const emailTemplates = {
  welcome: (name) => `
    <div style="font-family: Poppins, Arial, sans-serif; background:#0B0B0B; color:#FFFFFF; padding:32px;">
      <h1 style="color:#E63946;">Welcome to Xtreme Fitness, ${name}!</h1>
      <p>Your account has been created successfully. Get ready to crush your fitness goals with us in Raichur, Karnataka.</p>
    </div>`,
  passwordReset: (name, resetUrl) => `
    <div style="font-family: Poppins, Arial, sans-serif; background:#0B0B0B; color:#FFFFFF; padding:32px;">
      <h1 style="color:#E63946;">Password Reset Request</h1>
      <p>Hi ${name}, click the button below to reset your password. This link expires in 30 minutes.</p>
      <a href="${resetUrl}" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#B3001B;color:#fff;text-decoration:none;border-radius:8px;">Reset Password</a>
    </div>`,
  membershipExpiry: (name, planName, expiryDate) => `
    <div style="font-family: Poppins, Arial, sans-serif; background:#0B0B0B; color:#FFFFFF; padding:32px;">
      <h1 style="color:#F59E0B;">Membership Expiring Soon</h1>
      <p>Hi ${name}, your <strong>${planName}</strong> plan expires on <strong>${expiryDate}</strong>. Renew now to avoid interruption.</p>
    </div>`,
  invoice: (name, invoiceNumber, amount) => `
    <div style="font-family: Poppins, Arial, sans-serif; background:#0B0B0B; color:#FFFFFF; padding:32px;">
      <h1 style="color:#22C55E;">Payment Received</h1>
      <p>Hi ${name}, we've received your payment of ₹${amount}. Invoice #${invoiceNumber} is attached.</p>
    </div>`,
};

module.exports = { sendEmail, emailTemplates };
