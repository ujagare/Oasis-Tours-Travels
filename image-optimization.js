// Image Optimization and Lazy Loading Script
class ImageOptimizer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.optimizeExistingImages();
        this.setupImageUpload();
    }
    
    // Setup lazy loading for images
    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Create a new image to preload
                    const newImg = new Image();
                    newImg.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        img.removeAttribute('data-src');
                    };
                    newImg.src = img.dataset.src;
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
    
    // Optimize existing images
    optimizeExistingImages() {
        const images = document.querySelectorAll('img:not([data-src])');
        
        images.forEach(img => {
            // Add loading="lazy" for native lazy loading
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add error handling
            img.onerror = () => {
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                img.alt = 'Image not found';
            };
        });
    }
    
    // Setup image upload functionality
    setupImageUpload() {
        const uploadBtn = document.getElementById('upload-btn');
        if (!uploadBtn) return;
        
        // Create hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.style.display = 'none';
        fileInput.id = 'image-file-input';
        document.body.appendChild(fileInput);
        
        // Handle upload button click
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleImageUpload(file, uploadBtn);
            }
        });
    }
    
    // Handle image upload
    async handleImageUpload(file, uploadBtn) {
        try {
            // Validate file
            if (!this.validateFile(file)) {
                return;
            }
            
            // Show loading state
            const originalText = uploadBtn.textContent;
            uploadBtn.textContent = 'Processing...';
            uploadBtn.disabled = true;
            
            // Compress image
            const compressedFile = await this.compressImage(file);
            
            // Convert to base64 for preview (or upload to server)
            const base64 = await this.fileToBase64(compressedFile);
            
            // Show preview
            this.showImagePreview(base64, file.name);
            
            // Update button state
            uploadBtn.textContent = '✅ Image Ready';
            uploadBtn.style.backgroundColor = '#10b981';
            
            // Store for form submission
            uploadBtn.dataset.imageData = base64;
            uploadBtn.dataset.fileName = file.name;
            
        } catch (error) {
            console.error('Upload error:', error);
            uploadBtn.textContent = '❌ Upload Failed';
            uploadBtn.style.backgroundColor = '#ef4444';
            
            setTimeout(() => {
                uploadBtn.textContent = '📷 Upload Image';
                uploadBtn.style.backgroundColor = '#2563eb';
                uploadBtn.disabled = false;
            }, 3000);
        }
    }
    
    // Validate file
    validateFile(file) {
        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please select a valid image file (JPEG, PNG, or WebP)');
            return false;
        }
        
        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return false;
        }
        
        return true;
    }
    
    // Compress image
    compressImage(file, quality = 0.8, maxWidth = 1200, maxHeight = 1200) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, file.type, quality);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }
    
    // Convert file to base64
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    // Show image preview
    showImagePreview(base64, fileName) {
        let preview = document.getElementById('image-preview');
        
        if (!preview) {
            preview = document.createElement('div');
            preview.id = 'image-preview';
            preview.className = 'mt-4 p-4 border-2 border-dashed border-white/30 rounded-lg';
            
            const uploadBtn = document.getElementById('upload-btn');
            uploadBtn.parentElement.appendChild(preview);
        }
        
        preview.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${base64}" alt="Preview" class="w-20 h-20 object-cover rounded-lg border-2 border-white/30">
                <div class="flex-1">
                    <p class="text-sm text-white font-medium">${fileName}</p>
                    <p class="text-xs text-gray-300">Image ready for upload</p>
                    <button type="button" onclick="imageOptimizer.removePreview()" class="text-red-400 text-sm hover:underline mt-1">Remove</button>
                </div>
            </div>
        `;
    }
    
    // Remove preview
    removePreview() {
        const preview = document.getElementById('image-preview');
        const uploadBtn = document.getElementById('upload-btn');
        
        if (preview) preview.remove();
        
        if (uploadBtn) {
            uploadBtn.textContent = '📷 Upload Image';
            uploadBtn.style.backgroundColor = '#2563eb';
            uploadBtn.disabled = false;
            delete uploadBtn.dataset.imageData;
            delete uploadBtn.dataset.fileName;
        }
    }
    
    // Get uploaded image data
    getUploadedImageData() {
        const uploadBtn = document.getElementById('upload-btn');
        if (uploadBtn && uploadBtn.dataset.imageData) {
            return {
                data: uploadBtn.dataset.imageData,
                fileName: uploadBtn.dataset.fileName
            };
        }
        return null;
    }
}

// Initialize image optimizer
let imageOptimizer;
document.addEventListener('DOMContentLoaded', () => {
    imageOptimizer = new ImageOptimizer();
});

// Export for global use
window.ImageOptimizer = ImageOptimizer;