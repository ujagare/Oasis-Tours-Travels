// Optimized Performance Script for Oasis Travel
// Minimal dependencies, faster loading

// Initialize only essential features first
document.addEventListener("DOMContentLoaded", function () {
  // Essential Swiper initialization only
  initEssentialSwipers();

  // Lazy load images
  initImageLazyLoading();

  // Defer non-critical features
  setTimeout(() => {
    initDeferredFeatures();
  }, 1000);
});

// Essential Swiper initialization
function initEssentialSwipers() {
  // Hero Swiper only
  if (typeof Swiper !== "undefined") {
    const heroSwiperElement = document.querySelector(".heroSwiper");
    if (heroSwiperElement) {
      new Swiper(".heroSwiper", {
        slidesPerView: 1,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        speed: 800, // Faster transitions
        on: {
          slideChangeTransitionEnd: function () {
            // Simple video control
            const videos = document.querySelectorAll(".swiper-slide video");
            videos.forEach((video) => video.pause());

            const activeVideo =
              this.slides[this.activeIndex].querySelector("video");
            if (activeVideo) {
              activeVideo.currentTime = 0;
              activeVideo.play();
            }
          },
        },
      });
    }
  }
}

// Optimized image lazy loading
function initImageLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px 0px",
    }
  );

  images.forEach((img) => imageObserver.observe(img));
}

// Deferred features to load after initial page load
function initDeferredFeatures() {
  // Initialize other swipers
  initOtherSwipers();

  // Initialize form handling
  initFormHandling();

  // Initialize contact features
  initContactFeatures();
}

function initOtherSwipers() {
  if (typeof Swiper !== "undefined") {
    // Destinations Swiper
    const destinationsElement = document.querySelector(".mySwiper");
    if (destinationsElement) {
      new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    }

    // Testimonials Swiper
    const testimonialsElement = document.querySelector(".testimonialsSwiper");
    if (testimonialsElement) {
      new Swiper(".testimonialsSwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        },
      });
    }
  }
}

// Simplified form handling
function initFormHandling() {
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    travel_date: formData.get("travel_date"),
    message: formData.get("message"),
  };

  // Simple validation
  if (!data.name || !data.email || !data.message) {
    alert("Please fill in all required fields");
    return;
  }

  // Show loading
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    // Simulate form submission (replace with actual endpoint)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Message sent successfully! We will contact you soon.");
    event.target.reset();
  } catch (error) {
    alert("Failed to send message. Please try again.");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
}

// Contact features
function initContactFeatures() {
  // Simple date picker
  const dateInputs = document.querySelectorAll(
    'input[type="text"][id*="date"]'
  );
  dateInputs.forEach((input) => {
    input.type = "date";
    input.min = new Date().toISOString().split("T")[0];
  });
}

// Utility functions
const utils = {
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
};

// Export for global use
window.oasisUtils = utils;
