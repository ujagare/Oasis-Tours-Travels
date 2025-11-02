# 🔥 Firebase Setup Guide for Oasis Travel & Tourism

## 📋 Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name: `oasis-travel-tourism`
4. Enable Google Analytics (recommended)
5. Choose your Analytics account

### 2. Enable Required Services

#### Firestore Database

1. Go to "Firestore Database" in Firebase Console
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location

#### Authentication

1. Go to "Authentication" → "Sign-in method"
2. Enable "Anonymous" authentication
3. This allows form submissions without user accounts

#### Storage

1. Go to "Storage" in Firebase Console
2. Click "Get started"
3. Choose "Start in test mode"
4. Select your preferred location

#### Analytics

1. Already enabled during project creation
2. Will track user interactions automatically

### 3. Get Configuration Keys

1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Web app" icon (</>)
4. Register app name: `oasis-travel-website`
5. Copy the configuration object

### 4. Update Configuration

Replace the placeholder values in `firebase-init.js` with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-actual-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
  measurementId: "your-actual-measurement-id",
};
```

### 5. Firestore Collections Structure

The following collections will be automatically created:

#### `contact-inquiries`

```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  destination: "Dubai",
  package: "Luxury Package",
  checkInDate: "2024-03-15",
  checkOutDate: "2024-03-20",
  adults: "2",
  children: "1",
  message: "Looking for honeymoon package",
  timestamp: serverTimestamp(),
  status: "new",
  source: "website"
}
```

#### `newsletter-subscribers`

```javascript
{
  email: "subscriber@example.com",
  timestamp: serverTimestamp(),
  status: "active",
  source: "website"
}
```

#### `package-bookings`

```javascript
{
  packageType: "luxury",
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "+1234567890",
  destination: "Maldives",
  checkIn: "2024-04-01",
  checkOut: "2024-04-07",
  adults: "2",
  children: "0",
  specialRequests: "Ocean view room",
  timestamp: serverTimestamp(),
  status: "pending",
  source: "website"
}
```

### 6. Security Rules (Production)

#### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write for contact inquiries
    match /contact-inquiries/{document} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null &&
        request.auth.uid == resource.data.userId;
    }

    // Allow create for newsletter subscriptions
    match /newsletter-subscribers/{document} {
      allow create: if request.auth != null;
    }

    // Allow create for package bookings
    match /package-bookings/{document} {
      allow create: if request.auth != null;
    }
  }
}
```

#### Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read, write: if request.auth != null &&
        request.resource.size < 5 * 1024 * 1024 &&
        request.resource.contentType.matches('image/.*');
    }
  }
}
```

## 🚀 Features Enabled

### ✅ Contact Form Submission

- Automatic form data collection
- Real-time validation
- Success/error notifications
- Analytics tracking

### ✅ Newsletter Subscription

- Email collection
- Duplicate prevention
- Subscription tracking

### ✅ Package Booking

- Complete booking data capture
- Status tracking
- Customer communication

### ✅ Image Upload

- Compressed image upload
- File type validation
- Size limits (5MB max)
- Secure storage

### ✅ Analytics Tracking

- Page views
- Button clicks
- Form submissions
- Scroll depth
- User engagement

## 📊 Analytics Events

The following events are automatically tracked:

- `page_view` - When users visit pages
- `contact_form_submit` - Contact form submissions
- `newsletter_subscribe` - Newsletter subscriptions
- `package_booking` - Package bookings
- `button_click` - Button interactions
- `navigation_click` - Menu/link clicks
- `scroll_depth` - User engagement (25%, 50%, 75%, 100%)

## 🔧 Development vs Production

### Development Mode

- Firestore in test mode (open read/write)
- Storage in test mode
- Console logging enabled

### Production Mode

- Implement security rules
- Enable authentication requirements
- Add data validation
- Monitor usage and costs

## 📱 Integration Status

✅ Firebase initialized
✅ Contact forms integrated
✅ Newsletter forms integrated
✅ Package booking forms integrated
✅ Image upload functionality
✅ Analytics tracking
✅ Error handling
✅ Success notifications

## 🆘 Troubleshooting

### Common Issues:

1. **"Firebase not initialized"**

   - Check if firebase-init.js is loaded
   - Verify configuration keys

2. **"Permission denied"**

   - Check Firestore security rules
   - Ensure anonymous auth is enabled

3. **"Storage upload failed"**

   - Check file size (max 5MB)
   - Verify file type (images only)
   - Check storage rules

4. **Forms not submitting**
   - Check browser console for errors
   - Verify form IDs match integration code
   - Test internet connection

## 📞 Support

For Firebase-related issues:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- Check browser console for detailed error messages
