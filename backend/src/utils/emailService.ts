import nodemailer from 'nodemailer';
import { config } from '@config';
import { logger } from '@utils/logger';

// 1. Ensure the interface is here (internal use)
interface EmailOptions {
  to: string | undefined;
  subject: string;
  html: string;
  replyTo?: string;
}

interface OrderItem {
  name: string;
  quantity: string;
  price: number;
}

const transporter = nodemailer.createTransport({
  host: config.email.smtpHost,
  port: Number(config.email.smtpPort),
  secure: config.email.smtpPort === 465,
  auth: {
    user: config.email.smtpUser,
    pass: config.email.smtpPassword,
  },
});

// 2. CRITICAL: Add 'export' here
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!options.to) {
    logger.error('Email send failed: No recipient provided.');
    return;
  }
  try {
    await transporter.sendMail({
      from: `"${config.email.fromName || 'Syd & Co'}" <${config.email.smtpUser}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Email send failed:', error);
  }
};


export const emailTemplates = {
  // Fixes: 'name' is now read
  subAdminRegistered: (name: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h1 style="color: #FF2D78;">Welcome to the Team, ${name}! 🚀</h1>
      <p style="font-size: 16px; color: #333;">
        Your admin account for <strong>Sydney Shopping</strong> has been created successfully. 
        You can now log in to the dashboard to manage products and orders.
      </p>
    </div>
  `,

  // Fixes: 'userName', 'orderId', 'total', and 'items' are all read
  orderConfirmed: (
    userName: string,
    orderId: string,
    total: number,
    items: OrderItem[]
  ) => {
    const itemsHtml = items
      .map((item) => {
        // 1. Calculate the total outside the string for better type safety

        const lineTotal = Number(item.price) * Number(item.quantity);

        return `

    <tr style="border-bottom: 1px solid #f0f0f0;">

      <td style="padding: 10px 0;">${item.name}</td>

      <td style="padding: 10px 0; text-align: center;">x${item.quantity}</td>

      <td style="padding: 10px 0; text-align: right;">$${lineTotal.toFixed(2)}</td>

    </tr>

  `;
      })
      .join('');

    return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background-color: #ffffff; color: #1a1a1a;">
      <h2 style="color: #FF2D78;">Thanks for your order, ${userName}! 💕</h2>
      <p>We've received your order <strong>#${orderId}</strong> and are getting it ready.</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="border-bottom: 2px solid #FF2D78;">
            <th style="text-align: left; padding-bottom: 10px;">Item</th>
            <th style="text-align: center; padding-bottom: 10px;">Qty</th>
            <th style="text-align: right; padding-bottom: 10px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      
      <div style="text-align: right; font-size: 18px; font-weight: bold;">
        Total Amount: <span style="color: #FF2D78;">$${total.toFixed(2)}</span>
      </div>
    </div>
    `;
  },

  // Fixes: 'name', 'email', 'subject', and 'message' are all read
  contactInquiry: (name: string, email: string, subject: string, message: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #fdfdfd; border: 1px solid #e1e1e1;">
      <h2 style="color: #FF2D78; border-bottom: 1px solid #eee; padding-bottom: 10px;">New Message: ${subject}</h2>
      <p><strong>From:</strong> ${name} (<a href="mailto:${email}">${email}</a>)</p>
      <div style="background: #fff; padding: 15px; border-radius: 8px; border-left: 4px solid #FF2D78; margin-top: 15px;">
        <p style="white-space: pre-wrap; margin: 0; line-height: 1.6;">${message}</p>
      </div>
    </div>
  `,
  subAdminApproved: (name: string, permissions: string[]) => `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A0A0F;color:#F0F0FF;border-radius:16px;">
      <h1 style="color:#00E5A0;margin-bottom:8px;">Access Approved! ✅</h1>
      <p style="color:#94a3b8;margin-bottom:24px;">Congratulations ${name}! Your admin access has been approved.</p>
      <div style="background:#1A1A28;border:1px solid rgba(0,229,160,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 12px;font-weight:700;">Your Permissions:</p>
        ${permissions.map((p) => `<span style="display:inline-block;margin:4px;padding:4px 12px;background:rgba(255,45,120,0.15);border-radius:20px;font-size:13px;color:#FF6EC7;">${p}</span>`).join('')}
      </div>
      <a href="${process.env.ADMIN_URL || 'http://localhost:5174'}/login"
         style="display:inline-block;margin-top:16px;padding:12px 24px;background:linear-gradient(135deg,#FF2D78,#BF00FF);color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">
        Login to Admin Panel
      </a>
    </div>
  `,

  subAdminRejected: (name: string, reason?: string) => `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A0A0F;color:#F0F0FF;border-radius:16px;">
      <h1 style="color:#FF4560;margin-bottom:8px;">Access Request Update</h1>
      <p style="color:#94a3b8;margin-bottom:24px;">Hi ${name}, your admin access request has been reviewed.</p>
      <div style="background:#1A1A28;border:1px solid rgba(255,69,96,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0;color:#FF4560;">Your request was not approved at this time.</p>
        ${reason ? `<p style="margin:12px 0 0;color:#94a3b8;font-size:14px;">Reason: ${reason}</p>` : ''}
      </div>
      <p style="color:#94a3b8;font-size:14px;">If you believe this is a mistake, please contact the super admin.</p>
    </div>
  `,

  adminNewOrder: (orderId: string, total: number, userName: string) => `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A0A0F;color:#F0F0FF;border-radius:16px;">
      <h1 style="color:#FF2D78;margin-bottom:8px;">New Order Received 🛍️</h1>
      <div style="background:#1A1A28;border:1px solid rgba(255,45,120,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p><strong>Order ID:</strong> #${orderId.slice(-8).toUpperCase()}</p>
        <p><strong>Customer:</strong> ${userName}</p>
        <p><strong>Total:</strong> $${total.toFixed(2)}</p>
      </div>
      <a href="${process.env.ADMIN_URL || 'http://localhost:5174'}/orders"
         style="display:inline-block;padding:12px 24px;background:linear-gradient(135deg,#FF2D78,#BF00FF);color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">
        View Order
      </a>
    </div>
  `,

  newsletterConfirm: (email: string) => `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;color:#333;border-radius:16px;text-align:center;">
      <h1 style="color:#E65BA8;margin-bottom:8px;">You're In! ✨</h1>
      <p style="color:#666;margin-bottom:24px;">Welcome to the Syd & Co family! You've successfully subscribed to our newsletter.</p>
      <div style="background:#FFF0F7;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#E65BA8;font-weight:700;">What to expect:</p>
        <p style="color:#666;font-size:14px;">✅ Exclusive deals & discounts<br/>✅ New arrivals first<br/>✅ Style tips & beauty hacks</p>
      </div>
      <p style="color:#999;font-size:12px;">You subscribed with: ${email}</p>
    </div>`,
};
// 4. CRITICAL: Add 'export' here
export const sendContactInquiry = async (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  await sendEmail({
    to: config.email.smtpUser,
    subject: `[Contact Form] ${data.subject}`,
    html: emailTemplates.contactInquiry(data.name, data.email, data.subject, data.message),
    replyTo: data.email,
  });
};
