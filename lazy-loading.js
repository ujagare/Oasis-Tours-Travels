// Universal Lazy Loading Script
document.addEventListener('DOMContentLoaded', function() {
    // Add loading="lazy" to all images that don't have it
    const images = document.querySelectorAll('img:not([loading])');
    images.forEach(img => {
        // Skip hero images and logos for immediate loading
        if (!img.src.includes('Logo') && !img.closest('.hero-bg') && !img.closest('nav')) {
            img.setAttribute('loading', 'lazy');
        }
    });

    // Intersection Observer for better lazy loading support
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});