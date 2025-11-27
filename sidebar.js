document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('sidebarToggle');
    const body = document.body;
    const isMobile = window.innerWidth <= 1024;

    // Add with-sidebar class to body if not present
    body.classList.add('with-sidebar');

    // Function to update sidebar state
    function updateSidebarState(visible) {
        if (visible) {
            body.classList.add('sidebar-visible');
            // Only set visible styles when showing
            setTimeout(() => {
                sidebar.style.visibility = 'visible';
                sidebar.style.opacity = '1';
            }, 10);
        } else {
            body.classList.remove('sidebar-visible');
            // Hide after transition
            setTimeout(() => {
                if (!body.classList.contains('sidebar-visible')) {
                    sidebar.style.visibility = 'hidden';
                    sidebar.style.opacity = '0';
                }
            }, 300); // Match this with CSS transition duration
        }
        localStorage.setItem('sidebarState', visible);
        updateToggleButton();
    }
    
    // Initialize with sidebar hidden by default
    const savedState = localStorage.getItem('sidebarState');
    const isSidebarVisible = false; // Always start hidden regardless of saved state

    // Function to toggle sidebar
    function toggleSidebar() {
        updateSidebarState(!body.classList.contains('sidebar-visible'));
    }

    // Update toggle button icon
    function updateToggleButton() {
        if (!toggleButton) return;
        toggleButton.textContent = body.classList.contains('sidebar-visible') ? '✕' : '☰';
    }

    // Initialize sidebar state
    function initSidebar() {
        // Start with sidebar hidden by default
        updateSidebarState(isSidebarVisible);
        
        // Show toggle button on desktop, hide on mobile
        if (toggleButton) {
            toggleButton.style.display = window.innerWidth > 1024 ? 'flex' : 'none';
        }
    }

    // Add click event to the toggle button
    if (toggleButton) {
        toggleButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Handle window resize
    function handleResize() {
        const isNowMobile = window.innerWidth <= 1024;
        if (toggleButton) {
            toggleButton.style.display = isNowMobile ? 'none' : 'flex';
        }
        
        // Update sidebar state based on screen size
        if (isNowMobile) {
            updateSidebarState(true);
        } else {
            // Restore previous state when returning to desktop
            const savedState = localStorage.getItem('sidebarState');
            updateSidebarState(savedState ? JSON.parse(savedState) : false);
        }
    }

    // Initialize
    initSidebar();
    window.addEventListener('resize', handleResize);
});
