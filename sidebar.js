// ═══════════════════════════════════════════════════════════
// Sidebar — System Identity Panel Controller
// Handles toggle, scan-on-load reveal, and live uptime
// ═══════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', function () {
    var sidebar = document.querySelector('.sidebar');
    var toggleButton = document.getElementById('sidebarToggle');
    var body = document.body;

    if (!sidebar) return;

    // Add with-sidebar class to body
    body.classList.add('with-sidebar');

    // ── Load JetBrains Mono font ──
    if (!document.querySelector('link[href*="JetBrains+Mono"]')) {
        var fontLink = document.createElement('link');
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap';
        document.head.appendChild(fontLink);
    }

    // ── Toggle sidebar visibility ──
    function updateSidebarState(visible) {
        if (visible) {
            body.classList.add('sidebar-visible');
            setTimeout(function () {
                sidebar.style.visibility = 'visible';
                sidebar.style.opacity = '1';
            }, 10);
        } else {
            body.classList.remove('sidebar-visible');
            setTimeout(function () {
                if (!body.classList.contains('sidebar-visible')) {
                    sidebar.style.visibility = 'hidden';
                    sidebar.style.opacity = '0';
                }
            }, 300);
        }
        localStorage.setItem('sidebarState', visible);
        updateToggleButton();
    }

    function toggleSidebar() {
        updateSidebarState(!body.classList.contains('sidebar-visible'));
    }

    function updateToggleButton() {
        if (!toggleButton) return;
        toggleButton.textContent = body.classList.contains('sidebar-visible') ? '✕' : '☰';
    }

    // ── Initialize ──
    var isSidebarVisible = false; // Always start hidden
    updateSidebarState(isSidebarVisible);

    if (toggleButton) {
        toggleButton.style.display = 'flex';
        toggleButton.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // ── Close sidebar when clicking outside on mobile ──
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 1024 &&
            body.classList.contains('sidebar-visible') &&
            !sidebar.contains(e.target) &&
            (!toggleButton || !toggleButton.contains(e.target))) {
            updateSidebarState(false);
        }
    });

    // ── Scan-on-load reveal animation ──
    // Trigger staggered module reveal after sidebar becomes visible
    var revealObserver = new MutationObserver(function () {
        if (body.classList.contains('sidebar-visible')) {
            setTimeout(function () {
                sidebar.classList.add('sidebar-loaded');
            }, 100);
        }
    });
    revealObserver.observe(body, { attributes: true, attributeFilter: ['class'] });

    // Also trigger if sidebar starts visible
    if (body.classList.contains('sidebar-visible')) {
        setTimeout(function () {
            sidebar.classList.add('sidebar-loaded');
        }, 100);
    }

    // ── Live Uptime Counter ──
    // Birthday: July 20, 2004
    var birthday = new Date(2004, 6, 20); // month is 0-indexed

    function updateUptime() {
        var now = new Date();
        var diff = now.getTime() - birthday.getTime();

        var years = Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
        diff -= years * (365.25 * 24 * 60 * 60 * 1000);
        var days = Math.floor(diff / (24 * 60 * 60 * 1000));
        diff -= days * (24 * 60 * 60 * 1000);
        var hours = Math.floor(diff / (60 * 60 * 1000));

        var uptimeEl = document.getElementById('sys-uptime');
        if (uptimeEl) {
            uptimeEl.textContent = years + 'y ' + days + 'd ' + hours + 'h';
        }
    }

    updateUptime();
    setInterval(updateUptime, 60000); // Update every minute

    // ── Handle window resize ──
    function handleResize() {
        var isNowMobile = window.innerWidth <= 1024;

        if (isNowMobile) {
            // On mobile, sidebar starts hidden — only opens on button click
            if (body.classList.contains('sidebar-visible')) {
                updateSidebarState(false);
            }
        } else {
            var savedState = localStorage.getItem('sidebarState');
            updateSidebarState(savedState ? JSON.parse(savedState) : false);
        }
    }

    window.addEventListener('resize', handleResize);

    // ── Keyboard accessibility for ports ──
    var ports = sidebar.querySelectorAll('.sys-port');
    ports.forEach(function (port) {
        if (!port.getAttribute('tabindex')) {
            port.setAttribute('tabindex', '0');
        }
        port.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                port.click();
            }
        });
    });
});
