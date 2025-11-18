// ImageKit.io Configuration
if (typeof ImageKitOptimizer === 'undefined') {
class ImageKitOptimizer {
    constructor() {
        this.urlEndpoint = 'https://ik.imagekit.io/z4l1pevod/'; // Your ImageKit URL endpoint
        this.publicKey = 'public_ueUa8yuhiCmv1g5xv/1YE7u6ytU='; // Your ImageKit public key
    }

    // Generate optimized image URL
    getOptimizedImageUrl(imagePath, options = {}) {
        const {
            width = null,
            height = null,
            quality = 80,
            format = 'auto',
            progressive = true,
            blur = null,
            grayscale = false
        } = options;

        let transformations = [];
        
        if (width) transformations.push(`w-${width}`);
        if (height) transformations.push(`h-${height}`);
        if (quality !== 80) transformations.push(`q-${quality}`);
        if (format !== 'auto') transformations.push(`f-${format}`);
        if (progressive) transformations.push('pr-true');
        if (blur) transformations.push(`bl-${blur}`);
        if (grayscale) transformations.push('e-grayscale');

        const transformString = transformations.length > 0 ? `tr:${transformations.join(',')}` : '';
        
        return `${this.urlEndpoint}${transformString}/${imagePath}`;
    }

    // Generate optimized video URL
    getOptimizedVideoUrl(videoPath, options = {}) {
        const {
            width = null,
            height = null,
            quality = 80,
            format = 'auto'
        } = options;

        let transformations = [];
        
        if (width) transformations.push(`w-${width}`);
        if (height) transformations.push(`h-${height}`);
        if (quality !== 80) transformations.push(`q-${quality}`);
        if (format !== 'auto') transformations.push(`f-${format}`);

        const transformString = transformations.length > 0 ? `tr:${transformations.join(',')}` : '';
        
        return `${this.urlEndpoint}${transformString}/${videoPath}`;
    }

    // Responsive image srcset generator
    generateResponsiveSrcSet(imagePath, widths = [320, 640, 768, 1024, 1280, 1920]) {
        return widths.map(width => 
            `${this.getOptimizedImageUrl(imagePath, { width, quality: 85 })} ${width}w`
        ).join(', ');
    }
}

// Initialize ImageKit
const imageKit = new ImageKitOptimizer();

// Manual optimization functions (auto-optimization disabled to prevent image loading issues)
// To use optimization, call optimizeExistingImages() manually when needed

// DISABLED: ImageKit optimization temporarily disabled to fix missing images
function optimizeExistingImages() {
    console.log('ImageKit optimization is temporarily disabled to prevent image loading issues');
    return;
    // Only optimize images that are specifically marked for optimization
    const images = document.querySelectorAll('img[data-optimize="true"]');
    
    images.forEach(img => {
        const originalSrc = img.src;
        const imagePath = originalSrc.split('/Images/')[1] || originalSrc.split('/images/')[1];
        
        if (imagePath) {
            // Get image dimensions for optimization
            const rect = img.getBoundingClientRect();
            const width = rect.width > 0 ? Math.ceil(rect.width * 2) : null; // 2x for retina
            
            // Generate optimized URL
            const optimizedUrl = imageKit.getOptimizedImageUrl(`Images/${imagePath}`, {
                width: width,
                quality: 85,
                format: 'webp'
            });
            
            // Generate responsive srcset
            const srcSet = imageKit.generateResponsiveSrcSet(`Images/${imagePath}`);
            
            // Update image attributes
            img.src = optimizedUrl;
            img.srcset = srcSet;
            img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
            
            // Add loading attribute
            img.loading = 'lazy';
            
            console.log(`Optimized image: ${imagePath}`);
        }
    });
}

function optimizeExistingVideos() {
    console.log('ImageKit video optimization is temporarily disabled to prevent video loading issues');
    return;
    // Only optimize videos that are specifically marked for optimization
    const videos = document.querySelectorAll('video[data-optimize="true"] source[src*="video/"], video[data-optimize="true"][src*="video/"]');
    
    videos.forEach(video => {
        const originalSrc = video.src;
        const videoPath = originalSrc.split('/video/')[1];
        
        if (videoPath) {
            const optimizedUrl = imageKit.getOptimizedVideoUrl(`video/${videoPath}`, {
                quality: 70,
                format: 'mp4'
            });
            
            video.src = optimizedUrl;
            console.log(`Optimized video: ${videoPath}`);
        }
    });
}

// Helper function to create optimized image element
function createOptimizedImage(imagePath, options = {}) {
    const img = document.createElement('img');
    const optimizedUrl = imageKit.getOptimizedImageUrl(imagePath, options);
    const srcSet = imageKit.generateResponsiveSrcSet(imagePath);
    
    img.src = optimizedUrl;
    img.srcset = srcSet;
    img.sizes = options.sizes || '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    img.loading = 'lazy';
    img.alt = options.alt || '';
    
    return img;
}

// Export for use in other files
window.ImageKitOptimizer = ImageKitOptimizer;
window.imageKit = imageKit;
window.createOptimizedImage = createOptimizedImage;
}