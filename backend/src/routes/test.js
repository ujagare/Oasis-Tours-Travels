// Test Routes - For development testing without real credentials
const express = require("express");
const router = express.Router();

// Test server status
router.get("/status", (req, res) => {
  res.json({
    success: true,
    message: "Backend server is running!",
    timestamp: new Date().toISOString(),
    services: {
      server: "✅ Running",
      api: "✅ Working",
      routes: "✅ Loaded",
    },
  });
});

// Test payment order creation (mock)
router.post("/payment-order", (req, res) => {
  try {
    const { amount, packageName, customerDetails } = req.body;

    // Validate required fields
    if (!amount || !packageName || !customerDetails) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Mock order creation
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      status: "created",
    };

    res.json({
      success: true,
      message: "Mock payment order created successfully",
      order: mockOrder,
      key_id: "rzp_test_mock_key",
      note: "This is a mock response for testing",
    });
  } catch (error) {
    console.error("Mock payment order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create mock payment order",
      error: error.message,
    });
  }
});

// Test contact form submission (mock)
router.post("/contact-form", (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields",
      });
    }

    // Mock contact submission
    const mockSubmission = {
      id: `contact_${Date.now()}`,
      name,
      email,
      phone: phone || null,
      subject: subject || "General Inquiry",
      message,
      submittedAt: new Date().toISOString(),
      status: "received",
    };

    console.log("📧 Mock contact form submission:", mockSubmission);

    res.json({
      success: true,
      message: "Contact form submitted successfully (mock)",
      data: mockSubmission,
      note: "This is a mock response - no actual email sent",
    });
  } catch (error) {
    console.error("Mock contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit contact form",
      error: error.message,
    });
  }
});

// Test email service (mock)
router.get("/email-service", (req, res) => {
  res.json({
    success: true,
    message: "Email service test (mock)",
    status: {
      smtp: "✅ Mock SMTP Ready",
      templates: "✅ Templates Loaded",
      configuration: "✅ Mock Configuration Valid",
    },
    note: "This is a mock response - configure real Gmail credentials for production",
  });
});

// Test database connection (mock)
router.get("/database", (req, res) => {
  res.json({
    success: true,
    message: "Database connection test (mock)",
    status: {
      connection: "✅ Mock Database Connected",
      collections: "✅ Collections Available",
      operations: "✅ CRUD Operations Ready",
    },
    note: "This is a mock response - configure real database for production",
  });
});

module.exports = router;
