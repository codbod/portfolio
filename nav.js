// Inline navbar HTML to avoid loading from a separate file
const NAVBAR_HTML = `
<nav>
  <div class="nav-container">
    <div class="nav-links">
      <a href="index.html">About Me</a>
      <a href="resume.html">Resume</a>
      <a href="contact.html">Contact Me</a>
    </div>
    <div class="nav-actions">
      <div class="theme-switch-container">
        <label class="theme-switch">
          <input type="checkbox" id="themeToggle">
          <span class="theme-slider"></span>
        </label>
      </div>
    </div>
  </div>
</nav>
`;

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
