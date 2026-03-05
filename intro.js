// Intro animation — only runs on the homepage (index.html)
// Only plays once per browser session (skipped when navigating back from other pages)
(function () {
  'use strict';

  // Only run if the intro overlay exists on this page
  const overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  // Check if the intro has already played this session
  var introPlayed = sessionStorage.getItem('introPlayed');

  if (introPlayed) {
    // Already played — remove the overlay immediately, show page normally
    overlay.remove();
    return;
  }

  // Mark the intro as played for this session
  sessionStorage.setItem('introPlayed', 'true');

  const headline = document.getElementById('intro-headline');
  const subtitle = document.getElementById('intro-subtitle');
  const accentLine = document.getElementById('intro-accent');
  const homepageContent = document.querySelector('.about-container');
  const sidebar = document.querySelector('.sidebar');
  const footer = document.querySelector('.site-footer');

  // Hide homepage content initially
  if (homepageContent) homepageContent.classList.add('homepage-hidden');
  if (sidebar) sidebar.classList.add('homepage-hidden');
  if (footer) footer.classList.add('homepage-hidden');

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
      // Fade out the overlay
      overlay.classList.add('intro-dissolve');

      // Reveal homepage content
      if (homepageContent) homepageContent.classList.add('homepage-reveal');
      if (sidebar) sidebar.classList.add('homepage-reveal');
      if (footer) footer.classList.add('homepage-reveal');
    }, 1500);

    // Step 5: clean up after animation is fully done
    setTimeout(function () {
      overlay.style.display = 'none';
      // Remove animation classes so content renders normally
      if (homepageContent) {
        homepageContent.classList.remove('homepage-hidden', 'homepage-reveal');
      }
      if (sidebar) {
        sidebar.classList.remove('homepage-hidden', 'homepage-reveal');
      }
      if (footer) {
        footer.classList.remove('homepage-hidden', 'homepage-reveal');
      }
      // Remove the overlay from the DOM entirely
      overlay.remove();
    }, 2100);
  }

  // Run the intro as soon as the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }
})();
