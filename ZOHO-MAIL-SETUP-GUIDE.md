# 📧 Zoho Mail Setup Guide for Oasis Travel

## 🎯 **Zoho Mail Configuration for sales@oasistourandtravels.com**

### **1. Zoho Mail SMTP Settings**

```
📧 Email Address: sales@oasistourandtravels.com
🌐 SMTP Server: smtp.zoho.com
🔌 Port: 587 (TLS) or 465 (SSL)
🔐 Security: STARTTLS (for port 587)
👤 Username: sales@oasistourandtravels.com
🔑 Password: Your Zoho account password
```

---

## 🔐 **Zoho Mail Security Setup**

### **Option 1: Regular Password (Simple)**

```
✅ Use your normal Zoho login password
✅ Enable "Less Secure Apps" if needed
✅ Quick setup, less secure
```

### **Option 2: App Password (Recommended)**

```
✅ Generate dedicated app password
✅ More secure than regular password
✅ Can be revoked independently
```

---

## 🛠️ **Step-by-Step Setup**

### **Step 1: Zoho Account Access**

1. **Login to Zoho Mail**: mail.zoho.com
2. **Go to Settings**: Click gear icon → Settings
3. **Navigate to Security**: Security & Privacy section

### **Step 2: Enable App Password (Recommended)**

1. **Two-Factor Authentication**: Enable if not already
2. **App Passwords**: Generate new app password
3. **Application Name**: "Oasis Travel Website"
4. **Copy Password**: Save the generated password

### **Step 3: SMTP Configuration**

```bash
# Your Zoho Mail Settings
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=sales@oasistourandtravels.com
EMAIL_PASS=your_zoho_password_or_app_password
EMAIL_FROM=sales@oasistourandtravels.com
```

---

## 🔧 **Backend Configuration (Already Done)**

### **Email Service Updated:**

```javascript
// backend/src/utils/emailService.js
this.transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // For development
  },
});
```

### **Environment Variables:**

```bash
# backend/.env
EMAIL_HOST=smtp.zoho.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=sales@oasistourandtravels.com
EMAIL_PASS=your_zoho_password
EMAIL_FROM=sales@oasistourandtravels.com
```

---

## 🧪 **Testing Zoho Mail**

### **Test Commands:**

```bash
# Test email service
curl http://localhost:3000/api/contact/test-email

# Test contact form
curl -X POST http://localhost:3000/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message from Zoho Mail"
  }'
```

### **Test via Browser:**

1. Open `test-backend-working.html`
2. Click "Test Real Email Service"
3. Check for success/error messages

---

## 🔒 **Zoho Mail Security Options**

### **Method 1: Regular Password**

```
👤 Username: sales@oasistourandtravels.com
🔑 Password: Your normal Zoho login password
⚠️ Security: Medium (shared password)
```

### **Method 2: App Password (Recommended)**

```
👤 Username: sales@oasistourandtravels.com
🔑 App Password: Generated 16-character password
✅ Security: High (dedicated password)
```

### **Method 3: OAuth2 (Advanced)**

```
🔐 OAuth2: Most secure option
🛠️ Setup: Complex configuration
✅ Security: Highest
```

---

## 📋 **What I Need From You**

### **For Zoho Mail Setup:**

```
📧 Email: sales@oasistourandtravels.com (confirmed)
🔑 Password: Your Zoho account password
   OR
🔐 App Password: Generated from Zoho settings
```

### **How to Get App Password:**

1. **Login**: mail.zoho.com
2. **Settings**: Gear icon → Settings
3. **Security**: Security & Privacy
4. **Two-Factor**: Enable if not active
5. **App Passwords**: Generate new
6. **Name**: "Oasis Travel Website"
7. **Copy**: 16-character password

---

## 🚀 **Production Setup Process**

### **You Provide:**

```
1. Zoho Email: sales@oasistourandtravels.com ✅
2. Zoho Password: xxxxxxxxxx
   OR App Password: xxxx-xxxx-xxxx-xxxx
3. Razorpay Live Keys: rzp_live_xxxxx
```

### **I Will Configure:**

```
✅ Update .env file with Zoho credentials
✅ Test email service connection
✅ Verify email sending functionality
✅ Test booking confirmation emails
✅ Test contact form notifications
✅ Complete production setup
```

---

## 🔍 **Troubleshooting Zoho Mail**

### **Common Issues:**

#### **Authentication Failed:**

```
❌ Error: Invalid login credentials
✅ Solution: Check username/password
✅ Alternative: Use app password instead
```

#### **Connection Timeout:**

```
❌ Error: Connection timeout
✅ Solution: Check SMTP settings
✅ Alternative: Try port 465 with SSL
```

#### **TLS/SSL Issues:**

```
❌ Error: TLS/SSL connection failed
✅ Solution: Set secure: false for port 587
✅ Alternative: Use port 465 with secure: true
```

---

## 📊 **Zoho Mail vs Gmail Comparison**

| Feature           | Zoho Mail       | Gmail             |
| ----------------- | --------------- | ----------------- |
| **SMTP Server**   | smtp.zoho.com   | smtp.gmail.com    |
| **Port**          | 587/465         | 587/465           |
| **Security**      | App Password    | App Password      |
| **Setup**         | Direct password | Requires 2FA      |
| **Business**      | Professional    | Personal/Business |
| **Custom Domain** | ✅ Included     | ✅ G Suite only   |

---

## 🎯 **Next Steps**

### **Immediate (You):**

```
1. Login to Zoho Mail
2. Generate app password (recommended)
3. Share credentials with me
4. I'll configure everything
```

### **After Setup (Me):**

```
1. Configure Zoho SMTP
2. Test email functionality
3. Verify booking emails
4. Test contact notifications
5. Confirm production ready
```

---

## 📞 **Zoho Support**

### **If You Need Help:**

```
🌐 Zoho Help: help.zoho.com/portal/en/home
📧 Support: support@zohocorp.com
📚 SMTP Guide: help.zoho.com/portal/en/kb/mail/user-guide/email-clients
```

---

## ✅ **Ready for Production**

**Once you provide Zoho credentials:**

- ✅ **5 minutes** complete email setup
- ✅ **Professional emails** from sales@oasistourandtravels.com
- ✅ **Automatic notifications** for bookings
- ✅ **Contact form** emails to sales team
- ✅ **Production ready** email system

**Bas aap Zoho password/app password share kariye - main turant setup kar dunga! 🚀**
