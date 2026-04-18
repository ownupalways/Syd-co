import nodemailer from 'nodemailer';
import { config } from '@config';
import { logger } from '@utils/logger';

const transporter = nodemailer.createTransport({
  host: config.email.smtpHost,
  port: config.email.smtpPort,
  secure: false,
  auth: {
    user: config.email.smtpUser,
    pass: config.email.smtpPassword,
  },
});

interface EmailOptions {
  to: string | undefined; 
  subject: string;
  html: string;
  replyTo?: string;      
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!options.to) {
    logger.error('Email send failed: No recipient address provided.');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"${config.email.fromName}" <${config.email.smtpUser}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo, // Map the replyTo here
    });
    logger.info(`Email sent to ${options.to}`);
  } catch (error) {
    logger.error('Email send failed:', error);
  }
};

export const emailTemplates = {
  subAdminRegistered: (name: string) => `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A0A0F;color:#F0F0FF;border-radius:16px;">
      <h1 style="color:#FF2D78;margin-bottom:8px;">New Sub-Admin Request 🔔</h1>
      <p style="color:#94a3b8;margin-bottom:24px;">A new sub-admin has requested access to the Syd & Co admin panel.</p>
      <div style="background:#1A1A28;border:1px solid rgba(255,45,120,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 8px;"><strong>Name:</strong> ${name}</p>
      </div>
      <p style="color:#94a3b8;font-size:14px;">Please log in to the admin panel to review and approve or reject this request.</p>
      <a href="${process.env.ADMIN_URL || 'http://localhost:5174'}" 
         style="display:inline-block;margin-top:16px;padding:12px 24px;background:linear-gradient(135deg,#FF2D78,#BF00FF);color:#fff;border-radius:8px;text-decoration:none;font-weight:700;">
        Review Request
      </a>
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

  orderConfirmed: (userName: string, orderId: string, total: number, items: { name: string; quantity: number; price: number }[]) => `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#fff;color:#333;border-radius:16px;">
      <div style="text-align:center;margin-bottom:24px;">
        <h1 style="color:#E65BA8;margin-bottom:4px;">Order Confirmed! 🎉</h1>
        <p style="color:#666;">Thank you for shopping with Syd & Co</p>
      </div>
      <div style="background:#FFF0F7;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;color:#666;">Order ID</p>
        <p style="margin:0;font-weight:700;color:#E65BA8;">#${orderId.slice(-8).toUpperCase()}</p>
      </div>
      <h3 style="margin-bottom:12px;">Order Items</h3>
      ${items.map((item) => `
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0e0e8;">
          <span>${item.name} x${item.quantity}</span>
          <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      `).join('')}
      <div style="margin-top:16px;text-align:right;">
        <p style="font-size:18px;font-weight:800;color:#E65BA8;">Total: $${total.toFixed(2)}</p>
      </div>
      <p style="margin-top:24px;color:#666;font-size:14px;">We'll notify you when your order ships. Thank you, ${userName}!</p>
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
    </div>
  `,

    contactInquiry: (name: string, email: string, subject: string, message: string) => `

    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#0A0A0F;color:#F0F0FF;border-radius:16px;">

      <h1 style="color:#FF2D78;margin-bottom:8px;">New Contact Inquiry 📧</h1>

      <p style="color:#94a3b8;margin-bottom:24px;">You have received a new message from the Sydney Shopping contact form.</p>

      

      <div style="background:#1A1A28;border:1px solid rgba(255,45,120,0.2);border-radius:12px;padding:20px;margin-bottom:24px;">

        <p style="margin:0 0 8px;"><strong>From:</strong> ${name}</p>

        <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>

        <p style="margin:0 0 8px;"><strong>Subject:</strong> ${subject}</p>

        <hr style="border:0;border-top:1px solid rgba(255,45,120,0.1);margin:16px 0;" />

        <p style="margin:0;font-weight:700;color:#FF2D78;margin-bottom:8px;">Message:</p>

        <p style="margin:0;color:#94a3b8;line-height:1.6;white-space:pre-wrap;">${message}</p>

      </div>


      <p style="color:#94a3b8;font-size:14px;">You can reply directly to this email to contact the user.</p>

    </div>

  `,

};




export const sendContactInquiry = async (data: {

  name: string;

  email: string;

  subject: string;

  message: string;

}) => {

  await sendEmail({
    to: config.email.smtpUser, // Sending to yourself (the admin)
    subject: `[Contact Form] ${data.subject}`,
    html: emailTemplates.contactInquiry(data.name, data.email, data.subject, data.message),
    replyTo: data.email, // Set the user's email as the reply-to address

  });

};
