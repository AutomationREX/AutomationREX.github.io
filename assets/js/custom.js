// Custom JavaScript for collapsible left sidebar

document.addEventListener('DOMContentLoaded', function() {
    // Create toggle button for left sidebar
    const leftSidebar = document.querySelector('.left-sidebar');

    if (leftSidebar) {
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle-btn';
        toggleBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
        `;
        toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
        toggleBtn.setAttribute('title', 'Replier/Déplier la sidebar');

        // Add button to body instead of sidebar
        document.body.appendChild(toggleBtn);

        // Check if sidebar was collapsed in previous session
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            leftSidebar.classList.add('collapsed');
            document.body.classList.add('sidebar-collapsed');
        }

        // Toggle functionality
        toggleBtn.addEventListener('click', function() {
            leftSidebar.classList.toggle('collapsed');
            document.body.classList.toggle('sidebar-collapsed');
            const collapsed = leftSidebar.classList.contains('collapsed');

            // Save state to localStorage
            localStorage.setItem('sidebarCollapsed', collapsed);

            // Rotate arrow icon
            const svg = toggleBtn.querySelector('svg');
            if (collapsed) {
                svg.style.transform = 'rotate(180deg)';
            } else {
                svg.style.transform = 'rotate(0deg)';
            }
        });

        // Set initial arrow direction
        if (isCollapsed) {
            const svg = toggleBtn.querySelector('svg');
            svg.style.transform = 'rotate(180deg)';
        }
    }
});
