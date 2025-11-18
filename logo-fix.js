// Logo Image Fix - Ensure logos load from local directory
document.addEventListener('DOMContentLoaded', function() {
    // Fix logo images to use local paths only
    function fixLogoImages() {
        const logoImages = document.querySelectorAll('img[src*="Logo"]');
        
        logoImages.forEach(img => {
            const currentSrc = img.src;
            
            // If ImageKit URL is being used, replace with local path
            if (currentSrc.includes('imagekit.io')) {
                // Extract the image filename
                const filename = currentSrc.split('/').pop().split('?')[0];
                
                // Set to local path
                if (filename.includes('Logo')) {
                    img.src = 'Images/Oasis Logo.png';
                    
                    // Remove any ImageKit attributes
                    img.removeAttribute('srcset');
                    img.removeAttribute('sizes');
                    
                    console.log('Fixed logo image:', img.src);
                }
            }
        });
    }
    
    // Run immediately
    fixLogoImages();
    
    // Run again after a short delay to catch any dynamically loaded images
    setTimeout(fixLogoImages, 1000);
    
    // Also run when images load
    window.addEventListener('load', fixLogoImages);
});