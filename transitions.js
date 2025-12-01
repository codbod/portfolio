// Create transition overlay with optimized performance
function createTransitionOverlay() {
  // Check if overlay already exists
  let overlay = document.querySelector('.page-transition');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'page-transition';
    // Add to body with minimal reflow
    document.body.insertAdjacentElement('afterbegin', overlay);
  }
  return overlay;
}

// Handle page transitions with improved performance
function initPageTransitions() {
  const transitionOverlay = createTransitionOverlay();
  let isTransitioning = false;
  let transitionStartTime = 0;
  const TRANSITION_DURATION = 150; // ms
  const MIN_TRANSITION_TIME = 120; // Minimum time to show transition (ms)

  // Function to handle navigation with smooth transitions
  async function handleNavigation(href) {
    if (isTransitioning) return;
    
    // Mark transition start time
    transitionStartTime = performance.now();
    isTransitioning = true;
    
    try {
      // Add transitioning class to body
      document.documentElement.classList.add('transitioning');
      
      // Fade out main content
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.style.willChange = 'opacity, transform';
        mainContent.style.opacity = '0';
        mainContent.style.transform = 'translateY(2px)';
      }

      // Wait for the fade out to complete
      await new Promise(resolve => setTimeout(resolve, 80));
      
      // Start the overlay transition
      requestAnimationFrame(() => {
        transitionOverlay.style.display = 'block';
        // Force reflow
        void transitionOverlay.offsetHeight;
        transitionOverlay.classList.add('active');
      });
      
      // Calculate remaining time for minimum transition
      const elapsed = performance.now() - transitionStartTime;
      const remainingTime = Math.max(0, MIN_TRANSITION_TIME - elapsed);
      
      // Wait for minimum transition time
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      // Navigate to the new page in the next frame
      requestAnimationFrame(() => {
        window.location.href = href;
      });
      
    } catch (error) {
      console.error('Navigation error:', error);
      // Clean up on error
      document.documentElement.classList.remove('transitioning');
      transitionOverlay.classList.remove('active');
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.style.opacity = '';
        mainContent.style.transform = '';
        mainContent.style.willChange = '';
      }
      isTransitioning = false;
    }
  }

  // Intercept all link clicks with better performance
  document.addEventListener('click', (e) => {
    // Find the closest anchor element
    const link = e.target.closest('a');
    
    // Ignore if not a link, or if it's an external link, anchor link, or special link
    if (!link || 
        link.hostname !== window.location.hostname || 
        link.target === '_blank' || 
        link.getAttribute('download') ||
        link.href.includes('mailto:') ||
        link.href.includes('tel:') ||
        link.href.includes('javascript:') ||
        link.href === '#' ||
        link.href.endsWith('#')) {
      return;
    }

    // Check if it's a same-page anchor link
    if (link.hash && link.pathname === window.location.pathname) {
      return; // Let the browser handle anchor links
    }

    // Prevent default navigation
    e.preventDefault();
    
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => handleNavigation(link.href), { timeout: 100 });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      requestAnimationFrame(() => handleNavigation(link.href));
    }
  }, { passive: true });

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    if (!isTransitioning) {
      handleNavigation(window.location.href);
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Add 'loaded' class to enable transitions
  document.body.classList.add('loaded');
  
  // Initialize page transitions
  initPageTransitions();
});

// Handle page load event
window.addEventListener('load', () => {
  // Hide the transition overlay if it's still visible
  const overlay = document.querySelector('.page-transition');
  if (overlay) {
    overlay.classList.remove('active');
  }
});
