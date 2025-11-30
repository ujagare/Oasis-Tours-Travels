const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const validator = require("validator");
const emailService = require("../utils/emailService");
const router = express.Router();

// Load environment variables
require("dotenv").config();

// Initialize Razorpay with validation
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ CRITICAL: Razorpay credentials not configured!');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Get Razorpay key (public endpoint)
router.get("/config", (req, res) => {
  // Additional security: only return key if properly configured
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(500).json({
      success: false,
      message: "Payment gateway not configured",
    });
  }
  
  res.json({
    success: true,
    key_id: process.env.RAZORPAY_KEY_ID,
  });
});

// Create payment order
router.post("/create-order", async (req, res) => {
  try {
    const { amount, currency = "INR", packageName, customerDetails } = req.body;

    // Validate required fields
    if (!amount || !packageName || !customerDetails) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Validate amount
    if (typeof amount !== 'number' || isNaN(amount) || amount < 1000 || amount > 1000000) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount. Must be between ₹1,000 and ₹10,00,000",
      });
    }

    // Sanitize and validate customer details
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      return res.status(400).json({
        success: false,
        message: "Customer details incomplete",
      });
    }

    // Validate email
    if (!validator.isEmail(customerDetails.email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email address",
      });
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = customerDetails.phone.replace(/[^\d]/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number. Please enter a valid 10-digit Indian mobile number",
      });
    }

    // Validate name length and characters
    if (customerDetails.name.length < 2 || customerDetails.name.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Name must be between 2 and 50 characters",
      });
    }

    // Sanitize inputs
    customerDetails.name = validator.escape(customerDetails.name.trim());
    customerDetails.email = validator.normalizeEmail(customerDetails.email);
    customerDetails.phone = cleanPhone; // Use cleaned phone number

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Amount in paise
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        package_name: packageName,
        customer_name: customerDetails.name,
        customer_email: customerDetails.email,
        customer_phone: customerDetails.phone,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
    });
  } catch (error) {
    console.error("Payment order creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment order",
      error: error.message,
    });
  }
});

// Verify payment
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      packageDetails,
    } = req.body;

    // Create signature for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET || "your_key_secret"
      )
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Payment is verified
      const bookingData = {
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        customerDetails,
        packageDetails,
        paymentDetails: {
          paymentId: razorpay_payment_id,
          amount: packageDetails.amount || "N/A",
        },
        status: "confirmed",
        createdAt: new Date(),
      };

      try {
        // Send confirmation emails
        await emailService.sendBookingConfirmation(bookingData);
        console.log("✅ Booking confirmed and emails sent:", bookingData);

        res.json({
          success: true,
          message: "Payment verified successfully and confirmation emails sent",
          booking: bookingData,
        });
      } catch (emailError) {
        console.error("❌ Email sending failed:", emailError);
        // Still return success for payment, but note email issue
        res.json({
          success: true,
          message: "Payment verified successfully (email notification pending)",
          booking: bookingData,
          emailError: "Email notification failed - will be sent manually",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
});

// Get payment status
router.get("/status/:paymentId", async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        created_at: payment.created_at,
      },
    });
  } catch (error) {
    console.error("Payment status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment status",
      error: error.message,
    });
  }
});

// Webhook handler for Razorpay events
router.post("/webhook", async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];
    
    // Validate webhook secret is configured
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      console.error("❌ Webhook secret not configured");
      return res.status(500).json({
        success: false,
        message: "Webhook not configured",
      });
    }

    // Get raw body for signature verification
    const body = JSON.stringify(req.body);

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      console.error("❌ Invalid webhook signature", {
        received: signature,
        expected: expectedSignature,
        timestamp: new Date().toISOString()
      });
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // Process webhook event
    const event = req.body.event;
    const payload = req.body.payload;

    console.log(`✅ Webhook received: ${event}`);

    // Handle different events
    switch (event) {
      case "payment.captured":
        console.log("Payment captured:", payload.payment.entity.id);
        break;
      case "payment.failed":
        console.log("Payment failed:", payload.payment.entity.id);
        break;
      default:
        console.log("Unhandled event:", event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({
      success: false,
      message: "Webhook processing failed",
    });
  }
});

// Refund payment
router.post("/refund", async (req, res) => {
  try {
    const { paymentId, amount, reason } = req.body;

    const refund = await razorpay.payments.refund(paymentId, {
      amount: amount * 100, // Amount in paise
      notes: {
        reason: reason || "Customer requested refund",
      },
    });

    res.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        created_at: refund.created_at,
      },
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({
      success: false,
      message: "Refund failed",
      error: error.message,
    });
  }
});

module.exports = router;
