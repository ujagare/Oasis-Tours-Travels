// Simple fix to make hero text visible immediately
document.addEventListener("DOMContentLoaded", function () {
  console.log("Hero text fix loading...");

  // Wait a bit for the page to load
  setTimeout(function () {
    // Find all hero text elements
    const heroElements = document.querySelectorAll(
      ".slide-title, .slide-subtitle, .slide-description, .slide-button"
    );

    console.log("Found hero elements:", heroElements.length);

    // Force them to be visible
    heroElements.forEach(function (element) {
      if (element) {
        element.style.opacity = "1";
        element.style.visibility = "visible";
        element.style.display =
          element.tagName.toLowerCase() === "a" ||
          element.tagName.toLowerCase() === "button"
            ? "inline-block"
            : "block";
        element.style.color = "white";
        element.style.transform = "none";
        element.style.zIndex = "10";
        element.style.position = "relative";

        console.log("Made visible:", element.className);
      }
    });

    // Also check for elements in the first slide specifically
    const firstSlide = document.querySelector(".swiper-slide:first-child");
    if (firstSlide) {
      const firstSlideElements = firstSlide.querySelectorAll(
        ".slide-title, .slide-subtitle, .slide-description, .slide-button"
      );
      firstSlideElements.forEach(function (element) {
        element.style.opacity = "1";
        element.style.visibility = "visible";
        element.style.color = "white";
        element.style.transform = "none";
      });
    }
  }, 500);

  // Also try immediately
  const immediateElements = document.querySelectorAll(
    ".slide-title, .slide-subtitle, .slide-description, .slide-button"
  );
  immediateElements.forEach(function (element) {
    element.style.opacity = "1";
    element.style.visibility = "visible";
    element.style.color = "white";
  });
});
