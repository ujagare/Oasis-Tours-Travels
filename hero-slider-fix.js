// Comprehensive Hero Slider Fix
console.log("🔧 Hero Slider Fix Script Loading...");

// Check if Swiper is available
if (typeof Swiper === "undefined") {
  console.error(
    "❌ Swiper library not loaded! Make sure Swiper JS is included before this script."
  );
}

// Wait for DOM and all resources to be fully loaded
function waitForHeroElement() {
  const heroElement = document.querySelector(".heroSwiper");

  if (heroElement) {
    console.log("🚀 Hero element found, initializing slider...");
    initializeHeroSlider();
  } else {
    console.log("⏳ Waiting for hero element...");
    setTimeout(waitForHeroElement, 100);
  }
}

// Multiple initialization strategies
document.addEventListener("DOMContentLoaded", function () {
  console.log("🚀 DOM Content Loaded - Starting Hero Slider Fix...");

  // Try immediate initialization
  setTimeout(() => {
    waitForHeroElement();
  }, 100);
});

// Fallback for when DOM is already loaded
if (document.readyState === "loading") {
  // DOM is still loading
  document.addEventListener("DOMContentLoaded", waitForHeroElement);
} else {
  // DOM is already loaded
  console.log("🚀 DOM already loaded - Starting Hero Slider Fix...");
  setTimeout(waitForHeroElement, 100);
}

function initializeHeroSlider() {
  const heroElement = document.querySelector(".heroSwiper");

  if (!heroElement) {
    console.error("❌ Hero element not found! Checking DOM structure...");

    // Debug: Check if we're on the right page
    const bodyContent = document.body.innerHTML;
    if (bodyContent.includes("heroSwiper")) {
      console.log(
        "🔍 heroSwiper class found in DOM, but element not selected properly"
      );
    } else {
      console.log(
        "🔍 heroSwiper class not found in DOM - might be on wrong page"
      );
    }

    // Try alternative selectors
    const altHero1 = document.querySelector(".swiper.heroSwiper");
    const altHero2 = document.querySelector("#home .swiper");
    const altHero3 = document.querySelector("section#home .heroSwiper");

    console.log("Alternative selectors:", {
      ".swiper.heroSwiper": !!altHero1,
      "#home .swiper": !!altHero2,
      "section#home .heroSwiper": !!altHero3,
    });

    return;
  }

  console.log("✅ Hero element found");

  // Check slides
  const slides = heroElement.querySelectorAll(".swiper-slide");
  console.log(`📊 Found ${slides.length} slides`);

  if (slides.length === 0) {
    console.error("❌ No slides found!");
    return;
  }

  // Ensure all slides are visible
  slides.forEach((slide, index) => {
    slide.style.display = "block";
    slide.style.opacity = "1";
    slide.style.visibility = "visible";

    const video = slide.querySelector("video");
    if (video) {
      // Reset video properties
      video.muted = true;
      video.loop = true;
      video.preload = "metadata";

      // Add error handling
      video.addEventListener("error", (e) => {
        console.warn(`⚠️ Video ${index + 1} error:`, e);
        // Show fallback background
        slide.style.background =
          "linear-gradient(45deg, #1e3a8a, #7c3aed, #db2777)";
      });

      video.addEventListener("loadeddata", () => {
        console.log(`✅ Video ${index + 1} loaded`);
      });
    }
  });

  // Force Swiper reinitialization if it exists
  if (heroElement.swiper) {
    console.log("🔄 Destroying existing Swiper...");
    heroElement.swiper.destroy(true, true);
  }

  // Initialize new Swiper with robust configuration
  console.log("🎬 Initializing new Swiper...");

  const heroSwiper = new Swiper(".heroSwiper", {
    // Basic settings
    slidesPerView: 1,
    spaceBetween: 0,
    loop: true,

    // Autoplay settings
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMouseEnter: false,
    },

    // Navigation
    navigation: {
      nextEl: ".heroSwiper .swiper-button-next",
      prevEl: ".heroSwiper .swiper-button-prev",
    },

    // Pagination
    pagination: {
      el: ".heroSwiper .swiper-pagination",
      clickable: true,
      dynamicBullets: false,
    },

    // Effects
    effect: "slide",
    speed: 1000,

    // Touch settings
    allowTouchMove: true,
    touchRatio: 1,

    // Performance
    watchSlidesProgress: true,
    watchSlidesVisibility: true,

    // Callbacks
    on: {
      init: function () {
        console.log(`🎉 Swiper initialized with ${this.slides.length} slides`);
        console.log(`📍 Active slide: ${this.activeIndex}`);

        // Play first video
        setTimeout(() => {
          playCurrentVideo(this);
          animateCurrentSlideText(this);
        }, 200);
      },

      slideChange: function () {
        console.log(
          `🔄 Slide changed to: ${this.activeIndex} (real: ${this.realIndex})`
        );

        // Stop all videos
        stopAllVideos();

        // Play current video
        setTimeout(() => {
          playCurrentVideo(this);
          animateCurrentSlideText(this);
        }, 100);
      },

      slideChangeTransitionStart: function () {
        // Hide text during transition
        hideAllSlideText();
      },
    },
  });

  // Store swiper instance globally for debugging
  window.heroSwiperInstance = heroSwiper;

  console.log("✅ Hero Slider Fix Complete!");

  // Test navigation after 2 seconds
  setTimeout(() => {
    console.log("🧪 Testing slider navigation...");
    heroSwiper.slideNext();
  }, 2000);
}

function playCurrentVideo(swiperInstance) {
  const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
  const video = activeSlide?.querySelector("video");

  if (video) {
    video.currentTime = 0;
    video.play().catch((e) => {
      console.warn("⚠️ Video autoplay prevented:", e.message);
    });
    console.log("▶️ Playing video for current slide");
  }
}

function stopAllVideos() {
  const allVideos = document.querySelectorAll(".heroSwiper video");
  allVideos.forEach((video) => {
    video.pause();
    video.currentTime = 0;
  });
}

function hideAllSlideText() {
  if (typeof gsap !== "undefined") {
    gsap.set(".slide-title", { opacity: 0, x: 100 });
    gsap.set(".slide-subtitle, .slide-description, .slide-button", {
      opacity: 0,
      y: 50,
    });
  }
}

function animateCurrentSlideText(swiperInstance) {
  if (typeof gsap === "undefined") return;

  const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
  const title = activeSlide?.querySelector(".slide-title");
  const subtitle = activeSlide?.querySelector(".slide-subtitle");
  const description = activeSlide?.querySelector(".slide-description");
  const button = activeSlide?.querySelector(".slide-button");

  if (title) {
    gsap.fromTo(
      title,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1, ease: "power2.out", delay: 0.3 }
    );
  }

  if (subtitle) {
    gsap.fromTo(
      subtitle,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.6 }
    );
  }

  if (description) {
    gsap.fromTo(
      description,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.8 }
    );
  }

  if (button) {
    gsap.fromTo(
      button,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 1.0 }
    );
  }
}

// Debug function
window.debugHeroSlider = function () {
  console.log("=== HERO SLIDER DEBUG INFO ===");
  const swiper = window.heroSwiperInstance;
  if (swiper) {
    console.log("Active Index:", swiper.activeIndex);
    console.log("Real Index:", swiper.realIndex);
    console.log("Total Slides:", swiper.slides.length);
    console.log("Autoplay Running:", swiper.autoplay.running);
    console.log("Loop Enabled:", swiper.params.loop);
  } else {
    console.log("No swiper instance found");
  }
};
