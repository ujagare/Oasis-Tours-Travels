// Travelmap Loader Configuration
class TravelmapLoader {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.options = {
            autoplay: options.autoplay !== false,
            loop: options.loop !== false,
            speed: options.speed || 1,
            color: options.color || '#007bff',
            earthColor: options.earthColor || null,
            size: options.size || 100,
            ...options
        };
        this.animation = null;
        this.init();
    }

    init() {
        // Create container if it doesn't exist
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container with ID "${this.containerId}" not found`);
            return;
        }

        // Set container styles
        container.style.display = 'flex';
        container.style.justifyContent = 'center';
        container.style.alignItems = 'center';
        container.style.width = this.options.size + 'px';
        container.style.height = this.options.size + 'px';

        this.loadAnimation();
    }

    async loadAnimation() {
        try {
            // Load Lottie library if not already loaded
            if (typeof lottie === 'undefined') {
                await this.loadLottieLibrary();
            }

            // Load the travelmap JSON
            const response = await fetch('Globe.json');
            const animationData = await response.json();

            // Apply color changes if specified
            if (this.options.earthColor) {
                this.changeEarthOnlyColor(animationData, this.options.earthColor);
            } else if (this.options.color !== '#007bff') {
                this.changeAnimationColor(animationData, this.options.color);
            }

            // Initialize Lottie animation
            this.animation = lottie.loadAnimation({
                container: document.getElementById(this.containerId),
                renderer: 'svg',
                loop: this.options.loop,
                autoplay: this.options.autoplay,
                animationData: animationData,
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid meet'
                }
            });

            // Set animation speed
            this.animation.setSpeed(this.options.speed);

            console.log('Travelmap loader initialized successfully');
        } catch (error) {
            console.error('Error loading travelmap animation:', error);
            this.showFallback();
        }
    }

    loadLottieLibrary() {
        return new Promise((resolve, reject) => {
            if (typeof lottie !== 'undefined') {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    changeAnimationColor(animationData, newColor) {
        // Convert hex color to RGB values
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16) / 255,
                g: parseInt(result[2], 16) / 255,
                b: parseInt(result[3], 16) / 255
            } : null;
        };

        const rgb = hexToRgb(newColor);
        if (!rgb) return;

        // Update colors in the animation data
        const updateColors = (layers) => {
            layers.forEach(layer => {
                // Change earth/world image colors (for image layers)
                if (layer.ty === 2 && layer.refId) { // Image layer
                    // Add color overlay effect for earth
                    if (!layer.ef) layer.ef = [];
                    layer.ef.push({
                        ty: 25, // Tint effect
                        nm: "Tint",
                        ef: [
                            {
                                ty: 2, // Color
                                nm: "Map White To",
                                v: { k: [rgb.r, rgb.g, rgb.b, 1] }
                            },
                            {
                                ty: 0, // Slider
                                nm: "Amount to Tint",
                                v: { k: 50 } // 50% tint
                            }
                        ]
                    });
                }
                
                // Change stroke/fill colors for shapes
                if (layer.shapes) {
                    layer.shapes.forEach(shape => {
                        if (shape.it) {
                            shape.it.forEach(item => {
                                if (item.ty === 'st' && item.c) { // Stroke color
                                    item.c.k = [rgb.r, rgb.g, rgb.b, 1];
                                }
                                if (item.ty === 'fl' && item.c) { // Fill color
                                    item.c.k = [rgb.r, rgb.g, rgb.b, 1];
                                }
                            });
                        }
                    });
                }
                
                if (layer.layers) {
                    updateColors(layer.layers);
                }
            });
        };

        if (animationData.layers) {
            updateColors(animationData.layers);
        }
    }

    showFallback() {
        const container = document.getElementById(this.containerId);
        container.innerHTML = `
            <div style="
                width: ${this.options.size}px;
                height: ${this.options.size}px;
                border: 4px solid #e3e3e3;
                border-top: 4px solid ${this.options.earthColor || this.options.color};
                border-radius: 50%;
                animation: spin 1s linear infinite;
                display: inline-block;
            "></div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        console.log('Fallback loader shown');
    }

    // Public methods
    play() {
        if (this.animation) {
            this.animation.play();
        }
    }

    pause() {
        if (this.animation) {
            this.animation.pause();
        }
    }

    stop() {
        if (this.animation) {
            this.animation.stop();
        }
    }

    setSpeed(speed) {
        if (this.animation) {
            this.animation.setSpeed(speed);
        }
    }

    changeColor(newColor) {
        this.options.color = newColor;
        // Reload animation with new color
        if (this.animation) {
            this.animation.destroy();
            this.loadAnimation();
        }
    }

    // Change only earth color (keeps other elements unchanged)
    changeEarthColor(earthColor) {
        this.options.earthColor = earthColor;
        if (this.animation) {
            this.animation.destroy();
            this.loadEarthColorAnimation();
        }
    }

    async loadEarthColorAnimation() {
        try {
            const response = await fetch('Globe.json');
            const animationData = await response.json();

            // Apply earth-specific color changes
            this.changeEarthOnlyColor(animationData, this.options.earthColor || this.options.color);

            this.animation = lottie.loadAnimation({
                container: document.getElementById(this.containerId),
                renderer: 'svg',
                loop: this.options.loop,
                autoplay: this.options.autoplay,
                animationData: animationData,
                rendererSettings: {
                    preserveAspectRatio: 'xMidYMid meet'
                }
            });

            this.animation.setSpeed(this.options.speed);
        } catch (error) {
            console.error('Error loading earth color animation:', error);
        }
    }

    changeEarthOnlyColor(animationData, earthColor) {
        const hexToRgb = (hex) => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16) / 255,
                g: parseInt(result[2], 16) / 255,
                b: parseInt(result[3], 16) / 255
            } : null;
        };

        const rgb = hexToRgb(earthColor);
        if (!rgb) return;

        // Update earth image colors in animation data
        const updateEarthColors = (layers) => {
            layers.forEach(layer => {
                // Change earth/world image colors (for image layers)
                if (layer.ty === 2 && layer.refId === 'image_0') { // Earth image layer
                    // Add color overlay effect for earth
                    if (!layer.ef) layer.ef = [];
                    layer.ef.push({
                        ty: 25, // Tint effect
                        nm: "Earth Tint",
                        ef: [
                            {
                                ty: 2, // Color
                                nm: "Map White To",
                                v: { k: [rgb.r, rgb.g, rgb.b, 1] }
                            },
                            {
                                ty: 0, // Slider
                                nm: "Amount to Tint",
                                v: { k: 80 } // 80% tint for stronger effect
                            }
                        ]
                    });
                }
                
                if (layer.layers) {
                    updateEarthColors(layer.layers);
                }
            });
        };

        if (animationData.layers) {
            updateEarthColors(animationData.layers);
        }

        // Also apply CSS filter as backup
        setTimeout(() => {
            const container = document.getElementById(this.containerId);
            if (container) {
                const svgElements = container.querySelectorAll('svg image');
                svgElements.forEach(el => {
                    el.style.filter = `hue-rotate(240deg) saturate(2) brightness(0.8)`;
                });
            }
        }, 500);
    }

    getHueRotation(color) {
        const colorMap = {
            '#4169e1': 240,  // Royal blue
            '#000080': 240,  // Navy
            '#4a90e2': 0,    // Natural blue
            '#2d5a27': 120,  // Forest green
            '#d2691e': 30,   // Desert orange
            '#006994': 200,  // Ocean blue
            '#ff6b35': 15,   // Sunset orange
            '#00a86b': 140   // Tropical green
        };
        return colorMap[color] || 0;
    }

    destroy() {
        if (this.animation) {
            this.animation.destroy();
        }
    }
}

// Usage examples and helper functions
window.TravelmapLoader = TravelmapLoader;

// Easy initialization function
window.initTravelmapLoader = function(containerId, options = {}) {
    return new TravelmapLoader(containerId, options);
};

// Predefined color themes
window.TravelmapColors = {
    blue: '#007bff',
    green: '#28a745',
    red: '#dc3545',
    orange: '#fd7e14',
    purple: '#6f42c1',
    teal: '#20c997',
    pink: '#e83e8c',
    yellow: '#ffc107',
    dark: '#343a40',
    light: '#f8f9fa'
};

// Earth-specific color themes
window.EarthColors = {
    natural: '#4a90e2',
    forest: '#2d5a27',
    desert: '#d2691e',
    ocean: '#006994',
    sunset: '#ff6b35',
    arctic: '#b8e6ff',
    tropical: '#00a86b',
    volcanic: '#8b0000',
    golden: '#ffd700',
    mystic: '#9370db'
};