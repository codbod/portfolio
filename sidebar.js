document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const toggleButton = document.getElementById('sidebarToggle');
    const body = document.body;

    // Function to toggle sidebar
    function toggleSidebar() {
        body.classList.toggle('sidebar-hidden');
        // Update button text based on sidebar state
        if (toggleButton) {
            toggleButton.textContent = body.classList.contains('sidebar-hidden') ? '☰' : '✕';
        }
    }

    // Add click event to the toggle button
    if (toggleButton) {
        toggleButton.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleSidebar();
        });
    }

    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024 && 
            sidebar && 
            !sidebar.contains(e.target) && 
            e.target !== toggleButton) {
            body.classList.add('sidebar-hidden');
            if (toggleButton) toggleButton.textContent = '☰';
        }
    });

    // Close sidebar when a navigation link is clicked (for mobile)
    const navLinks = document.querySelectorAll('.sidebar a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                body.classList.add('sidebar-hidden');
                if (toggleButton) toggleButton.textContent = '☰';
            }
        });
    });

    // Handle window resize
    function handleResize() {
        if (window.innerWidth > 1024) {
            body.classList.remove('sidebar-hidden');
            if (toggleButton) toggleButton.style.display = 'none';
        } else {
            if (toggleButton) toggleButton.style.display = 'flex';
            body.classList.add('sidebar-hidden');
        }
    }

    // Initialize
    handleResize();
    window.addEventListener('resize', handleResize);
});
