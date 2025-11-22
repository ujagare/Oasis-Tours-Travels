// Oasis Travel & Tourism - Backend Server
// Main server file for handling API requests

const express = require("express");
const cors = require("cors");
const path = require("path");

// Load environment variables
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the parent directory (frontend)
app.use(express.static(path.join(__dirname, "../../")));

// API Routes
app.use("/api/packages", require("./routes/packages"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/test", require("./routes/test"));

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../index.html"));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Oasis Travel Server running on port ${PORT}`);
  console.log(`📱 Frontend: http://localhost:${PORT}`);
  console.log(`🔗 API: http://localhost:${PORT}/api`);
  console.log(
    `📧 Email Service: ${process.env.EMAIL_USER ? "Configured" : "Not configured"}`
  );
  console.log(
    `💳 Razorpay: ${process.env.RAZORPAY_KEY_ID ? "Configured" : "Not configured"}`
  );
});

module.exports = app;
