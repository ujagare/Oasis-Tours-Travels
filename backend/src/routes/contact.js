const express = require("express");
const emailService = require("../utils/emailService");
const router = express.Router();

// Handle contact form submission
router.post("/submit", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    const contactData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject?.trim() || "General Inquiry",
      message: message.trim(),
      submittedAt: new Date(),
    };

    try {
      // Send notification email to sales team
      await emailService.sendContactNotification(contactData);

      console.log(
        "✅ Contact form submitted and notification sent:",
        contactData
      );

      res.json({
        success: true,
        message:
          "Thank you for your inquiry! We'll get back to you within 24 hours.",
        data: {
          name: contactData.name,
          email: contactData.email,
          submittedAt: contactData.submittedAt,
        },
      });
    } catch (emailError) {
      console.error("❌ Contact email notification failed:", emailError);

      // Still return success for form submission
      res.json({
        success: true,
        message:
          "Thank you for your inquiry! We'll get back to you within 24 hours.",
        data: {
          name: contactData.name,
          email: contactData.email,
          submittedAt: contactData.submittedAt,
        },
        note: "Email notification pending - will be processed manually",
      });
    }
  } catch (error) {
    console.error("Contact form submission error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form. Please try again.",
      error: error.message,
    });
  }
});

// Get contact form submissions (for admin)
router.get("/submissions", async (req, res) => {
  try {
    // TODO: Implement database retrieval
    res.json({
      success: true,
      message: "Contact submissions endpoint - database integration pending",
      submissions: [],
    });
  } catch (error) {
    console.error("Contact submissions retrieval error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve contact submissions",
      error: error.message,
    });
  }
});

// Test email service
router.get("/test-email", async (req, res) => {
  try {
    const testResult = await emailService.testEmailConnection();
    res.json(testResult);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Email service test failed",
      error: error.message,
    });
  }
});

module.exports = router;
