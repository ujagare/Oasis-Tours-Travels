const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("🔍 Testing Zoho SMTP Authentication...\n");
console.log("Configuration:");
console.log("- Host:", process.env.EMAIL_HOST);
console.log("- Port:", process.env.EMAIL_PORT);
console.log("- User:", process.env.EMAIL_USER);
console.log("- Pass:", process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.substring(0, 4)}****` : "NOT SET");
console.log("\n");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
  logger: true,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("\n❌ Authentication Failed:");
    console.error(error.message);
    console.log("\n📋 Troubleshooting Steps:");
    console.log("1. Verify app-specific password is correct (no spaces)");
    console.log("2. Check Zoho Settings → Security → Application-Specific Passwords");
    console.log("3. Ensure IMAP/POP is enabled in Zoho Mail Settings");
    console.log("4. Try generating a new app-specific password");
    console.log("5. Verify email address is correct: info@oasistoursandtravels.com");
  } else {
    console.log("\n✅ Authentication Successful!");
    console.log("SMTP connection is ready to send emails.");
  }
  process.exit(error ? 1 : 0);
});
