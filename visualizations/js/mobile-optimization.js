// Mobile Optimization for Breakaway Civilization Dashboard

// Detect mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
        || window.innerWidth <= 768;
}

// Touch event handling for Three.js scenes
function addTouchControls(controls) {
    if (!controls) return;
    
    // Enable touch events
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 0.5;
    controls.zoomSpeed = 0.8;
    
    if (isMobile()) {
        // Reduce auto-rotate speed on mobile
        if (controls.autoRotate) {
            controls.autoRotateSpeed = 1.0;
        }
        
        // Limit zoom range for better mobile experience
        controls.minDistance = controls.minDistance || 50;
        controls.maxDistance = Math.min(controls.maxDistance || 1000, 500);
    }
}

// Optimize renderer for mobile
function optimizeRenderer(renderer) {
    if (!renderer || !isMobile()) return;
    
    // Reduce pixel ratio for performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    
    // Enable antialiasing only on powerful devices
    if (window.devicePixelRatio > 2) {
        renderer.antialias = false;
    }
}

// Handle window resize with debouncing
let resizeTimeout;
function handleResize(callback) {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        callback();
    }, 250);
}

// Optimize particle systems for mobile
function optimizeParticles(particleCount) {
    if (!isMobile()) return particleCount;
    
    // Reduce particle count by 70% on mobile
    return Math.floor(particleCount * 0.3);
}

// Touch-friendly D3 interactions
function addTouchToD3Selection(selection) {
    if (!selection) return;
    
    selection
        .on('touchstart', function(event) {
            event.preventDefault();
            // Simulate mouseenter
            d3.select(this).dispatch('mouseenter');
        })
        .on('touchend', function(event) {
            event.preventDefault();
            // Simulate click and mouseleave
            d3.select(this).dispatch('click');
            d3.select(this).dispatch('mouseleave');
        });
}

// Optimize canvas rendering
function optimizeCanvas(canvas) {
    if (!canvas || !isMobile()) return;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
        // Disable image smoothing for performance
        ctx.imageSmoothingEnabled = false;
        
        // Set lower resolution on mobile
        const scale = 0.75;
        canvas.width = canvas.clientWidth * scale;
        canvas.height = canvas.clientHeight * scale;
        ctx.scale(scale, scale);
    }
}

// Mobile-specific visualization settings
const mobileSettings = {
    maxParticles: 500,
    maxConnections: 50,
    simplifyMeshes: true,
    reduceShadows: true,
    disablePostProcessing: true,
    lowerTextureResolution: true
};

// Initialize mobile optimizations
function initMobileOptimizations() {
    if (!isMobile()) return;
    
    console.log('Mobile device detected, applying optimizations...');
    
    // Add mobile class to body
    document.body.classList.add('mobile-device');
    
    // Optimize navigation menu
    const navMenu = document.querySelector('.visualization-menu');
    if (navMenu) {
        // Add touch scrolling hint
        const scrollHint = document.createElement('div');
        scrollHint.className = 'scroll-hint';
        scrollHint.textContent = '← Swipe for more →';
        scrollHint.style.cssText = `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 0.8em;
            color: var(--accent-color);
            opacity: 0.7;
            pointer-events: none;
        `;
        navMenu.style.position = 'relative';
        navMenu.appendChild(scrollHint);
        
        // Hide hint after first scroll
        navMenu.addEventListener('scroll', () => {
            scrollHint.style.display = 'none';
        }, { once: true });
    }
    
    // Optimize status updates
    const statusUpdateInterval = isMobile() ? 10000 : 5000;
    
    // Add viewport height fix for mobile browsers
    function setViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    
    // Prevent double-tap zoom
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    // Add pull-to-refresh prevention
    document.body.addEventListener('touchmove', (event) => {
        if (event.touches[0].clientY > 0) {
            event.preventDefault();
        }
    }, { passive: false });
}

// Performance monitoring
function monitorPerformance() {
    if (!window.performance || !isMobile()) return;
    
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.duration > 100) {
                console.warn(`Slow frame detected: ${entry.duration}ms`);
                
                // Auto-reduce quality if consistent lag
                if (window.performanceDowngrade) {
                    window.performanceDowngrade();
                }
            }
        }
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
}

// Export mobile utilities
window.mobileUtils = {
    isMobile,
    addTouchControls,
    optimizeRenderer,
    handleResize,
    optimizeParticles,
    addTouchToD3Selection,
    optimizeCanvas,
    mobileSettings,
    initMobileOptimizations,
    monitorPerformance
};

// Initialize on load
document.addEventListener('DOMContentLoaded', initMobileOptimizations);