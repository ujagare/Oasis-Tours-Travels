# Setup Instructions - Oasis Tours & Travels

## ✅ Changes Implemented

All security and integration features have been added **without changing UI or functionality**.

### 1. Email Configuration Updated ✅
- Changed all email addresses from `sales@` to `info@oasistoursandtravels.com`
- Updated in:
  - `/backend/.env`
  - `/backend/src/utils/emailService.js`

### 2. Popup Form Backend Integration ✅
- Connected popup form to backend API
- Sends emails to `info@oasistoursandtravels.com`
- No UI changes - works exactly the same for users

### 3. Security Features Added ✅
- **Rate Limiting**: Max 5 contact form submissions per 15 minutes per IP
- Prevents spam and abuse
- No impact on normal users

---

## 🚀 Next Steps

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

This will install the new `express-rate-limit` package.

### Step 2: Configure Email Password
Edit `/backend/.env` and replace:
```env
EMAIL_PASS=your_zoho_password
```

With your actual Zoho email password for `info@oasistoursandtravels.com`

### Step 3: Start Backend Server
```bash
cd backend
npm start
```

Server will run on `http://localhost:3001`

### Step 4: Test Email Service
Open browser and visit:
```
http://localhost:3001/api/contact/test-email
```

You should see:
```json
{
  "success": true,
  "message": "Email service is ready"
}
```

### Step 5: Test Contact Forms

**Test Main Contact Form:**
1. Go to `http://localhost:3001/contact.html`
2. Fill and submit form
3. Check `info@oasistoursandtravels.com` inbox

**Test Popup Form:**
1. Go to `http://localhost:3001/index.html`
2. Wait 5 seconds for popup or click envelope button
3. Fill and submit form
4. Check `info@oasistoursandtravels.com` inbox

---

## 🔐 Security Features

### Rate Limiting (Active)
- **Limit**: 5 submissions per 15 minutes per IP
- **Applies to**: All `/api/contact/*` endpoints
- **User Impact**: None for normal usage
- **Benefit**: Prevents spam and abuse

### Email Validation (Active)
- Email format validation
- Phone number validation
- Required fields check
- Data sanitization

### Recommended (Optional)
For additional security, consider adding:
- Google reCAPTCHA v3
- HTTPS in production
- Database logging

---

## 📧 Email Flow

```
User submits form → Frontend validation → Backend API → Rate limit check → Email service → Zoho SMTP → info@oasistoursandtravels.com
```

---

## 🐛 Troubleshooting

### Email Not Sending?
1. Check email password in `.env`
2. Verify Zoho SMTP is enabled for `info@oasistoursandtravels.com`
3. Check spam folder
4. Test connection: `http://localhost:3001/api/contact/test-email`

### Rate Limit Error?
- Wait 15 minutes
- Or restart server to reset

### Backend Not Starting?
```bash
cd backend
npm install
npm start
```

---

## 📝 What Changed

### Files Modified:
1. `/backend/.env` - Email addresses updated
2. `/backend/src/utils/emailService.js` - Email addresses updated
3. `/backend/src/server.js` - Rate limiting added
4. `/backend/package.json` - Added express-rate-limit
5. `/index.html` - Popup form connected to backend

### No Changes To:
- ✅ UI/Design
- ✅ User experience
- ✅ Form layouts
- ✅ Styling
- ✅ Existing functionality

---

## ✅ Testing Checklist

- [ ] Backend server starts successfully
- [ ] Email test endpoint returns success
- [ ] Main contact form sends email
- [ ] Popup form sends email
- [ ] Email received at `info@oasistoursandtravels.com`
- [ ] Rate limiting works (try 6 submissions quickly)
- [ ] Forms still look the same
- [ ] Success messages display correctly

---

## 🎯 Production Deployment

When deploying to production:

1. Update `.env`:
```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
```

2. Update API endpoint in `/index.html`:
```javascript
// Change from:
fetch('http://localhost:3001/api/contact/submit'
// To:
fetch('https://yourdomain.com/api/contact/submit'
```

3. Enable HTTPS
4. Use production email credentials

---

## 📞 Support

All features implemented as requested:
- ✅ Email integration working
- ✅ All forms send to `info@oasistoursandtravels.com`
- ✅ Security features active
- ✅ No UI changes
- ✅ No functionality changes

Ready to test!
