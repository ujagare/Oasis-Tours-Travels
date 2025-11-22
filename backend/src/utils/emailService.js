// Email Service for Oasis Travel & Tourism
// Handles all email notifications

const nodemailer = require("nodemailer");
require("dotenv").config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.zoho.com",
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === "true", // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false, // For development
      },
    });

    this.fromEmail = process.env.EMAIL_FROM || "sales@oasistourandtravels.com";
    this.salesEmail = "sales@oasistourandtravels.com";
  }

  // Send booking confirmation to customer
  async sendBookingConfirmation(bookingData) {
    try {
      const { customerDetails, packageDetails, paymentDetails } = bookingData;

      const customerEmailOptions = {
        from: this.fromEmail,
        to: customerDetails.email,
        subject: `🎉 Booking Confirmed - ${packageDetails.title} | Oasis Travel`,
        html: this.generateCustomerConfirmationEmail(bookingData),
      };

      const salesEmailOptions = {
        from: this.fromEmail,
        to: this.salesEmail,
        subject: `🔔 New Booking Alert - ${packageDetails.title}`,
        html: this.generateSalesNotificationEmail(bookingData),
      };

      // Send both emails
      const customerResult =
        await this.transporter.sendMail(customerEmailOptions);
      const salesResult = await this.transporter.sendMail(salesEmailOptions);

      console.log("✅ Booking confirmation emails sent successfully");
      return {
        success: true,
        customerEmailId: customerResult.messageId,
        salesEmailId: salesResult.messageId,
      };
    } catch (error) {
      console.error("❌ Email sending failed:", error);
      throw error;
    }
  }

  // Send contact form notification
  async sendContactNotification(contactData) {
    try {
      const emailOptions = {
        from: this.fromEmail,
        to: this.salesEmail,
        subject: `📧 New Contact Form Submission - ${contactData.name}`,
        html: this.generateContactNotificationEmail(contactData),
      };

      const result = await this.transporter.sendMail(emailOptions);
      console.log("✅ Contact notification email sent successfully");
      return {
        success: true,
        emailId: result.messageId,
      };
    } catch (error) {
      console.error("❌ Contact email sending failed:", error);
      throw error;
    }
  }

  // Generate customer confirmation email HTML
  generateCustomerConfirmationEmail(bookingData) {
    const { customerDetails, packageDetails, paymentDetails } = bookingData;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation - Oasis Travel</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #000042, #1e40af); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .booking-card { background: white; padding: 25px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-label { font-weight: bold; color: #64748b; }
        .detail-value { color: #1e293b; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 14px; }
        .btn { display: inline-block; background: #000042; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Booking Confirmed!</h1>
          <p>Thank you for choosing Oasis Travel & Tourism</p>
        </div>
        
        <div class="content">
          <div class="highlight">
            <h2>Dear ${customerDetails.name},</h2>
            <p>Your booking has been successfully confirmed! We're excited to help you create unforgettable memories.</p>
          </div>

          <div class="booking-card">
            <h3>📋 Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Package:</span>
              <span class="detail-value">${packageDetails.title}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${packageDetails.duration}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment ID:</span>
              <span class="detail-value">${paymentDetails.paymentId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount Paid:</span>
              <span class="detail-value">₹${paymentDetails.amount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Booking Date:</span>
              <span class="detail-value">${new Date().toLocaleDateString("en-IN")}</span>
            </div>
          </div>

          <div class="booking-card">
            <h3>👤 Customer Information</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${customerDetails.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${customerDetails.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${customerDetails.phone}</span>
            </div>
          </div>

          <div class="highlight">
            <h3>📞 What's Next?</h3>
            <p>Our travel consultant will contact you within 24 hours to discuss your itinerary and finalize all arrangements.</p>
            <p><strong>Contact us:</strong> sales@oasistourandtravels.com | +91-XXXXXXXXXX</p>
          </div>

          <div style="text-align: center;">
            <a href="mailto:sales@oasistourandtravels.com" class="btn">Contact Our Team</a>
          </div>
        </div>

        <div class="footer">
          <p>© 2024 Oasis Travel & Tourism. All rights reserved.</p>
          <p>Creating unforgettable travel experiences since inception.</p>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Generate sales notification email HTML
  generateSalesNotificationEmail(bookingData) {
    const { customerDetails, packageDetails, paymentDetails } = bookingData;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Booking Alert - Oasis Travel</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; }
        .alert-card { background: white; padding: 20px; border-radius: 10px; margin: 15px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); border-left: 4px solid #dc2626; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-label { font-weight: bold; color: #64748b; }
        .detail-value { color: #1e293b; }
        .urgent { background: #fef2f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Booking Alert!</h1>
          <p>Immediate action required</p>
        </div>
        
        <div class="content">
          <div class="urgent">
            <h2>🚨 New Customer Booking Received</h2>
            <p><strong>Time:</strong> ${new Date().toLocaleString("en-IN")}</p>
            <p><strong>Action Required:</strong> Contact customer within 24 hours</p>
          </div>

          <div class="alert-card">
            <h3>📦 Package Details</h3>
            <div class="detail-row">
              <span class="detail-label">Package:</span>
              <span class="detail-value">${packageDetails.title}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">${packageDetails.duration}</span>
            </div>
          </div>

          <div class="alert-card">
            <h3>👤 Customer Information</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${customerDetails.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${customerDetails.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${customerDetails.phone}</span>
            </div>
          </div>

          <div class="alert-card">
            <h3>💳 Payment Information</h3>
            <div class="detail-row">
              <span class="detail-label">Payment ID:</span>
              <span class="detail-value">${paymentDetails.paymentId}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Amount:</span>
              <span class="detail-value">₹${paymentDetails.amount}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Status:</span>
              <span class="detail-value">✅ Confirmed</span>
            </div>
          </div>

          <div class="urgent">
            <h3>📋 Next Steps:</h3>
            <ol>
              <li>Contact customer within 24 hours</li>
              <li>Discuss detailed itinerary</li>
              <li>Confirm travel dates</li>
              <li>Send detailed package information</li>
              <li>Arrange documentation requirements</li>
            </ol>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Generate contact notification email HTML
  generateContactNotificationEmail(contactData) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Form Submission - Oasis Travel</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8fafc; padding: 20px; border-radius: 0 0 10px 10px; }
        .contact-card { background: white; padding: 20px; border-radius: 10px; margin: 15px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
        .detail-label { font-weight: bold; color: #64748b; }
        .detail-value { color: #1e293b; }
        .message-box { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📧 New Contact Form Submission</h1>
          <p>Customer inquiry received</p>
        </div>
        
        <div class="content">
          <div class="contact-card">
            <h3>👤 Contact Information</h3>
            <div class="detail-row">
              <span class="detail-label">Name:</span>
              <span class="detail-value">${contactData.name}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Email:</span>
              <span class="detail-value">${contactData.email}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Phone:</span>
              <span class="detail-value">${contactData.phone || "Not provided"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Subject:</span>
              <span class="detail-value">${contactData.subject || "General Inquiry"}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Submitted:</span>
              <span class="detail-value">${new Date().toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div class="message-box">
            <h3>💬 Message:</h3>
            <p>${contactData.message}</p>
          </div>

          <div class="contact-card">
            <h3>📋 Action Required:</h3>
            <p>Please respond to this inquiry within 24 hours to maintain excellent customer service.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `;
  }

  // Test email configuration
  async testEmailConnection() {
    try {
      await this.transporter.verify();
      console.log("✅ Email service is ready");
      return { success: true, message: "Email service is ready" };
    } catch (error) {
      console.error("❌ Email service error:", error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();
