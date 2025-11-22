// Oasis Travel - Payment Integration
// Razorpay payment gateway integration

class PaymentGateway {
  constructor() {
    this.razorpayKeyId = "rzp_test_9WdJmqcwy6BNZX"; // Working test key for development
    this.apiBaseUrl = "http://localhost:3001/api/payments";
    this.loadRazorpayScript();
  }

  // Load Razorpay script dynamically
  async loadRazorpayScript() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () =>
        reject(new Error("Failed to load Razorpay script"));
      document.head.appendChild(script);
    });
  }

  // Create payment order
  async createOrder(orderData) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to create order");
      }

      return result;
    } catch (error) {
      console.error("Order creation error:", error);
      throw error;
    }
  }

  // Process payment
  async processPayment(packageData, customerData, amount) {
    try {
      // Show loading
      this.showPaymentLoading(true);

      // Create order
      const orderData = {
        amount: amount,
        packageName: packageData.title,
        customerDetails: customerData,
      };

      const orderResponse = await this.createOrder(orderData);

      // Configure Razorpay options
      const options = {
        key: orderResponse.key_id,
        amount: orderResponse.order.amount,
        currency: orderResponse.order.currency,
        name: "Oasis Travel & Tourism",
        description: `Booking for ${packageData.title}`,
        image: "/Images/Oasis Logo.png",
        order_id: orderResponse.order.id,
        handler: async (response) => {
          await this.handlePaymentSuccess(response, customerData, packageData);
        },
        prefill: {
          name: customerData.name,
          email: customerData.email,
          contact: customerData.phone,
        },
        notes: {
          package: packageData.title,
          duration: packageData.duration,
        },
        theme: {
          color: "#000042",
        },
        modal: {
          ondismiss: () => {
            this.showPaymentLoading(false);
            this.showPaymentMessage("Payment cancelled by user", "warning");
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new Razorpay(options);
      rzp.open();

      // Hide loading
      this.showPaymentLoading(false);
    } catch (error) {
      this.showPaymentLoading(false);
      this.showPaymentMessage(`Payment failed: ${error.message}`, "error");
      console.error("Payment processing error:", error);
    }
  }

  // Handle successful payment
  async handlePaymentSuccess(paymentResponse, customerData, packageData) {
    try {
      this.showPaymentLoading(true, "Verifying payment...");

      // Verify payment on backend
      const verificationData = {
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        customerDetails: customerData,
        packageDetails: {
          ...packageData,
          amount: amount,
        },
      };

      const response = await fetch(`${this.apiBaseUrl}/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      });

      const result = await response.json();

      if (result.success) {
        this.showPaymentSuccess(
          result.booking,
          paymentResponse.razorpay_payment_id
        );
      } else {
        throw new Error(result.message || "Payment verification failed");
      }
    } catch (error) {
      this.showPaymentMessage(
        `Payment verification failed: ${error.message}`,
        "error"
      );
      console.error("Payment verification error:", error);
    } finally {
      this.showPaymentLoading(false);
    }
  }

  // Show payment loading
  showPaymentLoading(show, message = "Processing payment...") {
    let loader = document.getElementById("payment-loader");

    if (show) {
      if (!loader) {
        loader = document.createElement("div");
        loader.id = "payment-loader";
        loader.className =
          "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center";
        loader.style.zIndex = "10000";
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

  // Show payment success
  showPaymentSuccess(bookingData, paymentId) {
    const modal = document.createElement("div");
    modal.className =
      "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center";
    modal.style.zIndex = "10000";
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <i class="fas fa-check text-2xl text-green-600"></i>
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h3>
        <p class="text-gray-600 mb-6">Your booking has been confirmed. You will receive a confirmation email shortly.</p>
        
        <div class="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div class="text-sm text-gray-600 mb-2">Booking Details:</div>
          <div class="font-medium">Payment ID: ${paymentId}</div>
          <div class="font-medium">Package: ${bookingData.packageDetails?.title || "N/A"}</div>
          <div class="font-medium">Customer: ${bookingData.customerDetails?.name || "N/A"}</div>
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

  // Show payment message
  showPaymentMessage(message, type = "info") {
    const colors = {
      success: "bg-green-100 text-green-800 border-green-200",
      error: "bg-red-100 text-red-800 border-red-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      info: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const alert = document.createElement("div");
    alert.className = `fixed top-4 right-4 ${colors[type]} border rounded-lg p-4 max-w-sm shadow-lg`;
    alert.style.zIndex = "10000";
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

  // Get payment status
  async getPaymentStatus(paymentId) {
    try {
      const response = await fetch(`${this.apiBaseUrl}/status/${paymentId}`);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Payment status error:", error);
      throw error;
    }
  }
}

// Initialize payment gateway
const paymentGateway = new PaymentGateway();

// Export for use in other files
window.PaymentGateway = PaymentGateway;
window.paymentGateway = paymentGateway;
