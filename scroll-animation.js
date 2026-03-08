// ═══════════════════════════════════════════════════════════════
// Scroll-Linked Packet Animation — About Page Right Rail
// A packet travels downward past 12 networking devices as the
// user scrolls. Matches Phase-1 intro animation visual style.
// ═══════════════════════════════════════════════════════════════
(function () {
    'use strict';

    // Only run on the About / index page
    var container = document.querySelector('.about-container');
    if (!container) return;

    // ── Device Definitions (top to bottom) ──
    var devices = [
        { id: 'user-device', label: 'User Device' },
        { id: 'wifi-ap', label: 'Wi-Fi AP' },
        { id: 'dist-switch', label: 'Dist Switch' },
        { id: 'core-switch', label: 'Core Switch' },
        { id: 'edge-router', label: 'Edge Router' },
        { id: 'isp-network', label: 'ISP Network' },
        { id: 'dns-server', label: 'DNS Server' },
        { id: 'cdn', label: 'CDN' },
        { id: 'firewall', label: 'Firewall' },
        { id: 'load-balancer', label: 'Load Balancer' },
        { id: 'app-server', label: 'App Server' },
        { id: 'database', label: 'Database' }
    ];

    var DEVICE_COUNT = devices.length;
    var SEGMENT_COUNT = DEVICE_COUNT - 1; // paths between devices

    // ── Vertical layout constants (SVG viewBox units) ──
    var VIEWBOX_W = 100;
    var TOP_PAD = 30;     // top margin inside SVG
    var BOT_PAD = 30;     // bottom margin
    var ICON_X = 40;     // center X of device icons
    var LABEL_X = 40;     // center X of labels (below icons)

    // ── Build SVG markup ──
    function buildSVG(viewH) {
        var usableH = viewH - TOP_PAD - BOT_PAD;
        var spacing = usableH / (DEVICE_COUNT - 1);

        // Pre-compute Y positions for each device
        var positions = [];
        for (var i = 0; i < DEVICE_COUNT; i++) {
            positions.push(TOP_PAD + i * spacing);
        }

        var svg = '';

        // Defs — glow filters (matching Phase 1)
        svg += '<defs>';
        svg += '  <filter id="scroll-pkt-glow" x="-50%" y="-50%" width="200%" height="200%">';
        svg += '    <feGaussianBlur stdDeviation="4" result="blur"/>';
        svg += '    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>';
        svg += '  </filter>';
        svg += '  <filter id="scroll-hop-glow" x="-50%" y="-50%" width="200%" height="200%">';
        svg += '    <feGaussianBlur stdDeviation="3" result="blur"/>';
        svg += '    <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>';
        svg += '  </filter>';
        svg += '</defs>';

        // ── Connection paths (straight vertical lines between devices) ──
        for (var s = 0; s < SEGMENT_COUNT; s++) {
            var y1 = positions[s] + 12;   // below icon
            var y2 = positions[s + 1] - 12; // above next icon
            // Background path
            svg += '<line class="scroll-path-bg" id="sp-bg-' + s + '" x1="' + ICON_X + '" y1="' + y1 + '" x2="' + ICON_X + '" y2="' + y2 + '"/>';
            // Trail (lit-up overlay)
            svg += '<line class="scroll-path-trail" id="sp-trail-' + s + '" x1="' + ICON_X + '" y1="' + y1 + '" x2="' + ICON_X + '" y2="' + y2 + '" stroke-dasharray="' + (y2 - y1) + '" stroke-dashoffset="' + (y2 - y1) + '"/>';
        }

        // ── Device icons ──
        for (var d = 0; d < DEVICE_COUNT; d++) {
            var cy = positions[d];
            var dev = devices[d];
            svg += '<g id="sd-' + d + '" class="scroll-device" opacity="0.35">';
            svg += deviceIcon(dev.id, ICON_X, cy);
            svg += '  <text x="' + LABEL_X + '" y="' + (cy + 17) + '" text-anchor="middle">' + dev.label + '</text>';
            svg += '</g>';
        }

        // ── Packet dot ──
        svg += '<circle id="scroll-packet" cx="' + ICON_X + '" cy="' + positions[0] + '" r="2.5" fill="#00d4ff" filter="url(#scroll-pkt-glow)" opacity="0"/>';

        return { svg: svg, positions: positions, spacing: spacing };
    }

    // ── Device icon sub-drawings (small, ~18×14 footprint) ──
    function deviceIcon(id, cx, cy) {
        var s = ''; // svg string
        var c = 'rgba(0,212,255,'; // colour prefix
        switch (id) {

            // ── User Device (laptop) ──
            case 'user-device':
                s += '<rect x="' + (cx - 10) + '" y="' + (cy - 8) + '" width="20" height="13" rx="2" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<rect x="' + (cx - 7) + '" y="' + (cy - 6) + '" width="14" height="8" rx="1" fill="none" stroke="' + c + '0.2)" stroke-width="0.5"/>';
                s += '<line x1="' + (cx - 12) + '" y1="' + (cy + 7) + '" x2="' + (cx + 12) + '" y2="' + (cy + 7) + '" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                break;

            // ── Wi-Fi AP ──
            case 'wifi-ap':
                s += '<line x1="' + cx + '" y1="' + (cy + 2) + '" x2="' + cx + '" y2="' + (cy - 3) + '" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<rect x="' + (cx - 5) + '" y="' + (cy + 2) + '" width="10" height="5" rx="1.5" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<path d="M ' + (cx - 6) + ',' + (cy - 3) + ' Q ' + cx + ',' + (cy - 10) + ' ' + (cx + 6) + ',' + (cy - 3) + '" fill="none" stroke="' + c + '0.3)" stroke-width="0.7"/>';
                s += '<path d="M ' + (cx - 9) + ',' + (cy - 1) + ' Q ' + cx + ',' + (cy - 13) + ' ' + (cx + 9) + ',' + (cy - 1) + '" fill="none" stroke="' + c + '0.2)" stroke-width="0.7"/>';
                break;

            // ── Distribution Switch ──
            case 'dist-switch':
                s += '<rect x="' + (cx - 11) + '" y="' + (cy - 6) + '" width="22" height="12" rx="2" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<circle cx="' + (cx - 6) + '" cy="' + (cy - 2) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx - 2) + '" cy="' + (cy - 2) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx + 2) + '" cy="' + (cy - 2) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx + 6) + '" cy="' + (cy - 2) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx - 6) + '" cy="' + (cy + 2) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx - 2) + '" cy="' + (cy + 2) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx + 2) + '" cy="' + (cy + 2) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx + 6) + '" cy="' + (cy + 2) + '" r="1" fill="' + c + '0.3)"/>';
                break;

            // ── Core Switch (larger switch) ──
            case 'core-switch':
                s += '<rect x="' + (cx - 12) + '" y="' + (cy - 7) + '" width="24" height="14" rx="2" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<line x1="' + (cx - 12) + '" y1="' + cy + '" x2="' + (cx + 12) + '" y2="' + cy + '" stroke="' + c + '0.2)" stroke-width="0.5"/>';
                for (var p = -8; p <= 8; p += 4) {
                    s += '<circle cx="' + (cx + p) + '" cy="' + (cy - 3) + '" r="1" fill="' + c + '0.3)"/>';
                    s += '<circle cx="' + (cx + p) + '" cy="' + (cy + 3) + '" r="1" fill="' + c + '0.3)"/>';
                }
                break;

            // ── Edge Router ──
            case 'edge-router':
                s += '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<line x1="' + (cx - 5) + '" y1="' + cy + '" x2="' + (cx + 5) + '" y2="' + cy + '" stroke="' + c + '0.3)" stroke-width="0.6"/>';
                s += '<line x1="' + cx + '" y1="' + (cy - 5) + '" x2="' + cx + '" y2="' + (cy + 5) + '" stroke="' + c + '0.3)" stroke-width="0.6"/>';
                s += '<polygon points="' + (cx + 4.5) + ',' + (cy - 1.5) + ' ' + (cx + 4.5) + ',' + (cy + 1.5) + ' ' + (cx + 7) + ',' + cy + '" fill="' + c + '0.3)"/>';
                s += '<polygon points="' + (cx - 4.5) + ',' + (cy - 1.5) + ' ' + (cx - 4.5) + ',' + (cy + 1.5) + ' ' + (cx - 7) + ',' + cy + '" fill="' + c + '0.3)"/>';
                break;

            // ── ISP Network (cloud) ──
            case 'isp-network':
                s += '<path d="M ' + (cx - 10) + ',' + (cy + 2) + ' Q ' + (cx - 10) + ',' + (cy - 5) + ' ' + (cx - 4) + ',' + (cy - 6) +
                    ' Q ' + (cx - 2) + ',' + (cy - 12) + ' ' + (cx + 4) + ',' + (cy - 8) +
                    ' Q ' + (cx + 10) + ',' + (cy - 12) + ' ' + (cx + 11) + ',' + (cy - 4) +
                    ' Q ' + (cx + 14) + ',' + (cy - 2) + ' ' + (cx + 12) + ',' + (cy + 2) +
                    ' Z" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                break;

            // ── DNS Server ──
            case 'dns-server':
                s += '<rect x="' + (cx - 8) + '" y="' + (cy - 8) + '" width="16" height="16" rx="2" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<line x1="' + (cx - 8) + '" y1="' + (cy - 3) + '" x2="' + (cx + 8) + '" y2="' + (cy - 3) + '" stroke="' + c + '0.2)" stroke-width="0.5"/>';
                s += '<line x1="' + (cx - 8) + '" y1="' + (cy + 2) + '" x2="' + (cx + 8) + '" y2="' + (cy + 2) + '" stroke="' + c + '0.2)" stroke-width="0.5"/>';
                s += '<circle cx="' + (cx - 5) + '" cy="' + (cy - 5.5) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx - 5) + '" cy="' + (cy - 0.5) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx - 5) + '" cy="' + (cy + 4.5) + '" r="1" fill="' + c + '0.3)"/>';
                break;

            // ── CDN (globe/nodes) ──
            case 'cdn':
                s += '<circle cx="' + cx + '" cy="' + cy + '" r="8" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="4" ry="8" fill="none" stroke="' + c + '0.2)" stroke-width="0.5"/>';
                s += '<line x1="' + (cx - 8) + '" y1="' + cy + '" x2="' + (cx + 8) + '" y2="' + cy + '" stroke="' + c + '0.2)" stroke-width="0.5"/>';
                break;

            // ── Firewall ──
            case 'firewall':
                s += '<rect x="' + (cx - 9) + '" y="' + (cy - 7) + '" width="18" height="14" rx="2" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                // Brick pattern
                s += '<line x1="' + (cx - 9) + '" y1="' + (cy - 2.5) + '" x2="' + (cx + 9) + '" y2="' + (cy - 2.5) + '" stroke="' + c + '0.25)" stroke-width="0.5"/>';
                s += '<line x1="' + (cx - 9) + '" y1="' + (cy + 2.5) + '" x2="' + (cx + 9) + '" y2="' + (cy + 2.5) + '" stroke="' + c + '0.25)" stroke-width="0.5"/>';
                s += '<line x1="' + cx + '" y1="' + (cy - 7) + '" x2="' + cx + '" y2="' + (cy - 2.5) + '" stroke="' + c + '0.25)" stroke-width="0.5"/>';
                s += '<line x1="' + (cx - 5) + '" y1="' + (cy - 2.5) + '" x2="' + (cx - 5) + '" y2="' + (cy + 2.5) + '" stroke="' + c + '0.25)" stroke-width="0.5"/>';
                s += '<line x1="' + (cx + 5) + '" y1="' + (cy - 2.5) + '" x2="' + (cx + 5) + '" y2="' + (cy + 2.5) + '" stroke="' + c + '0.25)" stroke-width="0.5"/>';
                s += '<line x1="' + cx + '" y1="' + (cy + 2.5) + '" x2="' + cx + '" y2="' + (cy + 7) + '" stroke="' + c + '0.25)" stroke-width="0.5"/>';
                break;

            // ── Load Balancer (scales) ──
            case 'load-balancer':
                // Top triangle / balance
                s += '<line x1="' + cx + '" y1="' + (cy - 8) + '" x2="' + cx + '" y2="' + (cy + 2) + '" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<line x1="' + (cx - 9) + '" y1="' + (cy - 3) + '" x2="' + (cx + 9) + '" y2="' + (cy - 3) + '" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                // Two pans
                s += '<path d="M ' + (cx - 11) + ',' + (cy - 1) + ' Q ' + (cx - 9) + ',' + (cy + 4) + ' ' + (cx - 5) + ',' + (cy - 1) + '" fill="none" stroke="' + c + '0.3)" stroke-width="0.7"/>';
                s += '<path d="M ' + (cx + 5) + ',' + (cy - 1) + ' Q ' + (cx + 9) + ',' + (cy + 4) + ' ' + (cx + 11) + ',' + (cy - 1) + '" fill="none" stroke="' + c + '0.3)" stroke-width="0.7"/>';
                // Base
                s += '<line x1="' + (cx - 6) + '" y1="' + (cy + 5) + '" x2="' + (cx + 6) + '" y2="' + (cy + 5) + '" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                break;

            // ── Application Server ──
            case 'app-server':
                s += '<rect x="' + (cx - 7) + '" y="' + (cy - 9) + '" width="14" height="18" rx="2" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<line x1="' + (cx - 7) + '" y1="' + (cy - 3) + '" x2="' + (cx + 7) + '" y2="' + (cy - 3) + '" stroke="' + c + '0.2)" stroke-width="0.5"/>';
                s += '<line x1="' + (cx - 7) + '" y1="' + (cy + 3) + '" x2="' + (cx + 7) + '" y2="' + (cy + 3) + '" stroke="' + c + '0.2)" stroke-width="0.5"/>';
                s += '<circle cx="' + (cx - 4) + '" cy="' + (cy - 6) + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx - 4) + '" cy="' + cy + '" r="1" fill="' + c + '0.3)"/>';
                s += '<circle cx="' + (cx - 4) + '" cy="' + (cy + 6) + '" r="1" fill="' + c + '0.3)"/>';
                break;

            // ── Database ──
            case 'database':
                s += '<ellipse cx="' + cx + '" cy="' + (cy - 6) + '" rx="9" ry="4" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<line x1="' + (cx - 9) + '" y1="' + (cy - 6) + '" x2="' + (cx - 9) + '" y2="' + (cy + 5) + '" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<line x1="' + (cx + 9) + '" y1="' + (cy - 6) + '" x2="' + (cx + 9) + '" y2="' + (cy + 5) + '" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<ellipse cx="' + cx + '" cy="' + (cy + 5) + '" rx="9" ry="4" fill="none" stroke="' + c + '0.4)" stroke-width="0.8"/>';
                s += '<ellipse cx="' + cx + '" cy="' + (cy - 0.5) + '" rx="9" ry="3.5" fill="none" stroke="' + c + '0.2)" stroke-width="0.4"/>';
                break;
        }
        return s;
    }

    // ── Inject the track into the page ──
    function createTrack() {
        // Compute a viewBox height that gives comfortable spacing
        var viewH = 100 + (DEVICE_COUNT - 1) * 55; // ~635 units

        var data = buildSVG(viewH);
        var el = document.createElement('div');
        el.className = 'scroll-track';
        el.innerHTML = '<svg id="scroll-track-svg" viewBox="0 0 ' + VIEWBOX_W + ' ' + viewH + '" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' + data.svg + '</svg>';

        document.body.appendChild(el);

        return { el: el, positions: data.positions, viewH: viewH };
    }

    // ── Wait for the intro animation to finish (if present) before showing ──
    function waitForIntro(callback) {
        // If the intro overlay exists, wait for it to be removed
        var overlay = document.getElementById('intro-overlay');
        if (!overlay) { callback(); return; }

        var observer = new MutationObserver(function (mutations) {
            // Check if the overlay has been removed from the DOM
            if (!document.getElementById('intro-overlay')) {
                observer.disconnect();
                callback();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Fallback: also check periodically
        var fallback = setInterval(function () {
            if (!document.getElementById('intro-overlay')) {
                clearInterval(fallback);
                observer.disconnect();
                callback();
            }
        }, 500);
    }

    // ── Main logic ──
    waitForIntro(function () {
        var track = createTrack();
        var trackEl = track.el;
        var positions = track.positions;

        // Cache DOM references
        var packetDot = document.getElementById('scroll-packet');
        var deviceGroups = [];
        var trails = [];
        for (var i = 0; i < DEVICE_COUNT; i++) {
            deviceGroups.push(document.getElementById('sd-' + i));
        }
        for (var j = 0; j < SEGMENT_COUNT; j++) {
            trails.push(document.getElementById('sp-trail-' + j));
        }

        // Show the track with a fade-in
        requestAnimationFrame(function () {
            trackEl.classList.add('visible');
        });

        // ── Activate a device (glow effect matching Phase 1) ──
        function activateDevice(index) {
            var g = deviceGroups[index];
            if (!g || g.classList.contains('active')) return;

            g.classList.add('active');
            g.setAttribute('opacity', '1');

            // Brighten strokes
            var strokes = g.querySelectorAll('[stroke]');
            strokes.forEach(function (el) {
                var tag = el.tagName.toLowerCase();
                if (tag !== 'text') {
                    el.setAttribute('stroke', 'rgba(0,212,255,0.9)');
                }
            });

            // Brighten fills
            var fills = g.querySelectorAll('[fill]');
            fills.forEach(function (el) {
                var tag = el.tagName.toLowerCase();
                if (tag === 'circle' || tag === 'polygon') {
                    var cur = el.getAttribute('fill');
                    if (cur && cur.indexOf('0,212,255') > -1) {
                        el.setAttribute('fill', 'rgba(0,212,255,0.8)');
                    }
                }
            });
        }

        // ── Deactivate a device ──
        function deactivateDevice(index) {
            var g = deviceGroups[index];
            if (!g || !g.classList.contains('active')) return;

            g.classList.remove('active');
            g.setAttribute('opacity', '0.35');

            // Restore dim strokes
            var strokes = g.querySelectorAll('[stroke]');
            strokes.forEach(function (el) {
                var tag = el.tagName.toLowerCase();
                if (tag !== 'text') {
                    var cur = el.getAttribute('stroke');
                    if (cur && cur.indexOf('0,212,255') > -1) {
                        el.setAttribute('stroke', cur.replace(/0\.\d+\)/, '0.4)'));
                    }
                }
            });

            // Restore dim fills
            var fills = g.querySelectorAll('[fill]');
            fills.forEach(function (el) {
                var tag = el.tagName.toLowerCase();
                if (tag === 'circle' || tag === 'polygon') {
                    var cur = el.getAttribute('fill');
                    if (cur && cur.indexOf('0,212,255') > -1) {
                        el.setAttribute('fill', 'rgba(0,212,255,0.3)');
                    }
                }
            });
        }

        // ── Scroll handler ──
        var lastProgress = -1;

        function onScroll() {
            // Compute overall scroll progress 0..1
            var scrollTop = window.scrollY || document.documentElement.scrollTop;
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;

            var progress = Math.max(0, Math.min(1, scrollTop / docHeight));
            if (progress === lastProgress) return;
            lastProgress = progress;

            // Map progress to the path:
            //   0.0 = at first device
            //   1.0 = at last device
            var totalSegments = SEGMENT_COUNT;
            var rawIndex = progress * totalSegments; // 0..11
            var segIndex = Math.min(Math.floor(rawIndex), totalSegments - 1);
            var segFrac = rawIndex - segIndex; // fraction within current segment

            // Position the packet dot
            if (segIndex < totalSegments) {
                var y1 = positions[segIndex];
                var y2 = positions[segIndex + 1];
                var packetY = y1 + (y2 - y1) * segFrac;
                packetDot.setAttribute('cy', packetY);
                packetDot.setAttribute('opacity', '1');
            }

            // Activate devices & trails based on progress
            for (var d = 0; d < DEVICE_COUNT; d++) {
                // A device activates when the packet reaches it or has passed it
                var deviceThreshold = d / totalSegments;
                if (progress >= deviceThreshold - 0.01) {
                    activateDevice(d);
                } else {
                    deactivateDevice(d);
                }
            }

            // Update trail segments
            for (var t = 0; t < totalSegments; t++) {
                var trail = trails[t];
                if (!trail) continue;

                if (t < segIndex) {
                    // Fully lit
                    trail.classList.add('lit');
                    trail.setAttribute('stroke-dashoffset', '0');
                } else if (t === segIndex) {
                    // Partially lit
                    trail.classList.add('lit');
                    var lineLen = parseFloat(trail.getAttribute('stroke-dasharray'));
                    trail.setAttribute('stroke-dashoffset', lineLen * (1 - segFrac));
                } else {
                    // Not yet reached
                    trail.classList.remove('lit');
                    var len = trail.getAttribute('stroke-dasharray');
                    trail.setAttribute('stroke-dashoffset', len);
                }
            }
        }

        // Throttled scroll listener
        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    onScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Run once immediately
        onScroll();
    });

})();
