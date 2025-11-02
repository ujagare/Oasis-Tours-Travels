// Hero slider without animations
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero swiper
    const heroSwiper = new Swiper('.heroSwiper', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        effect: 'slide',
        speed: 1000
    });
});