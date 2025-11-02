// Global error handler to suppress third-party widget errors
window.addEventListener('error', function(e) {
    // Suppress Tawk.to related errors
    if (e.message && e.message.includes('Tawk') || 
        e.filename && e.filename.includes('tawk') ||
        e.error && e.error.stack && e.error.stack.includes('tawk')) {
        console.warn('Tawk.to error suppressed:', e.message);
        e.preventDefault();
        return true;
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    if (e.reason && e.reason.toString().includes('Tawk')) {
        console.warn('Tawk.to promise rejection suppressed:', e.reason);
        e.preventDefault();
    }
});