const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const emailService = require("../utils/emailService");
const router = express.Router();

// Load environment variables
require("dotenv").config();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_9WdJmqcwy6BNZX",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "test_key_secret_placeholder",
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
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_9WdJmqcwy6BNZX",
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
