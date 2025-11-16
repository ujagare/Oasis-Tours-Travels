// Initialize after DOM loads
document.addEventListener("DOMContentLoaded", function () {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // Initialize NProgress
  if (typeof NProgress !== "undefined") {
    NProgress.configure({
      showSpinner: false,
      speed: 500,
      minimum: 0.1,
      easing: "ease",
      positionUsing: "",
      barSelector: '[role="bar"]',
      parent: "body",
    });

    // NProgress for page navigation
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (link && link.href && !link.href.startsWith("#")) {
        NProgress.start();
      }
    });

    // NProgress for form submissions
    document.addEventListener("submit", () => {
      NProgress.start();
    });
  }

  // Enhanced Intersection Observer for Lazy Loading
  const lazyImages = document.querySelectorAll(".lazy-image");
  const animateElements = document.querySelectorAll(".animate-on-scroll");

  // Image lazy loading observer
  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove("lazy-image");
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        }
      });
    },
    {
      rootMargin: "50px 0px",
      threshold: 0.1,
    }
  );

  // Animation observer for scroll animations
  const animationObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-visible");
        }
      });
    },
    {
      rootMargin: "0px 0px -100px 0px",
      threshold: 0.1,
    }
  );

  // Observe images and animations
  lazyImages.forEach((img) => imageObserver.observe(img));
  animateElements.forEach((el) => animationObserver.observe(el));

  // Initialize Swiper (only if available)
  if (typeof Swiper !== "undefined") {
    // Hero Swiper - Disabled (using separate fix script)
    // const heroSwiperElement = document.querySelector(".heroSwiper");
    if (false) {
      // First ensure all videos are loaded
      const allVideos = document.querySelectorAll(".heroSwiper video");
      console.log(`Found ${allVideos.length} videos in hero slider`);

      // Add error handling for videos
      allVideos.forEach((video, index) => {
        video.addEventListener("loadeddata", () => {
          console.log(`Video ${index + 1} loaded successfully`);
        });
        video.addEventListener("error", (e) => {
          console.error(`Video ${index + 1} failed to load:`, e);
        });
      });

      const heroSwiper = new Swiper(".heroSwiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        effect: "slide",
        speed: 1000,
        allowTouchMove: true,
        touchRatio: 1,
        resistance: true,
        resistanceRatio: 0.85,
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        preloadImages: false,
        lazy: true,
        on: {
          init: function () {
            console.log(
              `Hero Swiper initialized with ${this.slides.length} slides`
            );

            // Play first slide video on init
            setTimeout(() => {
              const firstSlide = this.slides[this.activeIndex];
              const firstVideo = firstSlide?.querySelector("video");
              if (firstVideo) {
                firstVideo.currentTime = 0;
                firstVideo
                  .play()
                  .catch((e) => console.log("Video autoplay prevented:", e));
              }
              // Animate first slide text
              animateSlideText(this.activeIndex);
            }, 100);
          },
          slideChangeTransitionStart: function () {
            console.log(`Changing to slide ${this.activeIndex}`);
            // Hide all slide text before transition
            gsap.set(".slide-title", { x: 100, opacity: 0 });
            gsap.set(".slide-subtitle, .slide-description, .slide-button", {
              y: 50,
              opacity: 0,
            });
          },
          slideChangeTransitionEnd: function () {
            // Pause all videos first
            const allVideos = document.querySelectorAll(".heroSwiper video");
            allVideos.forEach((video) => {
              video.pause();
              video.currentTime = 0;
            });

            // Play current slide video
            const activeSlide = this.slides[this.activeIndex];
            const activeVideo = activeSlide?.querySelector("video");
            if (activeVideo) {
              activeVideo.currentTime = 0;
              activeVideo
                .play()
                .catch((e) => console.log("Video play failed:", e));
            }

            // Animate current slide text
            animateSlideText(this.activeIndex);
          },
          slideChange: function () {
            console.log(`Active slide index: ${this.activeIndex}`);
          },
        },
      });

      // Force update after initialization
      setTimeout(() => {
        heroSwiper.update();
        heroSwiper.updateSlides();
        console.log("Hero Swiper force updated");
      }, 500);

      console.log("Hero Swiper initialized successfully");
    }

    // Hero Swiper is now handled by hero-slider-fix.js
    console.log(
      "ℹ️ Hero Swiper initialization delegated to hero-slider-fix.js"
    );

    // Destinations Swiper - Disabled to avoid conflicts with individual page initializations
    const destinationsElement = document.querySelector(".destinationsSwiper");
    if (false && destinationsElement) {
      const destinationsSwiper = new Swiper(".destinationsSwiper", {
        slidesPerView: "auto",
        spaceBetween: 16,
        loop: false,
        centeredSlides: false,
        freeMode: true,
        freeModeSticky: true,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: ".destinations-next",
          prevEl: ".destinations-prev",
        },
        effect: "slide",
        speed: 400,
        grabCursor: true,
        allowTouchMove: true,
        touchRatio: 1.2,
        simulateTouch: true,
        watchOverflow: true,
        noSwiping: false,
        noSwipingClass: "swiper-no-swiping",
        resistance: true,
        resistanceRatio: 0.85,
        breakpoints: {
          320: {
            slidesPerView: "auto",
            spaceBetween: 12,
            centeredSlides: false,
            freeMode: true,
            freeModeSticky: true,
          },
          375: {
            slidesPerView: "auto",
            spaceBetween: 12,
            centeredSlides: false,
            freeMode: true,
            freeModeSticky: true,
          },
          480: {
            slidesPerView: "auto",
            spaceBetween: 16,
            centeredSlides: false,
            freeMode: true,
            freeModeSticky: true,
          },
          640: {
            slidesPerView: "auto",
            spaceBetween: 16,
            centeredSlides: false,
            freeMode: true,
            freeModeSticky: true,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
            centeredSlides: false,
            freeMode: false,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 25,
            centeredSlides: false,
            freeMode: false,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 30,
            centeredSlides: false,
            freeMode: false,
          },
        },
        on: {
          init: function () {
            console.log("Destinations Swiper initialized");
            this.update();
            // Force mobile layout fix
            if (window.innerWidth <= 768) {
              setTimeout(() => {
                this.updateSlides();
                this.updateProgress();
                this.updateSlidesClasses();
              }, 100);
            }
          },
          resize: function () {
            this.update();
            if (window.innerWidth <= 768) {
              this.updateSlides();
              this.updateProgress();
              this.updateSlidesClasses();
            }
          },
        },
      });

      console.log("Destinations Swiper initialized successfully");
    }
    // Note: destinationsSwiper initialization is handled by individual page scripts to avoid conflicts

    // Experiences Swiper - Disabled to avoid conflicts with index.html initialization
    const experiencesElement = document.querySelector(".experiencesSwiper");
    if (false && experiencesElement) {
      const experiencesSwiper = new Swiper(".experiencesSwiper", {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
        initialSlide: 0,
        direction: "horizontal",
        freeMode: false,
        freeModeSticky: false,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: ".experiences-next",
          prevEl: ".experiences-prev",
        },
        pagination: {
          el: ".experiencesSwiper .swiper-pagination",
          clickable: true,
          dynamicBullets: true,
        },
        effect: "slide",
        speed: 600,
        grabCursor: true,
        allowTouchMove: true,
        touchRatio: 1,
        simulateTouch: true,
        watchOverflow: true,
        noSwiping: false,
        noSwipingClass: "swiper-no-swiping",
        resistance: true,
        resistanceRatio: 0.85,
        touchStartPreventDefault: false,
        touchMoveStopPropagation: false,
        breakpoints: {
          320: {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: true,
            freeMode: false,
            allowTouchMove: true,
            touchRatio: 1,
          },
          375: {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: true,
            freeMode: false,
            allowTouchMove: true,
            touchRatio: 1,
          },
          480: {
            slidesPerView: 1,
            spaceBetween: 0,
            centeredSlides: true,
            freeMode: false,
            allowTouchMove: true,
            touchRatio: 1,
          },
          640: {
            slidesPerView: 1.2,
            spaceBetween: 16,
            centeredSlides: true,
            freeMode: false,
            allowTouchMove: true,
            touchRatio: 1,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
            centeredSlides: false,
            freeMode: false,
            allowTouchMove: true,
            touchRatio: 1,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 25,
            centeredSlides: false,
            freeMode: false,
            allowTouchMove: true,
            touchRatio: 1,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 30,
            centeredSlides: false,
            freeMode: false,
            allowTouchMove: true,
            touchRatio: 1,
          },
        },
        on: {
          init: function () {
            console.log("Experiences Swiper initialized");
            // Only update on desktop, not mobile
            if (window.innerWidth > 640) {
              this.update();
            }
          },
          resize: function () {
            // Only update on desktop resize
            if (window.innerWidth > 640) {
              this.update();
            }
          },
        },
      });

      console.log("Experiences Swiper initialized successfully");
    }
    // Note: experiencesSwiper initialization is handled by index.html script to avoid conflicts

    // Testimonials Swiper (Original)
    const testimonialsElement = document.querySelector(".mySwiper");
    if (testimonialsElement) {
      const testimonialsSwiper = new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        centeredSlides: false,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        effect: "slide",
        speed: 600,
        grabCursor: true,
        allowTouchMove: true,
        pagination: {
          el: ".mySwiper .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".mySwiper .swiper-button-next",
          prevEl: ".mySwiper .swiper-button-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      });
      console.log("✅ Testimonials Swiper (Original) initialized successfully");
    }

    // Testimonials Swiper Copy (mySwiper3) - Same as original
    const testimonialsElement3 = document.querySelector(".mySwiper3");
    if (testimonialsElement3) {
      const testimonialsSwiper3 = new Swiper(".mySwiper3", {
        slidesPerView: 1,
        spaceBetween: 20,
        loop: true,
        centeredSlides: false,
        autoplay: {
          delay: 4000,
          disableOnInteraction: false,
        },
        effect: "slide",
        speed: 600,
        grabCursor: true,
        allowTouchMove: true,
        pagination: {
          el: ".mySwiper3 .swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".mySwiper3 .swiper-button-next",
          prevEl: ".mySwiper3 .swiper-button-prev",
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
            spaceBetween: 25,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
      });
      console.log(
        "✅ Testimonials Swiper Copy (mySwiper3) initialized successfully"
      );
    }
  }

  // Function to animate slide text in sequence - DISABLED (handled by hero-slider-fix.js)
  function animateSlideText(slideIndex) {
    // Animation is now handled by hero-slider-fix.js to prevent duplicates
    console.log('Text animation delegated to hero-slider-fix.js');
    return;
  }

  // Initial state is now handled by hero-slider-fix.js
  console.log('Hero text initial state handled by hero-slider-fix.js');

  // GSAP Stair Animation
  const tl = gsap.timeline();

  // Set initial state
  gsap.set(".stair", {
    scaleY: 0,
    transformOrigin: "top",
  });

  // Animate stairs in (top to bottom growth)
  tl.to(".stair", {
    scaleY: 1,
    duration: 0.3,
    stagger: 0.05,
    ease: "power2.out",
  })
    // Hold for a moment
    .to({}, { duration: 0.2 })
    // Animate stairs out (shrink to bottom)
    .to(".stair", {
      scaleY: 0,
      duration: 0.3,
      stagger: 0.05,
      transformOrigin: "bottom",
      ease: "power2.in",
    })
    // Remove from display
    .set(".stair", {
      display: "none",
    })
    // Fix z-index after animation
    .call(() => {
      const stairContainer = document.querySelector(".stair")?.parentElement;
      if (stairContainer) {
        stairContainer.style.zIndex = "-1";
      }
    });

  // Hero Section Button Handlers
  const heroButtons = document.querySelectorAll(
    ".hero .slide-button, .heroSwiper .slide-button"
  );
  heroButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const buttonText = this.textContent.trim();
      let pageUrl = "";

      switch (buttonText) {
        case "Explore Dubai":
          pageUrl = "destinations.html";
          break;
        case "Discover Japan":
          pageUrl = "destinations.html";
          break;
        case "Visit Malaysia":
          pageUrl = "malaysia.html";
          break;
        case "Explore USA":
          pageUrl = "destinations.html";
          break;
        case "Discover Kazakhstan":
          pageUrl = "destinations.html";
          break;
        case "Book Adventure":
          pageUrl = "booking.html";
          break;
      }

      if (pageUrl) {
        console.log("Hero button navigating to:", pageUrl);
        window.location.href = pageUrl;
      }
    });
  });

  // Package button click handlers
  const packageButtons = document.querySelectorAll("#packages button");
  packageButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const packageCard = this.closest("div");
      const packageTitle = packageCard.querySelector("h3").textContent.trim();
      let pageUrl = "";

      // Determine page based on package title
      if (packageTitle.includes("Budget")) {
        pageUrl = "budget-package.html";
      } else if (packageTitle.includes("Standard")) {
        pageUrl = "standard-package.html";
      } else if (packageTitle.includes("Luxury")) {
        pageUrl = "luxury-package.html";
      } else if (packageTitle.includes("Custom")) {
        pageUrl = "custom-package.html";
      }

      if (pageUrl) {
        console.log("Package button navigating to:", pageUrl);
        window.location.href = pageUrl;
      }
    });
  });

  // Initialize Lucide Icons (only if available)
  if (typeof lucide !== "undefined" && lucide.createIcons) {
    lucide.createIcons();
    console.log("Lucide Icons initialized successfully");
  }

  console.log("✅ Website initialized successfully!");

  // Text Animations for Home Page (excluding hero section)
  if (typeof gsap !== "undefined") {
    // Simple Text Animation for Section Headings
    function createSimpleTextAnimation(element) {
      const text = element.textContent;
      element.innerHTML = "";

      // Create spans for each character
      text.split("").forEach((char, index) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.style.display = "inline-block";
        span.style.opacity = "0";
        span.style.transform = "translateY(30px)";
        element.appendChild(span);
      });

      // Simple animate each character
      const chars = element.querySelectorAll("span");
      gsap.fromTo(
        chars,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: {
            amount: 0.4,
            from: "start",
          },
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    // Apply text animation to specific headings (exclude hero section)
    gsap.utils
      .toArray(
        "section:not(#home) h2, section:not(#home) h3.text-3xl, section:not(#home) h3.text-4xl, section:not(#home) h3.text-5xl"
      )
      .forEach((heading) => {
        // Skip testimonial headings to avoid layout issues
        if (
          !heading.closest("#testimonials") &&
          !heading.textContent.includes("Travelers") &&
          !heading.textContent.includes("Our Journey")
        ) {
          // Use simple fade animation for Popular Destinations instead of character animation
          if (
            heading.textContent.includes("Popular Destinations") ||
            heading.classList.contains("popular-destinations-heading")
          ) {
            // Simple fade-in animation for Popular Destinations
            gsap.fromTo(
              heading,
              { opacity: 0, y: 30 },
              {
                opacity: 1,
                y: 0,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: heading,
                  start: "top 80%",
                  toggleActions: "play none none none",
                },
              }
            );
          } else {
            // Character animation for other headings
            createSimpleTextAnimation(heading);
          }
        }
      });

    // Subtitle Animation
    gsap.utils
      .toArray("section:not(#home) h3, section:not(#home) .text-blue-300")
      .forEach((subtitle) => {
        gsap.fromTo(
          subtitle,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: subtitle,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

    // Text with Typewriter Effect (excluding hero and problematic sections)
    gsap.utils.toArray("section:not(#home) p").forEach((text) => {
      // Skip testimonial paragraphs and hero section to avoid layout issues
      if (
        !text.closest("#testimonials") &&
        !text.closest(".mySwiper") &&
        !text.closest("#home")
      ) {
        gsap.fromTo(
          text,
          { opacity: 0, y: 30, clipPath: "inset(0 100% 0 0)" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0 0% 0 0)",
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: text,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    // Fix color for animated elements
    gsap.utils.toArray(".text-cyan-400").forEach((element) => {
      element.style.color = "#22d3ee";
    });

    // Counter Animation for Stats Section
    gsap.utils.toArray(".counter").forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-target"));
      gsap.fromTo(
        counter,
        { innerHTML: 0 },
        {
          innerHTML: target,
          duration: 2,
          ease: "power2.out",
          snap: { innerHTML: 1 },
          scrollTrigger: {
            trigger: counter,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          onUpdate: function () {
            counter.innerHTML = Math.ceil(this.targets()[0].innerHTML);
          },
        }
      );
    });

    // Ensure Popular Destinations heading is always visible
    const popularDestinationsHeading = document.querySelector(
      ".popular-destinations-heading"
    );
    if (popularDestinationsHeading) {
      gsap.set(popularDestinationsHeading, {
        opacity: 1,
        visibility: "visible",
        display: "block",
      });
      console.log("Popular Destinations heading visibility ensured");
    }

    // Force ScrollTrigger refresh for mobile
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
      ignoreMobileResize: false,
    });

    // Force refresh after initialization
    setTimeout(() => {
      ScrollTrigger.refresh();
      console.log("ScrollTrigger force refreshed");
    }, 1000);

    // Refresh on orientation change
    window.addEventListener("orientationchange", () => {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    });

    console.log("ScrollTrigger optimizations applied for all devices");

    console.log("Home page text animations initialized!");
  } else {
    console.log("GSAP not available for home page animations");
  }
});
