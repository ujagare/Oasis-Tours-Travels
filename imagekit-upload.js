// ImageKit Upload Helper
if (typeof ImageKitUploader === 'undefined') {
class ImageKitUploader {
    constructor() {
        this.urlEndpoint = 'https://ik.imagekit.io/z4l1pevod/';
        this.publicKey = 'public_ueUa8yuhiCmv1g5xv/1YE7u6ytU=';
        this.privateKey = 'private_your_private_key'; // Only for server-side
        this.uploadEndpoint = 'https://upload.imagekit.io/api/v1/files/upload';
    }

    // Upload image to ImageKit
    async uploadImage(file, fileName, folder = '') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('fileName', fileName);
        formData.append('publicKey', this.publicKey);
        
        if (folder) {
            formData.append('folder', folder);
        }

        try {
            const response = await fetch(this.uploadEndpoint, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (response.ok) {
                console.log('Image uploaded successfully:', result);
                return result;
            } else {
                throw new Error(result.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    }

    // Bulk upload images
    async bulkUploadImages(files, folder = 'website-images') {
        const uploadPromises = files.map((file, index) => {
            const fileName = `${folder}-${Date.now()}-${index}`;
            return this.uploadImage(file, fileName, folder);
        });

        try {
            const results = await Promise.all(uploadPromises);
            console.log('Bulk upload completed:', results);
            return results;
        } catch (error) {
            console.error('Bulk upload error:', error);
            throw error;
        }
    }
}

// Migration helper to upload existing images
class ImageMigrator {
    constructor() {
        this.uploader = new ImageKitUploader();
        this.imageKit = new ImageKitOptimizer();
    }

    // Convert local image paths to ImageKit URLs
    async migrateLocalImages() {
        const imagePaths = [
            // Hero images
            'Images/slider-4-1.jpg',
            'Images/slider-4-2.jpg',
            'Images/slider-4-3.jpg',
            
            // Destination images
            'Images/Dubai/dubai-featured-720x560.jpg',
            'Images/Dubai/destination-maldives-720x560.jpg',
            'Images/Dubai/destination-singapore-720x560.jpg',
            'Images/Dubai/destination-italy-720x560.jpg',
            'Images/Dubai/destinaion-turkey-720x560.jpg',
            
            // About images
            'Images/images/about-img1.jpg',
            'Images/images/about-img2.jpg',
            'Images/images/about-img3.jpg',
            
            // Gallery images
            'Images/images/footer-gallery-img1.jpg',
            'Images/images/footer-gallery-img2.jpg',
            'Images/images/footer-gallery-img3.jpg',
            'Images/images/footer-gallery-img4.jpg'
            
            // Logo images excluded from ImageKit optimization
            // 'Images/Oasis Logo.png' - Keep local
            // 'Images/Oasis Logo_New.jpeg' - Keep local
        ];

        const migrationMap = {};

        for (const imagePath of imagePaths) {
            try {
                // Generate optimized URL for existing path
                const optimizedUrl = this.imageKit.getOptimizedImageUrl(imagePath, {
                    quality: 85,
                    format: 'webp'
                });
                
                migrationMap[imagePath] = optimizedUrl;
                console.log(`Mapped: ${imagePath} -> ${optimizedUrl}`);
            } catch (error) {
                console.error(`Failed to map ${imagePath}:`, error);
            }
        }

        return migrationMap;
    }

    // Update HTML with optimized URLs
    updateHTMLWithOptimizedImages(migrationMap) {
        Object.keys(migrationMap).forEach(originalPath => {
            const optimizedUrl = migrationMap[originalPath];
            // Exclude logo images from optimization
            const images = document.querySelectorAll(`img[src*="${originalPath}"]:not([src*="Logo"])`);
            
            images.forEach(img => {
                img.src = optimizedUrl;
                
                // Add responsive attributes
                const srcSet = this.imageKit.generateResponsiveSrcSet(originalPath);
                img.srcset = srcSet;
                img.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
                img.loading = 'lazy';
            });
        });
    }
}

// Auto-migration on page load
document.addEventListener('DOMContentLoaded', async function() {
    const migrator = new ImageMigrator();
    
    try {
        const migrationMap = await migrator.migrateLocalImages();
        migrator.updateHTMLWithOptimizedImages(migrationMap);
        console.log('Image migration completed successfully');
    } catch (error) {
        console.error('Image migration failed:', error);
    }
});

// Export classes
window.ImageKitUploader = ImageKitUploader;
window.ImageMigrator = ImageMigrator;
}