import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can change this based on your email provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

// Email template for registration success
export const sendWelcomeEmail = async (to: string, gymName: string, ownerName: string) => {
  try {
    await transporter.sendMail({
      from: `"GymSync" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Welcome to GymSync! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #3b82f6; margin-bottom: 24px;">Welcome to GymSync!</h1>
          
          <p>Dear ${ownerName},</p>
          
          <p>Thank you for registering ${gymName} with GymSync! We're excited to have you on board.</p>
          
          <p>Your account has been successfully created and is now ready to use. You can access your dashboard to:</p>
          
          <ul style="list-style-type: none; padding-left: 0;">
            <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
              ✓ <span style="margin-left: 8px;">Manage your gym operations</span>
            </li>
            <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
              ✓ <span style="margin-left: 8px;">Track member activities</span>
            </li>
            <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
              ✓ <span style="margin-left: 8px;">Monitor equipment and facilities</span>
            </li>
            <li style="margin-bottom: 8px; padding-left: 24px; position: relative;">
              ✓ <span style="margin-left: 8px;">Access detailed analytics</span>
            </li>
          </ul>

          <div style="margin: 32px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Login to Your Dashboard
            </a>
          </div>

          <p>If you have any questions or need assistance, our support team is here to help!</p>
          
          <p style="margin-top: 24px;">Best regards,<br>The GymSync Team</p>
          
          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>This email was sent to ${to}. If you did not register for GymSync, please ignore this email.</p>
          </div>
        </div>
      `
    });
    
    console.log('Welcome email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};

// Email notification for account status changes
export const sendStatusChangeEmail = async (to: string, gymName: string, ownerName: string, newStatus: 'active' | 'inactive' | 'pending') => {
  try {
    // Define status-specific content
    const statusContent = {
      active: {
        subject: 'Your GymSync Account Has Been Activated',
        heading: 'Account Activated Successfully!',
        message: 'Your gym account has been approved and is now active. You can now log in and access all features of the GymSync platform.',
        color: '#3b82f6', // blue
        icon: '✓',
        loginCta: true
      },
      inactive: {
        subject: 'Your GymSync Account Has Been Deactivated',
        heading: 'Account Deactivated',
        message: 'Your gym account has been deactivated. During this time, you will not be able to log in or access the GymSync platform. If you believe this is an error, please contact our support team.',
        color: '#ef4444', // red
        icon: '⨯',
        loginCta: false
      },
      pending: {
        subject: 'Your GymSync Account Status Changed to Pending',
        heading: 'Account Status: Pending Review',
        message: 'Your gym account has been set to pending status. During this time, you will not be able to log in or access the GymSync platform. Our team will review your account and you will be notified once the review process is complete.',
        color: '#f59e0b', // amber
        icon: '⚠',
        loginCta: false
      }
    };

    const content = statusContent[newStatus];

    await transporter.sendMail({
      from: `"GymSync" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: content.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: ${content.color}; margin-bottom: 24px;">${content.heading}</h1>
          
          <p>Dear ${ownerName},</p>
          
          <p>This is to inform you that the status of your gym "${gymName}" has been changed to <strong>${newStatus}</strong>.</p>
          
          <div style="background-color: ${content.color}15; border-left: 4px solid ${content.color}; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-weight: medium;">${content.icon} ${content.message}</p>
          </div>

          ${content.loginCta ? `
          <div style="margin: 32px 0; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
               style="background-color: ${content.color}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Login to Your Dashboard
            </a>
          </div>
          ` : ''}

          <p>If you have any questions about this change or need assistance, please contact our support team.</p>
          
          <p style="margin-top: 24px;">Best regards,<br>The GymSync Team</p>
          
          <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>This email was sent to ${to}. If you believe this email was sent in error, please contact support.</p>
          </div>
        </div>
      `
    });
    
    console.log(`Status change email (${newStatus}) sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error('Error sending status change email:', error);
    return false;
  }
};
