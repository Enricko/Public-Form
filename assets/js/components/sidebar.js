/**
 * @file components/sidebar.js
 * Sidebar management functionality
 */

// Helper function to update active state in sidebar
export function updateActiveSidebarItem(currentPage) {
    // First, remove active class from all nav links
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add active class to the current page link
    const activeLink = document.querySelector(`.sidebar .nav-link[onclick*="loadPage('${currentPage}')"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Initialize sidebar event listeners
export function initSidebar() {
    // Set up sidebar item click handlers if not already set
    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        if (!link.hasAttribute('data-initialized')) {
            // Extract page name from onclick attribute
            const onclickAttr = link.getAttribute('onclick') || '';
            const matches = onclickAttr.match(/loadPage\('([^']+)'\)/);
            if (matches && matches[1]) {
                const pageName = matches[1];

                // Replace onclick with cleaner event listener
                link.removeAttribute('onclick');
                link.setAttribute('data-initialized', 'true');

                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    import('../core/loader.js').then(module => {
                        module.loadPage(pageName);
                    });
                });
            }
        }
    });

    // Set up posting button if it exists
    const postButton = document.querySelector('.post-button');
    if (postButton && !postButton.hasAttribute('data-initialized')) {
        postButton.removeAttribute('onclick');
        postButton.setAttribute('data-initialized', 'true');

        postButton.addEventListener('click', function (e) {
            e.preventDefault();
            import('../core/loader.js').then(module => {
                module.loadPage('create-post');
            });
        });
    }
}