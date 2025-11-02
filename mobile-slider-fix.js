// Mobile Slider Fix for Popular Destinations
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Swiper to be available
    setTimeout(() => {
        const destinationsSwiper = document.querySelector('.destinationsSwiper');
        
        if (destinationsSwiper && window.innerWidth <= 768) {
            // Force mobile slider behavior
            const swiperInstance = destinationsSwiper.swiper;
            
            if (swiperInstance) {
                // Update slider for mobile
                swiperInstance.params.slidesPerView = 2;
                swiperInstance.params.spaceBetween = 15;
                swiperInstance.params.centeredSlides = false;
                swiperInstance.params.freeMode = false;
                
                // Force update
                swiperInstance.update();
                swiperInstance.updateSlides();
                
                console.log('Mobile slider fix applied');
            }
        }
    }, 500);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        setTimeout(() => {
            const destinationsSwiper = document.querySelector('.destinationsSwiper');
            if (destinationsSwiper && destinationsSwiper.swiper) {
                destinationsSwiper.swiper.update();
            }
        }, 100);
    });
});