# 🔒 PRODUCTION SECURITY CHECKLIST
## Oasis Tours & Travels - Pre-Deployment Security Guide

**Status:** ⚠️ **MUST COMPLETE BEFORE GOING LIVE**

---

## 🚨 CRITICAL FIXES IMPLEMENTED

### ✅ 1. Removed Hardcoded Keys from Frontend
- **Fixed:** Payment integration now fetches keys from backend
- **Location:** `payment-integration.js`
- **Status:** ✅ SECURE

### ✅ 2. Enhanced Input Validation
- **Added:** Phone number validation (Indian format)
- **Added:** Name length validation (2-50 characters)
- **Added:** Email format validation
- **Added:** Amount validation (₹1,000 - ₹10,00,000)
- **Status:** ✅ SECURE

### ✅ 3. Improved Rate Limiting
- **Added:** Stricter rate limiting for order creation (5 per 5 minutes)
- **Added:** IP + User-Agent based rate limiting
- **Added:** Payment endpoint protection (10 per 15 minutes)
- **Status:** ✅ SECURE

### ✅ 4. Enhanced Webhook Security
- **Added:** Webhook secret validation
- **Added:** Better error logging
- **Added:** Signature verification improvements
- **Status:** ✅ SECURE

### ✅ 5. HTTPS Enforcement
- **Added:** Automatic HTTPS redirect in production
- **Location:** `backend/src/server.js`
- **Status:** ✅ READY

### ✅ 6. CORS Security
- **Added:** Production-specific CORS origins
- **Added:** Credential handling
- **Status:** ✅ CONFIGURED

---

## 🔧 MANUAL STEPS REQUIRED BEFORE DEPLOYMENT

### 1. Get Live Razorpay Keys 🚨 CRITICAL
```bash
# 1. Login to https://dashboard.razorpay.com/
# 2. Go to Settings > API Keys
# 3. Click "Generate Live Keys"
# 4. Copy the Key ID and Key Secret
# 5. Update .env.production file:

RAZORPAY_KEY_ID=rzp_live_YOUR_ACTUAL_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_ACTUAL_LIVE_SECRET
```

### 2. Configure Webhook Secret 🚨 CRITICAL
```bash
# 1. In Razorpay Dashboard, go to Settings > Webhooks
# 2. Create new webhook: https://yourdomain.com/api/payments/webhook
# 3. Select events: payment.captured, payment.failed
# 4. Copy the webhook secret
# 5. Update .env.production:

RAZORPAY_WEBHOOK_SECRET=YOUR_ACTUAL_WEBHOOK_SECRET
```

### 3. Update Production Environment
```bash
# Copy and configure production environment
cp backend/.env.production backend/.env

# Update these values in backend/.env:
NODE_ENV=production
RAZORPAY_KEY_ID=rzp_live_YOUR_LIVE_KEY
RAZORPAY_KEY_SECRET=YOUR_LIVE_SECRET
RAZORPAY_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET
EMAIL_USER=your-production-email@gmail.com
EMAIL_PASS=your-gmail-app-password
FRONTEND_URL=https://yourdomain.com
```

### 4. Enable HTTPS on Server 🚨 CRITICAL
```bash
# Option 1: Use Cloudflare (Recommended - FREE)
# 1. Add your domain to Cloudflare
# 2. Enable "Always Use HTTPS"
# 3. Set SSL/TLS to "Full (strict)"

# Option 2: Use Let's Encrypt (FREE)
sudo apt install certbot
sudo certbot --nginx -d yourdomain.com
```

### 5. Test Payment Flow
```bash
# 1. Use Razorpay test cards in staging
# 2. Test with real cards in production (small amounts)
# 3. Verify webhook delivery
# 4. Check email notifications
```

---

## 🛡️ SECURITY FEATURES ACTIVE

### ✅ Input Validation
- Amount validation (₹1,000 - ₹10,00,000)
- Email format validation
- Phone number validation (Indian format)
- Name length validation
- XSS protection with input sanitization

### ✅ Rate Limiting
- Payment endpoints: 10 attempts per 15 minutes
- Order creation: 5 attempts per 5 minutes
- Contact form: 5 attempts per 15 minutes
- IP + User-Agent based tracking

### ✅ Security Headers
- Helmet.js for security headers
- CORS protection
- MongoDB injection protection
- Request size limits (10MB)

### ✅ HTTPS Enforcement
- Automatic redirect to HTTPS in production
- Secure cookie settings
- HSTS headers

### ✅ Payment Security
- Server-side order creation
- Signature verification
- Webhook signature validation
- No sensitive data in frontend

---

## 📋 DEPLOYMENT CHECKLIST

### Before Deployment:
- [ ] Replace test Razorpay keys with live keys
- [ ] Configure webhook secret
- [ ] Update production email credentials
- [ ] Enable HTTPS on server
- [ ] Update CORS origins to your domain
- [ ] Test payment flow with real cards
- [ ] Verify webhook delivery
- [ ] Check email notifications work
- [ ] Monitor error logs

### After Deployment:
- [ ] Monitor payment success rates
- [ ] Set up payment failure alerts
- [ ] Regular security audits
- [ ] Monitor rate limiting effectiveness
- [ ] Check webhook delivery logs

---

## 🚨 CRITICAL WARNINGS

### ❌ DO NOT DEPLOY WITHOUT:
1. **Live Razorpay keys** - Test keys won't work in production
2. **HTTPS enabled** - Required for payment security
3. **Webhook secret** - Prevents fake payment notifications
4. **Production email** - For booking confirmations

### ❌ NEVER COMMIT TO GIT:
- Live Razorpay keys
- Email passwords
- Webhook secrets
- Production environment files

---

## 📞 SUPPORT CONTACTS

### Razorpay Support:
- Dashboard: https://dashboard.razorpay.com/
- Support: https://razorpay.com/support/
- Documentation: https://razorpay.com/docs/

### Security Issues:
- Monitor logs for suspicious activity
- Set up alerts for payment failures
- Regular security reviews

---

## 🔍 MONITORING SETUP

### Payment Monitoring:
```javascript
// Add to your monitoring dashboard
- Payment success rate
- Failed payment reasons
- Webhook delivery status
- Rate limiting triggers
- Security violations
```

### Log Monitoring:
```bash
# Monitor these log patterns
- "Invalid webhook signature"
- "Too many payment attempts"
- "Payment verification failed"
- "Invalid amount"
```

---

**⚠️ FINAL WARNING:** Test everything thoroughly in staging before production deployment!