// ═══════════════════════════════════════════════════════════════
// Intro Animation — Network Packet Trace → Greeting → Page Reveal
// Only runs on the homepage (index.html)
// ═══════════════════════════════════════════════════════════════
(function () {
  'use strict';

  var overlay = document.getElementById('intro-overlay');
  if (!overlay) return;

  // Skip intro if user navigated here from another page
  var cameFromNav = sessionStorage.getItem('navTransition');
  if (cameFromNav) {
    sessionStorage.removeItem('navTransition');
    overlay.remove();
    return;
  }

  // ── DOM References ──
  var packetScene = document.getElementById('packet-scene');
  var greeting = document.getElementById('intro-greeting');
  var headline = document.getElementById('intro-headline');
  var subtitle = document.getElementById('intro-subtitle');
  var accentLine = document.getElementById('intro-accent');
  var packetDot = document.getElementById('packet-dot');
  var tooltip = document.getElementById('hop-tooltip');
  var svgEl = document.getElementById('network-svg');

  var homepageContent = document.querySelector('.about-container');
  var sidebar = document.querySelector('.sidebar');
  var footer = document.querySelector('.site-footer');

  // Hide homepage content
  if (homepageContent) homepageContent.classList.add('homepage-hidden');
  if (sidebar) sidebar.classList.add('homepage-hidden');
  if (footer) footer.classList.add('homepage-hidden');

  window.__introActive = true;

  // ── Hop Definitions ──
  var hops = [
    { id: 0, label: 'Initiating connection…' },
    { id: 1, label: 'Associated with AP' },
    { id: 2, label: 'Forwarding frame…' },
    { id: 3, label: 'Routing packet…' },
    { id: 4, label: 'Traversing ISP backbone…' },
    { id: 5, label: 'Connection established ✓' }
  ];

  // Path segment count (paths between hops)
  var SEGMENT_COUNT = 5;

  // Timing config (ms)
  var SCENE_FADEIN = 300;   // topology fades in
  var HOP_0_DELAY = 300;   // first hop lights up
  var SEGMENT_DURATION = 500;   // dot travel per segment
  var HOP_PAUSE = 200;   // pause at each hop
  var PHASE2_DELAY = 400;   // gap between phases
  var PHASE2_HOLD = 1200;  // how long greeting shows

  // ── Fast-forward state ──
  var fastMode = false;          // when true, animation runs at high speed
  var phase1Active = false;      // whether Phase 1 is running
  var FAST_SPEED = 8;            // speed multiplier when clicked

  // ── Utility: Animate dot along an SVG path ──
  function animateDotAlongPath(pathEl, duration, onComplete) {
    var totalLen = pathEl.getTotalLength();
    var accumulated = 0;
    var lastTs = null;

    // Setup trail
    var trailId = 'trail-' + pathEl.id.split('-')[1];
    var trail = document.getElementById(trailId);
    if (trail) {
      trail.setAttribute('stroke-dasharray', totalLen);
      trail.setAttribute('stroke-dashoffset', totalLen);
      trail.setAttribute('opacity', '1');
    }

    function step(ts) {
      if (lastTs === null) { lastTs = ts; }
      var delta = ts - lastTs;
      lastTs = ts;

      accumulated += delta * (fastMode ? FAST_SPEED : 1);
      var progress = Math.min(accumulated / duration, 1);

      // Ease-in-out quad
      var eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      var point = pathEl.getPointAtLength(eased * totalLen);
      packetDot.setAttribute('cx', point.x);
      packetDot.setAttribute('cy', point.y);

      if (trail) {
        trail.setAttribute('stroke-dashoffset', totalLen * (1 - eased));
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (onComplete) onComplete();
      }
    }

    requestAnimationFrame(step);
  }

  // ── Utility: Smart timeout (0 delay in fast mode for seamless chaining) ──
  function smartTimeout(fn, delay) {
    if (fastMode) {
      fn();
      return -1;
    }
    return setTimeout(fn, delay);
  }

  // ── Click/key handler: activate fast-forward ──
  function handleFastForward() {
    if (!phase1Active || fastMode) return;
    fastMode = true;
  }

  function handleKeyFastForward(e) {
    if (e.code === 'Space' || e.key === ' ') {
      e.preventDefault();
      handleFastForward();
    }
  }
  function activateHop(hopIndex) {
    var hopGroup = document.getElementById('hop-' + hopIndex);
    if (!hopGroup) return;

    hopGroup.setAttribute('opacity', '1');
    hopGroup.setAttribute('filter', 'url(#hop-glow)');

    var strokes = hopGroup.querySelectorAll('[stroke]');
    strokes.forEach(function (el) {
      var tag = el.tagName.toLowerCase();
      if (tag !== 'text') {
        el.setAttribute('stroke', 'rgba(0,212,255,0.9)');
      }
    });

    var fills = hopGroup.querySelectorAll('[fill]');
    fills.forEach(function (el) {
      var tag = el.tagName.toLowerCase();
      if (tag === 'circle' || tag === 'polygon') {
        var currentFill = el.getAttribute('fill');
        if (currentFill && currentFill.indexOf('0,212,255') > -1) {
          el.setAttribute('fill', 'rgba(0,212,255,0.8)');
        }
      }
    });

    var texts = hopGroup.querySelectorAll('text');
    texts.forEach(function (t) {
      t.setAttribute('fill', 'rgba(0,212,255,1)');
    });
  }

  // ── Utility: Show tooltip near a hop ──
  function showTooltip(hopIndex, text) {
    if (!tooltip || !svgEl) return;

    var hopGroup = document.getElementById('hop-' + hopIndex);
    if (!hopGroup) return;

    var textEl = hopGroup.querySelector('text');
    if (!textEl) return;

    var svgRect = svgEl.getBoundingClientRect();
    var svgViewBox = svgEl.viewBox.baseVal;

    var scaleX = svgRect.width / svgViewBox.width;
    var scaleY = svgRect.height / svgViewBox.height;
    var scale = Math.min(scaleX, scaleY);

    var renderedW = svgViewBox.width * scale;
    var renderedH = svgViewBox.height * scale;
    var offsetX = (svgRect.width - renderedW) / 2;
    var offsetY = (svgRect.height - renderedH) / 2;

    var textX = parseFloat(textEl.getAttribute('x'));
    var textY = parseFloat(textEl.getAttribute('y'));

    var screenX = svgRect.left + offsetX + textX * scale;
    var screenY = svgRect.top + offsetY + textY * scale + 16 * scale;

    tooltip.textContent = text;
    tooltip.style.left = screenX + 'px';
    tooltip.style.top = screenY + 'px';
    tooltip.classList.add('visible');

    setTimeout(function () {
      tooltip.classList.remove('visible');
    }, HOP_PAUSE + SEGMENT_DURATION * 0.4);
  }

  // ── Phase 1: Network Packet Trace ──
  function runPacketTrace(onComplete) {
    phase1Active = true;

    // Listen for clicks/taps/spacebar to fast-forward
    overlay.addEventListener('click', handleFastForward);
    overlay.addEventListener('touchstart', handleFastForward, { passive: true });
    document.addEventListener('keydown', handleKeyFastForward);

    // Fade in the scene
    packetScene.classList.add('scene-visible');

    smartTimeout(function () {
      // Light up starting hop (Your PC)
      activateHop(0);
      showTooltip(0, hops[0].label);

      // Show the packet dot
      packetDot.setAttribute('opacity', '1');

      // Chain through each path segment
      var currentSegment = 0;

      function nextSegment() {
        if (currentSegment >= SEGMENT_COUNT) {
          // All segments done — final hop
          activateHop(5);
          showTooltip(5, hops[5].label);

          smartTimeout(function () {
            finishPhase1();
          }, HOP_PAUSE + 200);
          return;
        }

        var pathEl = document.getElementById('path-' + currentSegment);
        if (!pathEl) return;

        smartTimeout(function () {
          animateDotAlongPath(pathEl, SEGMENT_DURATION, function () {
            // Activate the destination hop
            var destHop = currentSegment + 1;
            activateHop(destHop);
            showTooltip(destHop, hops[destHop].label);

            currentSegment++;
            nextSegment();
          });
        }, HOP_PAUSE);
      }

      // Start the chain
      smartTimeout(nextSegment, HOP_PAUSE);

    }, HOP_0_DELAY);

    function finishPhase1() {
      phase1Active = false;
      fastMode = false;
      overlay.removeEventListener('click', handleFastForward);
      overlay.removeEventListener('touchstart', handleFastForward);
      document.removeEventListener('keydown', handleKeyFastForward);
      if (onComplete) onComplete();
    }
  }

  // ── Phase 2: "Hi, I'm Cody" Greeting ──
  function runGreeting(onComplete) {
    // Fade out the packet scene
    packetScene.classList.add('scene-fadeout');

    setTimeout(function () {
      packetScene.style.display = 'none';

      // Show greeting
      greeting.classList.add('greeting-visible');

      // Stagger in the text
      setTimeout(function () {
        headline.classList.add('intro-visible');
      }, 100);

      setTimeout(function () {
        subtitle.classList.add('intro-visible');
      }, 250);

      setTimeout(function () {
        accentLine.classList.add('intro-visible');
      }, 500);

      // Hold, then complete
      setTimeout(function () {
        if (onComplete) onComplete();
      }, PHASE2_HOLD);

    }, PHASE2_DELAY);
  }

  // ── Phase 3: Dissolve → Reveal Homepage ──
  function revealHomepage() {
    overlay.classList.add('intro-dissolve');

    if (homepageContent) homepageContent.classList.add('homepage-reveal');
    if (sidebar) sidebar.classList.add('homepage-reveal');
    if (footer) footer.classList.add('homepage-reveal');

    setTimeout(function () {
      overlay.style.display = 'none';
      if (homepageContent) homepageContent.classList.remove('homepage-hidden', 'homepage-reveal');
      if (sidebar) sidebar.classList.remove('homepage-hidden', 'homepage-reveal');
      if (footer) footer.classList.remove('homepage-hidden', 'homepage-reveal');
      overlay.remove();
      window.__introActive = false;
    }, 600);
  }

  // ── Orchestrator ──
  function runIntro() {
    runPacketTrace(function () {
      runGreeting(function () {
        revealHomepage();
      });
    });
  }

  // ── Start ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runIntro);
  } else {
    runIntro();
  }
})();
