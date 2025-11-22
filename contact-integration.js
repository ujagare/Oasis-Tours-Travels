// Oasis Travel - Contact Form Integration
// Handles contact form submissions with email notifications

class ContactFormHandler {
  constructor() {
    this.apiBaseUrl = "http://localhost:3000/api/contact";
    this.initializeContactForm();
  }

  // Initialize contact form
  initializeContactForm() {
    // Wait for DOM to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.setupContactForm()
      );
    } else {
      this.setupContactForm();
    }
  }

  // Setup contact form event listeners
  setupContactForm() {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) =>
        this.handleContactSubmission(e)
      );
    }
  }

  // Handle contact form submission
  async handleContactSubmission(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);

    // Get form values
    const contactData = {
      name: formData.get("name")?.trim(),
      email: formData.get("email")?.trim(),
      phone: formData.get("phone")?.trim(),
      subject: formData.get("subject")?.trim(),
      message: formData.get("message")?.trim(),
    };

    // Validate form
    const validation = this.validateContactForm(contactData);
    if (!validation.isValid) {
      this.showContactMessage(validation.message, "error");
      return;
    }

    try {
      // Show loading
      this.showContactLoading(true);

      // Submit to backend
      const response = await fetch(`${this.apiBaseUrl}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      const result = await response.json();

      if (result.success) {
        // Show success message
        this.showContactMessage(result.message, "success");

        // Reset form
        form.reset();

        // Show success modal
        this.showContactSuccessModal(contactData);
      } else {
        throw new Error(result.message || "Failed to submit contact form");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      this.showContactMessage(`Failed to submit: ${error.message}`, "error");
    } finally {
      this.showContactLoading(false);
    }
  }

  // Validate contact form
  validateContactForm(data) {
    if (!data.name || data.name.length < 2) {
      return {
        isValid: false,
        message: "Please enter a valid name (minimum 2 characters)",
      };
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      return { isValid: false, message: "Please enter a valid email address" };
    }

    if (!data.message || data.message.length < 10) {
      return {
        isValid: false,
        message: "Please enter a message (minimum 10 characters)",
      };
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      return { isValid: false, message: "Please enter a valid phone number" };
    }

    return { isValid: true };
  }

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone format
  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ""));
  }

  // Show contact loading
  showContactLoading(show, message = "Submitting your inquiry...") {
    let loader = document.getElementById("contact-loader");

    if (show) {
      if (!loader) {
        loader = document.createElement("div");
        loader.id = "contact-loader";
        loader.className =
          "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
        loader.innerHTML = `
          <div class="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#000042] mx-auto mb-4"></div>
            <p class="text-gray-700 font-medium">${message}</p>
          </div>
        `;
        document.body.appendChild(loader);
      }
      loader.style.display = "flex";
    } else {
      if (loader) {
        loader.style.display = "none";
      }
    }
  }

  // Show contact success modal
  showContactSuccessModal(contactData) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50";
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-check text-2xl text-green-600"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
        <p class="text-gray-600 mb-6">Thank you for contacting us, ${contactData.name}. We'll get back to you within 24 hours.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div class="text-sm text-gray-600 mb-2">Your inquiry details:</div>
          <div class="font-medium">Name: ${contactData.name}</div>
          <div class="font-medium">Email: ${contactData.email}</div>
          ${contactData.subject ? `<div class="font-medium">Subject: ${contactData.subject}</div>` : ""}
        </div>
        
        <div class="flex gap-4">
          <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                  class="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
            Close
          </button>
          <button onclick="window.location.href='index.html'" 
                  class="flex-1 bg-[#000042] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            Go Home
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Show contact message
  showContactMessage(message, type = "info") {
    const colors = {
      success: "bg-green-100 text-green-800 border-green-200",
      error: "bg-red-100 text-red-800 border-red-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      info: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const alert = document.createElement("div");
    alert.className = `fixed top-4 right-4 ${colors[type]} border rounded-lg p-4 max-w-sm z-50 shadow-lg`;
    alert.innerHTML = `
      <div class="flex items-center">
        <span class="flex-1">${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-lg">&times;</button>
      </div>
    `;
    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (alert.parentElement) {
        alert.remove();
      }
    }, 5000);
  }

  // Test email service
  async testEmailService() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/test-email`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Email service test error:", error);
      throw error;
    }
  }
}

// Initialize contact form handler
const contactFormHandler = new ContactFormHandler();

// Export for use in other files
window.ContactFormHandler = ContactFormHandler;
window.contactFormHandler = contactFormHandler;
