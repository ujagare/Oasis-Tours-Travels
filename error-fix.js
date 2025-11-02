// Error Prevention Script - Prevents repetitive messages
(function() {
    'use strict';
    
    // Prevent duplicate error messages
    const shownMessages = new Set();
    
    // Override console methods to prevent spam
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    console.error = function(...args) {
        const message = args.join(' ');
        if (!shownMessages.has(message)) {
            shownMessages.add(message);
            originalConsoleError.apply(console, args);
        }
    };
    
    console.warn = function(...args) {
        const message = args.join(' ');
        if (!shownMessages.has(message)) {
            shownMessages.add(message);
            originalConsoleWarn.apply(console, args);
        }
    };
    
    // Prevent duplicate alerts
    const originalAlert = window.alert;
    window.alert = function(message) {
        if (!shownMessages.has('alert:' + message)) {
            shownMessages.add('alert:' + message);
            originalAlert.call(window, message);
        }
    };
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', function(event) {
        const message = 'Promise rejection: ' + event.reason;
        if (!shownMessages.has(message)) {
            shownMessages.add(message);
            console.error('Unhandled promise rejection:', event.reason);
        }
        event.preventDefault();
    });
    
    // Handle general errors
    window.addEventListener('error', function(event) {
        const message = 'Error: ' + event.message;
        if (!shownMessages.has(message)) {
            shownMessages.add(message);
            console.error('Script error:', event.message, 'at', event.filename, ':', event.lineno);
        }
        event.preventDefault();
    });
    
    // Clear message cache every 30 seconds to allow new messages
    setInterval(function() {
        shownMessages.clear();
    }, 30000);
    
    console.log('Error prevention script loaded successfully');
})();