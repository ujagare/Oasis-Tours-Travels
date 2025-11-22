#!/usr/bin/env node

// Oasis Travel - Production Setup Script
// Automated setup for production deployment

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🚀 Oasis Travel & Tourism - Production Setup");
console.log("===========================================\n");

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupProduction() {
  try {
    console.log("📋 This script will help you configure production settings\n");

    // Collect Razorpay credentials
    console.log("💳 Razorpay Configuration:");
    const razorpayKeyId = await question(
      "Enter Razorpay Live Key ID (rzp_live_xxxxx): "
    );
    const razorpayKeySecret = await question(
      "Enter Razorpay Live Key Secret: "
    );
    const razorpayWebhookSecret = await question(
      "Enter Razorpay Webhook Secret (optional): "
    );

    // Collect Email credentials
    console.log("\n📧 Email Configuration:");
    const emailUser =
      (await question(
        "Enter Gmail address (sales@oasistourandtravels.com): "
      )) || "sales@oasistourandtravels.com";
    const emailPass = await question("Enter Gmail App Password: ");

    // Collect Server configuration
    console.log("\n🌐 Server Configuration:");
    const port = (await question("Enter server port (3000): ")) || "3000";
    const frontendUrl =
      (await question("Enter frontend URL (https://yourdomain.com): ")) ||
      "http://localhost:3000";

    // Create .env file
    const envContent = `# Oasis Travel & Tourism - Production Environment
# Generated on ${new Date().toISOString()}

# Server Configuration
NODE_ENV=production
PORT=${port}

# Razorpay Configuration (LIVE)
RAZORPAY_KEY_ID=${razorpayKeyId}
RAZORPAY_KEY_SECRET=${razorpayKeySecret}
RAZORPAY_WEBHOOK_SECRET=${razorpayWebhookSecret}

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=${emailUser}
EMAIL_PASS=${emailPass}
EMAIL_FROM=${emailUser}

# Frontend URL
FRONTEND_URL=${frontendUrl}

# Database Configuration (Optional)
# MONGODB_URI=mongodb://localhost:27017/oasis-travel
`;

    // Write .env file
    const envPath = path.join(__dirname, "backend", ".env");
    fs.writeFileSync(envPath, envContent);
    console.log(`\n✅ Created ${envPath}`);

    // Update frontend payment key
    const paymentIntegrationPath = path.join(
      __dirname,
      "payment-integration.js"
    );
    if (fs.existsSync(paymentIntegrationPath)) {
      let paymentContent = fs.readFileSync(paymentIntegrationPath, "utf8");
      paymentContent = paymentContent.replace(
        /this\.razorpayKeyId = ".*?";/,
        `this.razorpayKeyId = "${razorpayKeyId}";`
      );
      fs.writeFileSync(paymentIntegrationPath, paymentContent);
      console.log(`✅ Updated ${paymentIntegrationPath}`);
    }

    // Create production checklist
    const checklistContent = `# 🚀 Production Deployment Checklist

## ✅ Configuration Complete
- [x] Razorpay Live Keys: ${razorpayKeyId}
- [x] Email Configuration: ${emailUser}
- [x] Server Port: ${port}
- [x] Frontend URL: ${frontendUrl}

## 📋 Next Steps

### 1. Install Dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Test Configuration
\`\`\`bash
# Test email service
curl http://localhost:${port}/api/contact/test-email

# Test payment order creation
curl -X POST http://localhost:${port}/api/payments/create-order \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 5000,
    "packageName": "Test Package",
    "customerDetails": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9999999999"
    }
  }'
\`\`\`

### 3. Start Production Server
\`\`\`bash
cd backend
npm start
\`\`\`

### 4. Verify Functionality
- [ ] Open test-backend.html in browser
- [ ] Test all components
- [ ] Verify email notifications
- [ ] Test payment flow

### 5. Go Live
- [ ] Deploy to production server
- [ ] Configure SSL certificate
- [ ] Set up domain DNS
- [ ] Monitor logs for issues

## 🔧 Troubleshooting

### Email Issues:
1. Ensure 2FA is enabled on Gmail
2. Generate App Password (not regular password)
3. Check SMTP settings

### Payment Issues:
1. Verify Razorpay account is activated
2. Check KYC completion
3. Ensure live keys are correct

### Server Issues:
1. Check port availability
2. Verify environment variables
3. Check firewall settings

## 📞 Support
For technical support, contact the development team.

Generated on: ${new Date().toLocaleString()}
`;

    fs.writeFileSync("PRODUCTION-CHECKLIST.md", checklistContent);
    console.log("✅ Created PRODUCTION-CHECKLIST.md");

    console.log("\n🎉 Production setup complete!");
    console.log("\n📋 Next steps:");
    console.log("1. cd backend && npm install");
    console.log("2. npm start");
    console.log("3. Open test-backend.html to verify setup");
    console.log("4. Check PRODUCTION-CHECKLIST.md for detailed steps");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
  } finally {
    rl.close();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupProduction();
}

module.exports = { setupProduction };
