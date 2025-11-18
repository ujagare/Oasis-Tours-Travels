// Simple CSS Spinner Loader
class BasicSpinnerLoader {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.color = options.color || '#4169e1'; // Royal Blue default
        this.size = options.size || 100;
        this.init();
    }

    init() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container ${this.containerId} not found`);
            return;
        }

        container.innerHTML = `
            <div class="spinner-loader" style="
                width: ${this.size}px;
                height: ${this.size}px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid ${this.color};
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            "></div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
    }

    changeColor(newColor) {
        this.color = newColor;
        const spinner = document.querySelector(`#${this.containerId} .spinner-loader`);
        if (spinner) {
            spinner.style.borderTop = `4px solid ${newColor}`;
        }
    }

    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

window.BasicSpinnerLoader = BasicSpinnerLoader;