// This script handles the theme functionality
let themeInitialized = false;

function initializeTheme() {
  if (themeInitialized) return;
  
  const html = document.documentElement;
  // Check if theme is already set in localStorage or use system preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Set initial theme (should already be set by the inline script, but just in case)
  if (!html.getAttribute('data-theme')) {
    html.setAttribute('data-theme', currentTheme);
  }
  
  // Add loaded class to enable transitions after page loads
  document.body.classList.add('loaded');
  
  // Setup theme toggle functionality
  setupThemeToggles();
  
  // Also update on system theme change
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) { // Only if user hasn't set a preference
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
    }
  });
  
  themeInitialized = true;
}

function setupThemeToggles() {
  // Handle existing toggles
  const themeToggles = document.querySelectorAll('.theme-switch input[type="checkbox"]');
  
  themeToggles.forEach(toggle => {
    // Remove any existing event listeners to prevent duplicates
    const newToggle = toggle.cloneNode(true);
    toggle.parentNode.replaceChild(newToggle, toggle);
    
    // Add new event listener
    newToggle.addEventListener('change', handleThemeToggle);
    
    // Set initial state
    const currentTheme = localStorage.getItem('theme') || 'light';
    newToggle.checked = currentTheme === 'dark';
  });
  
  // Update UI for all theme elements
  updateThemeUI();
}

function handleThemeToggle(e) {
  const newTheme = e.target.checked ? 'dark' : 'light';
  setTheme(newTheme);
}

function setTheme(theme) {
  const html = document.documentElement;
  
  // Update the theme
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Update all theme toggles
  const themeToggles = document.querySelectorAll('.theme-switch input[type="checkbox"]');
  themeToggles.forEach(toggle => {
    toggle.checked = theme === 'dark';
  });
  
  // Update UI
  updateThemeUI();
}

function updateThemeUI() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const sliders = document.querySelectorAll('.theme-slider');
  
  // Update slider colors
  sliders.forEach(slider => {
    slider.style.backgroundColor = currentTheme === 'dark' ? '#4a5568' : '#a0aec0';
  });
  
  // Update icons
  const sunIcons = document.querySelectorAll('.theme-icon.sun');
  const moonIcons = document.querySelectorAll('.theme-icon.moon');
  
  if (currentTheme === 'dark') {
    sunIcons.forEach(icon => icon.style.opacity = '0');
    moonIcons.forEach(icon => icon.style.opacity = '1');
  } else {
    sunIcons.forEach(icon => icon.style.opacity = '1');
    moonIcons.forEach(icon => icon.style.opacity = '0');
  }
}

// Run after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme
  initializeTheme();
  
  // Re-initialize theme when the page is shown (for back/forward navigation)
  window.addEventListener('pageshow', () => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeUI();
  });
});

// Export functions for use in other scripts
window.ThemeManager = {
  initialize: initializeTheme,
  setTheme: setTheme,
  updateUI: updateThemeUI
};
