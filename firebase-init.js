// Complete Firebase Initialization for Oasis Travel & Tourism
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBvOkBwGyRLsruRQSCrI0Rj7FAoHfaFIpo",
  authDomain: "oasis-travel-tourism.firebaseapp.com",
  projectId: "oasis-travel-tourism",
  storageBucket: "oasis-travel-tourism.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456789012345",
  measurementId: "G-XXXXXXXXXX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// Initialize anonymous authentication
signInAnonymously(auth).catch((error) => {
  console.log("Anonymous auth failed:", error);
});

// Contact Form Submission
export async function submitContactForm(formData) {
  try {
    const docRef = await addDoc(collection(db, "contact-inquiries"), {
      ...formData,
      timestamp: serverTimestamp(),
      status: "new",
      source: "website",
    });

    console.log("Contact form submitted with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting contact form: ", error);
    return { success: false, error: error.message };
  }
}

// Newsletter Subscription
export async function subscribeNewsletter(email) {
  try {
    const docRef = await addDoc(collection(db, "newsletter-subscribers"), {
      email: email,
      timestamp: serverTimestamp(),
      status: "active",
      source: "website",
    });

    console.log("Newsletter subscription with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error subscribing to newsletter: ", error);
    return { success: false, error: error.message };
  }
}

// Package Booking
export async function submitPackageBooking(bookingData) {
  try {
    const docRef = await addDoc(collection(db, "package-bookings"), {
      ...bookingData,
      timestamp: serverTimestamp(),
      status: "pending",
      source: "website",
    });

    console.log("Package booking submitted with ID: ", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error submitting package booking: ", error);
    return { success: false, error: error.message };
  }
}

// Image Upload Function
export async function uploadImage(file, folder = "uploads") {
  try {
    if (!file) throw new Error("No file selected");

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Only JPEG, PNG, and WebP images are allowed");
    }

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}_${file.name}`;

    // Create storage reference and upload
    const storageRef = ref(storage, filename);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, url: downloadURL, filename };
  } catch (error) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}

// Analytics Event Tracking
export function trackEvent(eventName, parameters = {}) {
  try {
    if (analytics) {
      // Track custom events for business insights
      analytics.logEvent(eventName, {
        ...parameters,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Analytics tracking error:", error);
  }
}

// Initialize Firebase Services
export function initializeFirebaseServices() {
  console.log("🔥 Firebase initialized successfully!");
  console.log("📊 Analytics ready");
  console.log("🗄️ Firestore ready");
  console.log("🔐 Authentication ready");
  console.log("📁 Storage ready");

  // Track page view
  trackEvent("page_view", {
    page_title: document.title,
    page_location: window.location.href,
  });
}

// Export Firebase instances
export { app, analytics, db, auth, storage };

// Auto-initialize when module loads
initializeFirebaseServices();
