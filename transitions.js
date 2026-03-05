// Page transition system — smooth fade-out/fade-in between navigation links
// Uses only opacity + translateY for hardware-accelerated, subtle transitions
(function () {
  'use strict';

  var isTransitioning = false;
  var FADE_OUT_DURATION = 350; // ms — matches CSS .page-exit

  // Animate the current page content out, then navigate
  function navigateTo(href) {
    if (isTransitioning) return;
    isTransitioning = true;

    var main = document.querySelector('main');
    if (!main) {
      window.location.href = href;
      return;
    }

    // Set flag so intro.js knows the user navigated from another page
    sessionStorage.setItem('navTransition', 'true');

    // Lock scrolling during exit animation
    document.body.classList.add('transitioning');

    // Trigger fade-out + slide-down
    main.classList.add('page-exit');

    // After fade-out completes, navigate to the new page
    setTimeout(function () {
      window.location.href = href;
    }, FADE_OUT_DURATION);
  }

  // On page load: animate the main content in
  function animatePageIn() {
    // If the intro animation is handling the reveal, skip page-enter
    if (window.__introActive) return;

    var main = document.querySelector('main');
    if (!main) return;

    // Start in the hidden enter state
    main.classList.add('page-enter');

    // Force a reflow so the browser registers the starting position
    void main.offsetHeight;

    // Trigger the fade-in animation
    requestAnimationFrame(function () {
      main.classList.remove('page-enter');
      main.classList.add('page-enter-active');

      // Clean up classes after animation completes
      setTimeout(function () {
        main.classList.remove('page-enter-active');
        document.body.classList.remove('transitioning');
        isTransitioning = false;
      }, 450); // matches CSS .page-enter-active duration
    });
  }

  // Intercept navigation link clicks
  function handleLinkClick(e) {
    var link = e.target.closest('a');

    // Ignore: not a link, external, new tab, download, mail, tel, hash-only
    if (!link ||
      link.hostname !== window.location.hostname ||
      link.target === '_blank' ||
      link.getAttribute('download') ||
      link.href.indexOf('mailto:') !== -1 ||
      link.href.indexOf('tel:') !== -1 ||
      link.href.indexOf('javascript:') !== -1 ||
      link.href === '#' ||
      link.href.endsWith('#')) {
      return;
    }

    // Same-page anchor link — let browser handle it
    if (link.hash && link.pathname === window.location.pathname) {
      return;
    }

    // Same page link — no need to transition
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    var targetPage = link.pathname.split('/').pop() || 'index.html';
    if (currentPage === targetPage) {
      return;
    }

    e.preventDefault();
    navigateTo(link.href);
  }

  // Initialize
  function init() {
    document.body.classList.add('loaded');
    animatePageIn();
    document.addEventListener('click', handleLinkClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
