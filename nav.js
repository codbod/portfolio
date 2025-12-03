// Inline navbar HTML to avoid loading from a separate file
// Function to get the navigation HTML with conditional download button
function getNavbarHTML() {
  const isResumePage = window.location.pathname.includes('resume.html');
  
  return `
  <nav>
    <div class="nav-container">
      <div class="theme-switch-container">
        <label class="theme-switch" aria-label="Toggle dark mode">
          <input type="checkbox" id="themeToggle">
          <span class="theme-slider"></span>
        </label>
      </div>
      <div class="nav-center">
        <div class="nav-links">
          <a href="index.html">About Me</a>
          <a href="resume.html">Resume</a>
          <a href="contact.html">Contact Me</a>
        </div>
      </div>
      ${isResumePage ? `
      <div class="download-resume-btn">
        <a href="Resume.pdf" download class="download-nav-btn" title="Download Resume">
          <span>Download</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15L12 3M12 15L8 11M12 15L16 11M3 17V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </a>
      </div>` : ''}
    </div>
  </nav>`;
}

const NAVBAR_HTML = getNavbarHTML();

// Toggle mobile menu
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (navLinks && menuToggle) {
    // Toggle the active class on the nav links
    navLinks.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    
    // Toggle body class to prevent scrolling when menu is open
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  }
}

// Close mobile menu when clicking outside
function handleClickOutside(event) {
  const navLinks = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');
  
  if (navLinks && menuToggle && 
      !navLinks.contains(event.target) && 
      !menuToggle.contains(event.target) &&
      navLinks.classList.contains('active')) {
    navLinks.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = ''; // Re-enable scrolling
  }
}

// Load navbar component
function loadNavbar() {
  try {
    // Create a temporary container
    const temp = document.createElement('div');
    temp.innerHTML = NAVBAR_HTML.trim();
    
    // Get the nav element
    const navElement = temp.querySelector('nav');
    if (!navElement) {
      throw new Error('Failed to create navigation element');
    }
    
    // Insert the navbar before the main content
    const main = document.querySelector('main');
    if (main) {
      main.parentNode.insertBefore(navElement, main);
    } else {
      // If no main element, just append to body
      document.body.insertBefore(navElement, document.body.firstChild);
    }
    
    // After navbar is loaded, set the active link
    setActiveLink();
    
    // Initialize theme after navbar is loaded
    if (window.ThemeManager) {
      window.ThemeManager.initialize();
    }
    
    // Add event listener for mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navContainer = document.querySelector('.nav-container');
    const themeToggle = document.querySelector('.theme-switch-container');
    
    // Toggle mobile menu
    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        this.setAttribute('aria-expanded', 
          this.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
        );
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (!navContainer.contains(e.target) && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Update active nav link
    const currentLocation = window.location.href;
    const navLinksList = document.querySelectorAll('.nav-links a');
    
    navLinksList.forEach(link => {
      if (link.href === currentLocation) {
        link.classList.add('active');
      }

      link.addEventListener('click', function(e) {
        // Remove active class from all links
        navLinksList.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        this.classList.add('active');
        
        // Close mobile menu if open
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    // Handle window resize
    function handleResize() {
      if (window.innerWidth > 768) {
        navLinks.classList.remove('active');
        if (menuToggle) {
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    }

    window.addEventListener('resize', handleResize);
    
    // Initialize
    handleResize();
    
    return navElement;
  } catch (error) {
    console.error('Error creating navbar:', error);
    // Create a simple fallback navigation
    const fallbackNav = document.createElement('nav');
    fallbackNav.innerHTML = `
      <div class="nav-container">
        <div class="nav-links">
          <a href="index.html">About Me</a>
          <a href="resume.html">Resume</a>
          <a href="contact.html">Contact Me</a>
        </div>
      </div>
    `;
    document.body.insertBefore(fallbackNav, document.body.firstChild);
    setActiveLink();
    return fallbackNav;
  }
}

// Set active link in navigation
function setActiveLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar().catch(error => {
    console.error('Failed to load navbar:', error);
  });
  
  // Listen for navigation changes (in case of SPA-like behavior)
  window.addEventListener('popstate', setActiveLink);
});
