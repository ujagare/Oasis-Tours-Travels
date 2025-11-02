// Hero Slider Debug Script
console.log("=== HERO SLIDER DEBUG ===");

document.addEventListener("DOMContentLoaded", function () {
  // Check if heroSwiper element exists
  const heroElement = document.querySelector(".heroSwiper");
  console.log("Hero element found:", !!heroElement);

  if (heroElement) {
    // Check slides
    const slides = heroElement.querySelectorAll(".swiper-slide");
    console.log(`Total slides found: ${slides.length}`);

    slides.forEach((slide, index) => {
      const video = slide.querySelector("video");
      const title = slide.querySelector(".slide-title");
      console.log(`Slide ${index + 1}:`, {
        hasVideo: !!video,
        videoSrc: video?.querySelector("source")?.src || "No source",
        title: title?.textContent || "No title",
        slideVisible: slide.style.display !== "none",
      });

      // Check video loading
      if (video) {
        video.addEventListener("loadeddata", () => {
          console.log(`✅ Video ${index + 1} loaded successfully`);
        });

        video.addEventListener("error", (e) => {
          console.error(`❌ Video ${index + 1} failed to load:`, e);
        });

        video.addEventListener("canplay", () => {
          console.log(`🎬 Video ${index + 1} can play`);
        });
      }
    });

    // Check Swiper initialization
    setTimeout(() => {
      const swiperInstance = heroElement.swiper;
      if (swiperInstance) {
        console.log("✅ Swiper instance found");
        console.log("Active slide index:", swiperInstance.activeIndex);
        console.log("Real index:", swiperInstance.realIndex);
        console.log("Slides length:", swiperInstance.slides.length);
        console.log("Loop enabled:", swiperInstance.params.loop);
        console.log("Autoplay enabled:", swiperInstance.params.autoplay);
      } else {
        console.error("❌ Swiper instance not found");
      }
    }, 1000);
  }

  // Check for JavaScript errors
  window.addEventListener("error", (e) => {
    console.error("JavaScript Error:", e.error);
  });
});
