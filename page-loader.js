// Page Loader Integration using Travelmap Loader
class PageLoader {
    constructor(options = {}) {
        this.options = {
            color: options.color || '#007bff',
            size: options.size || 500,
            speed: options.speed || 1.2,
            minLoadTime: options.minLoadTime || 2000, // Minimum loading time
            ...options
        };
        this.loader = null;
        this.overlay = null;
        this.startTime = Date.now();
    }

    show() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.id = 'page-loader-overlay';
        this.overlay.innerHTML = `
            <div id="page-loader-container">
                <div id="page-loader-animation"></div>
                <div class="loader-text">Loading...</div>
            </div>
        `;
        
        // Add styles
        this.overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #001122;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            backdrop-filter: blur(5px);
        `;

        // Add container styles
        const container = this.overlay.querySelector('#page-loader-container');
        container.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
        `;

        // Add text styles
        const text = this.overlay.querySelector('.loader-text');
        text.style.cssText = `
            font-family: 'Arial', sans-serif;
            font-size: 24px;
            color: white;
            font-weight: 600;
            letter-spacing: 2px;
            margin-top: 20px;
        `;

        document.body.appendChild(this.overlay);

        // Initialize travelmap loader
        this.loader = new TravelmapLoader('page-loader-animation', {
            color: this.options.color,
            size: this.options.size,
            speed: this.options.speed,
            autoplay: true,
            loop: true
        });
    }

    hide() {
        const elapsed = Date.now() - this.startTime;
        const remainingTime = Math.max(0, this.options.minLoadTime - elapsed);

        setTimeout(() => {
            if (this.overlay) {
                this.overlay.style.opacity = '0';
                this.overlay.style.transition = 'opacity 0.5s ease-out';
                
                setTimeout(() => {
                    if (this.loader) {
                        this.loader.destroy();
                    }
                    if (this.overlay && this.overlay.parentNode) {
                        this.overlay.parentNode.removeChild(this.overlay);
                    }
                }, 500);
            }
        }, remainingTime);
    }
}

// Auto-initialize page loader
document.addEventListener('DOMContentLoaded', function() {
    // Check if travelmap loader is available
    if (typeof TravelmapLoader !== 'undefined') {
        const pageLoader = new PageLoader({
            earthColor: '#4169e1', // Blue earth color
            size: 500,
            speed: 1.2
        });

        pageLoader.show();

        // Hide loader when page is fully loaded
        window.addEventListener('load', function() {
            pageLoader.hide();
        });
    }
});

// Export for manual use
window.PageLoader = PageLoader;