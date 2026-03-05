// Intro animation — only runs on the homepage (index.html)
// Plays on first visit & refresh. Skipped when navigating back from another page.
(function () {
  'use strict';

  // Only run if the intro overlay exists on this page
  var overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  // Check if the user navigated here from another page on the site
  // (flag is set by transitions.js when a nav link is clicked)
  var cameFromNav = sessionStorage.getItem('navTransition');

  if (cameFromNav) {
    // User came from another page — skip intro, clear the flag
    sessionStorage.removeItem('navTransition');
    overlay.remove();
    return;
  }

  // Fresh visit or page refresh — play the intro animation
  var headline = document.getElementById('intro-headline');
  var subtitle = document.getElementById('intro-subtitle');
  var accentLine = document.getElementById('intro-accent');
  var homepageContent = document.querySelector('.about-container');
  var sidebar = document.querySelector('.sidebar');
  var footer = document.querySelector('.site-footer');

  // Hide homepage content initially
  if (homepageContent) homepageContent.classList.add('homepage-hidden');
  if (sidebar) sidebar.classList.add('homepage-hidden');
  if (footer) footer.classList.add('homepage-hidden');

  // Mark that intro is active so transitions.js skips its page-enter animation
  window.__introActive = true;

  // Timeline:
  //  0ms        — page loads, dark overlay visible
  //  250ms      — headline fades in + translates up (800ms duration)
  //  450ms      — subtitle fades in + translates up (650ms duration)
  //  1100ms     — accent line animates in (400ms duration)
  //  1500ms     — hold complete, begin dissolve
  //  1500ms     — overlay fades out + homepage content slides up (500ms)
  //  2000ms     — animation complete, clean up

  function runIntro() {
    // Step 1: brief pause, then animate headline
    setTimeout(function () {
      headline.classList.add('intro-visible');
    }, 250);

    // Step 2: animate subtitle 200ms after headline starts
    setTimeout(function () {
      subtitle.classList.add('intro-visible');
    }, 450);

    // Step 3: animate accent line after text is visible
    setTimeout(function () {
      accentLine.classList.add('intro-visible');
    }, 1100);

    // Step 4: dissolve overlay + reveal homepage
    setTimeout(function () {
      overlay.classList.add('intro-dissolve');

      if (homepageContent) homepageContent.classList.add('homepage-reveal');
      if (sidebar) sidebar.classList.add('homepage-reveal');
      if (footer) footer.classList.add('homepage-reveal');
    }, 1500);

    // Step 5: clean up after animation completes
    setTimeout(function () {
      overlay.style.display = 'none';
      if (homepageContent) {
        homepageContent.classList.remove('homepage-hidden', 'homepage-reveal');
      }
      if (sidebar) {
        sidebar.classList.remove('homepage-hidden', 'homepage-reveal');
      }
      if (footer) {
        footer.classList.remove('homepage-hidden', 'homepage-reveal');
      }
      overlay.remove();
      window.__introActive = false;
    }, 2100);
  }

  // Run the intro
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }
})();
