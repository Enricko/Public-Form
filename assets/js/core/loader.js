/**
 * @file core/loader.js
 * Handles loading of pages and components
 */

// Load a page into the main content area
export function loadPage(page, id) {
    let url = `pages/${page}.html`;

    // If an ID is provided (for specific content pages)
    if (id) {
        url += `?id=${id}`;
    }

    // Immediately save current page to state
    import('./state.js').then(module => {
        module.saveCurrentPageState(page, id);
    });

    window.scrollTo(0, 0);
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load page: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            // Set the HTML content
            document.getElementById("page-content").innerHTML = data;

            // Force script execution by replacing all scripts
            import('./dom-utils.js').then(module => {
                module.executeScripts(data, document.getElementById("page-content"));
            });

            // Update active state in sidebar
            import('../components/sidebar.js').then(module => {
                module.updateActiveSidebarItem(page);
            });

            // Handle special page behavior
            handleSpecialPageBehavior(page);

            // Update URL to reflect the current page
            const newUrl = window.location.pathname + '?page=' + encodeURIComponent(page) + (id ? '&id=' + encodeURIComponent(id) : '');
            window.history.pushState({ path: newUrl, page: page, id: id }, '', newUrl);

            console.log(`Page ${page} loaded successfully`);

            // Initialize dark mode for the newly loaded page
            import('../features/dark-mode.js').then(module => {
                if (module.setupDarkModeAfterPageLoad) {
                    module.setupDarkModeAfterPageLoad();
                }
            });

            return { page, id };
        })
        .catch(error => {
            console.error("Error loading page:", error);
            document.getElementById("page-content").innerHTML = `
        <div class="alert alert-danger">
          Error loading page: ${error.message}. Please try again later.
        </div>
      `;
            return { error };
        });
}

// Load a component (like modals)
export function loadComponent(component, callback) {
    const url = `components/${component}.html`;

    // Check if the component is already loaded - if yes, just run the callback
    if (document.getElementById(`${component}`)) {
        if (callback && typeof callback === 'function') {
            callback();
        }
        return Promise.resolve();
    }

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to load component: ${response.status} ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            // Create a container for the component if it doesn't exist
            let container = document.getElementById(`${component}-container`);
            if (!container) {
                container = document.createElement('div');
                container.id = `${component}-container`;
                document.body.appendChild(container);
            }

            // Set the HTML content
            container.innerHTML = data;

            // Execute callback if provided - this must happen BEFORE script execution
            if (callback && typeof callback === 'function') {
                setTimeout(() => {
                    callback();
                }, 100);
            }

            // Force script execution with a delay to ensure DOM is ready
            setTimeout(() => {
                import('./dom-utils.js').then(module => {
                    module.executeScriptsWithScope(container);
                });
            }, 150);

            console.log(`Component ${component} loaded successfully`);
            return component;
        })
        .catch(error => {
            console.error("Error loading component:", error);
            return { error };
        });
}

// Handle special page behavior
function handleSpecialPageBehavior(page) {
    // Search page special handling
    if (page === 'search') {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');

        if (query && document.getElementById('search-input')) {
            document.getElementById('search-input').value = query;

            // If performSearch function exists on the page, call it
            if (typeof window.performSearch === 'function') {
                window.performSearch(query);
            }
        }
    }
}

// Initialize application routes
export function initRoutes() {
    // Handle browser back/forward buttons
    window.onpopstate = function (event) {
        if (event.state && event.state.page) {
            loadPage(event.state.page, event.state.id || null);
        } else {
            // If we don't have state, check the URL
            const urlParams = new URLSearchParams(window.location.search);
            const page = urlParams.get('page') || 'home';
            const id = urlParams.get('id') || null;
            loadPage(page, id);
        }
    };
}