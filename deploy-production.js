#!/usr/bin/env node

// Oasis Tours & Travels - Production Deployment Helper
// This script helps validate and prepare for production deployment

const fs = require('fs');
const path = require('path');

console.log('🚀 Oasis Tours - Production Deployment Checker\n');

// Check if production environment file exists
const prodEnvPath = path.join(__dirname, 'backend', '.env.production');
const currentEnvPath = path.join(__dirname, 'backend', '.env');

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}: Found`);
    return true;
  } else {
    console.log(`❌ ${description}: Missing`);
    return false;
  }
}

function checkEnvVariable(content, varName, description) {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = content.match(regex);
  
  if (match && match[1] && !match[1].includes('YOUR_') && !match[1].includes('placeholder')) {
    console.log(`✅ ${description}: Configured`);
    return true;
  } else {
    console.log(`❌ ${description}: Not configured or using placeholder`);
    return false;
  }
}

// File checks
console.log('📁 File Checks:');
const hasProductionEnv = checkFile(prodEnvPath, 'Production environment file');
const hasCurrentEnv = checkFile(currentEnvPath, 'Current environment file');

console.log('\n🔧 Environment Configuration:');

if (hasCurrentEnv) {
  const envContent = fs.readFileSync(currentEnvPath, 'utf8');
  
  // Check critical environment variables
  const checks = [
    ['RAZORPAY_KEY_ID', 'Razorpay Key ID'],
    ['RAZORPAY_KEY_SECRET', 'Razorpay Key Secret'],
    ['RAZORPAY_WEBHOOK_SECRET', 'Razorpay Webhook Secret'],
    ['EMAIL_USER', 'Email User'],
    ['EMAIL_PASS', 'Email Password']
  ];
  
  let allConfigured = true;
  checks.forEach(([varName, description]) => {
    if (!checkEnvVariable(envContent, varName, description)) {
      allConfigured = false;
    }
  });
  
  // Check if using production values
  console.log('\n🔍 Production Readiness:');
  
  if (envContent.includes('NODE_ENV=production')) {
    console.log('✅ Environment: Production mode');
  } else {
    console.log('⚠️  Environment: Development mode (change to production)');
  }
  
  if (envContent.includes('rzp_live_')) {
    console.log('✅ Razorpay: Using live keys');
  } else if (envContent.includes('rzp_test_')) {
    console.log('❌ Razorpay: Still using test keys');
  }
  
  if (envContent.includes('https://')) {
    console.log('✅ URLs: Using HTTPS');
  } else {
    console.log('❌ URLs: Using HTTP (change to HTTPS for production)');
  }
  
  console.log('\n📋 Deployment Status:');
  
  if (allConfigured && envContent.includes('rzp_live_') && envContent.includes('NODE_ENV=production')) {
    console.log('🎉 READY FOR PRODUCTION DEPLOYMENT!');
    console.log('\nNext steps:');
    console.log('1. Enable HTTPS on your server');
    console.log('2. Test payment flow with real cards');
    console.log('3. Verify webhook delivery');
    console.log('4. Monitor logs after deployment');
  } else {
    console.log('⚠️  NOT READY FOR PRODUCTION');
    console.log('\nRequired actions:');
    if (!allConfigured) {
      console.log('- Configure all environment variables');
    }
    if (!envContent.includes('rzp_live_')) {
      console.log('- Replace test Razorpay keys with live keys');
    }
    if (!envContent.includes('NODE_ENV=production')) {
      console.log('- Set NODE_ENV=production');
    }
    console.log('\nSee PRODUCTION-SECURITY-CHECKLIST.md for detailed instructions');
  }
  
} else {
  console.log('❌ Cannot check configuration - environment file missing');
}

console.log('\n📚 Resources:');
console.log('- Security Checklist: PRODUCTION-SECURITY-CHECKLIST.md');
console.log('- Payment Analysis: PAYMENT-SECURITY-ANALYSIS.md');
console.log('- Razorpay Dashboard: https://dashboard.razorpay.com/');

console.log('\n🔒 Security Features Active:');
console.log('✅ Input validation and sanitization');
console.log('✅ Rate limiting on payment endpoints');
console.log('✅ HTTPS enforcement in production');
console.log('✅ Webhook signature verification');
console.log('✅ CORS protection');
console.log('✅ Security headers (Helmet.js)');