/**
 * @file features/search.js
 * Search functionality
 */

// Global search function
export function performSearch(query) {
    if (!query) return;

    // Update UI to show searching state
    const resultCount = document.getElementById('result-count');
    if (resultCount) {
        resultCount.textContent = `Searching for "${query}"...`;
    }

    // In a real implementation, this would make an API call
    // For now, we just simulate a search
    setTimeout(() => {
        if (resultCount) {
            resultCount.textContent = `15 results found for "${query}"`;
        }
    }, 500);
}

// Initialize search functionality
export function initSearch() {
    // Set up navbar search form
    const navbarSearchForm = document.getElementById('navbar-search-form');
    if (navbarSearchForm) {
        navbarSearchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const searchInput = document.getElementById('navbar-search-input').value.trim();

            if (searchInput) {
                // Save search query to localStorage for persistence
                localStorage.setItem('lastSearchQuery', searchInput);

                // Load the search page
                import('../core/loader.js').then(module => {
                    module.loadPage('search').then(() => {
                        // Wait a bit for the search page to load, then set the input value and perform search
                        setTimeout(function () {
                            const searchInputField = document.getElementById('search-input');
                            if (searchInputField) {
                                searchInputField.value = searchInput;
                                performSearch(searchInput);
                            }
                        }, 300);
                    });
                });

                // Update URL with search query
                const newUrl = window.location.pathname + '?page=search&q=' + encodeURIComponent(searchInput);
                window.history.pushState({ path: newUrl, page: 'search' }, '', newUrl);
            }
        });
    }

    // Set up main search form if on search page
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput')?.value.trim();

            if (searchInput) {
                performSearch(searchInput);
            }
        });

        // Check URL for search query
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('q');

        if (queryParam) {
            const searchInputField = document.getElementById('search-input');
            if (searchInputField) {
                searchInputField.value = queryParam;
                performSearch(queryParam);
            }
        }
    }

    // Expose global search function
    window.performSearch = performSearch;
}