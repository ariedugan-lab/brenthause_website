// Brenthaüse.com - Smooth Scroll Enhancement
// Enhanced smooth scrolling functionality

(function() {
    'use strict';
    
    // Check if smooth scrolling is supported
    if ('scrollBehavior' in document.documentElement.style) {
        return; // Native smooth scrolling is supported
    }
    
    // Polyfill for smooth scrolling
    function smoothScrollTo(target, duration = 800) {
        const startPosition = window.pageYOffset;
        const targetPosition = target.offsetTop - 80; // Account for fixed header
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }
        
        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }
        
        requestAnimationFrame(animation);
    }
    
    // Apply smooth scrolling to all anchor links
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                smoothScrollTo(targetElement);
            }
        }
    });
    
})();
