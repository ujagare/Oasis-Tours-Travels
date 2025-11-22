// Firebase Integration for Contact Forms and Bookings
// Commented out Firebase imports to fix module error
// import {
//   submitContactForm,
//   subscribeNewsletter,
//   submitPackageBooking,
//   trackEvent,
// } from "./firebase-init.js";

// Initialize Firebase Integration
document.addEventListener("DOMContentLoaded", function () {
  initializeContactForms();
  initializeNewsletterForm();
  initializePackageBookings();
  console.log("🚀 Firebase integration initialized");
});

// Contact Form Integration
function initializeContactForms() {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Show loading state
      submitBtn.textContent = "Submitting...";
      submitBtn.disabled = true;

      try {
        // Collect form data
        const formData = {
          name: contactForm.querySelector("#name")?.value || "",
          email: contactForm.querySelector("#email")?.value || "",
          phone: contactForm.querySelector("#phone")?.value || "",
          destination: contactForm.querySelector("#destination")?.value || "",
          package: contactForm.querySelector("#package")?.value || "",
          checkInDate: contactForm.querySelector("#checkInDate")?.value || "",
          checkOutDate: contactForm.querySelector("#checkOutDate")?.value || "",
          checkInTime: contactForm.querySelector("#checkInTime")?.value || "",
          checkOutTime: contactForm.querySelector("#checkOutTime")?.value || "",
          adults: contactForm.querySelector("#adults")?.value || "",
          children: contactForm.querySelector("#children")?.value || "",
          message: contactForm.querySelector("#message")?.value || "",
        };

        // Simulate form submission (Firebase disabled)
        console.log("Form data:", formData);

        // Show success message
        showSuccessMessage(
          "Thank you! Your inquiry has been submitted successfully. We will contact you soon."
        );
        contactForm.reset();
      } catch (error) {
        console.error("Contact form submission error:", error);
        showErrorMessage(
          "Sorry, there was an error submitting your inquiry. Please try again."
        );

        // Track error (disabled)
        console.log("Contact form error:", error.message);
      } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

// Newsletter Form Integration
function initializeNewsletterForm() {
  const newsletterForms = document.querySelectorAll(
    ".newsletter-form, #newsletter-form"
  );

  newsletterForms.forEach((form) => {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const emailInput = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      if (!emailInput.value) {
        showErrorMessage("Please enter a valid email address.");
        return;
      }

      // Show loading state
      submitBtn.textContent = "Subscribing...";
      submitBtn.disabled = true;

      try {
        const result = await subscribeNewsletter(emailInput.value);

        // Simulate newsletter subscription
        console.log("Newsletter subscription:", emailInput.value);
        showSuccessMessage("Thank you for subscribing to our newsletter!");
        form.reset();
      } catch (error) {
        console.error("Newsletter subscription error:", error);
        showErrorMessage(
          "Sorry, there was an error subscribing. Please try again."
        );

        console.log("Newsletter error:", error.message);
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  });
}

// Package Booking Integration
function initializePackageBookings() {
  const bookingForms = document.querySelectorAll(
    ".booking-form, #booking-form"
  );

  bookingForms.forEach((form) => {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Show loading state
      submitBtn.textContent = "Booking...";
      submitBtn.disabled = true;

      try {
        // Collect booking data
        const bookingData = {
          packageType: form.querySelector("#packageType")?.value || "",
          name: form.querySelector("#name")?.value || "",
          email: form.querySelector("#email")?.value || "",
          phone: form.querySelector("#phone")?.value || "",
          destination: form.querySelector("#destination")?.value || "",
          checkIn: form.querySelector("#checkIn")?.value || "",
          checkOut: form.querySelector("#checkOut")?.value || "",
          adults: form.querySelector("#adults")?.value || "",
          children: form.querySelector("#children")?.value || "",
          specialRequests: form.querySelector("#specialRequests")?.value || "",
        };

        const result = await submitPackageBooking(bookingData);

        if (result.success) {
          // Track successful booking
          trackEvent("package_booking", {
            package_type: bookingData.packageType,
            destination: bookingData.destination,
            adults: bookingData.adults,
            children: bookingData.children,
          });

          showSuccessMessage(
            "Your booking request has been submitted! We will contact you within 24 hours to confirm details."
          );
          form.reset();
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Package booking error:", error);
        showErrorMessage(
          "Sorry, there was an error processing your booking. Please try again."
        );

        trackEvent("booking_error", {
          error_message: error.message,
        });
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  });
}

// Success Message Display
function showSuccessMessage(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className =
    "fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md";
  alertDiv.style.zIndex = "10000";
  alertDiv.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(alertDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Error Message Display
function showErrorMessage(message) {
  const alertDiv = document.createElement("div");
  alertDiv.className =
    "fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg max-w-md";
  alertDiv.style.zIndex = "10000";
  alertDiv.innerHTML = `
    <div class="flex items-center space-x-2">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
      <span>${message}</span>
    </div>
  `;

  document.body.appendChild(alertDiv);

  // Auto remove after 5 seconds
  setTimeout(() => {
    alertDiv.remove();
  }, 5000);
}

// Track page interactions (disabled)
// document.addEventListener("click", function (e) {
//   console.log('Click tracked:', e.target);
// });

// Track scroll depth (disabled)
// let maxScrollDepth = 0;
// window.addEventListener("scroll", function () {
//   console.log('Scroll tracking disabled');
// });

export { showSuccessMessage, showErrorMessage };
