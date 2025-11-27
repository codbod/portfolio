document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('sidebarToggle');
    const body = document.body;
    const isMobile = window.innerWidth <= 1024;

    // Function to update sidebar state
    function updateSidebarState(hidden) {
        if (hidden) {
            body.classList.add('sidebar-hidden');
        } else {
            body.classList.remove('sidebar-hidden');
        }
        localStorage.setItem('sidebarState', hidden);
        updateToggleButton();
    }
    
    // Initialize with sidebar visible by default on desktop, hidden on mobile
    const savedState = localStorage.getItem('sidebarState');
    const isSidebarHidden = isMobile || (savedState !== null ? JSON.parse(savedState) : false);

    // Function to toggle sidebar
    function toggleSidebar() {
        updateSidebarState(!body.classList.contains('sidebar-hidden'));
    }

    // Update toggle button icon
    function updateToggleButton() {
        if (!toggleButton) return;
        toggleButton.textContent = body.classList.contains('sidebar-hidden') ? '☰' : '✕';
    }

    // Initialize sidebar state
    function initSidebar() {
        // Start with sidebar visible on desktop, hidden on mobile
        updateSidebarState(isMobile);
        
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
