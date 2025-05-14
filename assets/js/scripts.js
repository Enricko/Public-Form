// FILE: assets/js/scripts.js

// Main script for the Public Forum

function loadPage(page, id) {
  let url = `pages/${page}.html`;
  
  // If an ID is provided (for specific content pages)
  if (id) {
    url += `?id=${id}`;
  }
  
  fetch(url)
    .then(response => response.text())
    .then(data => {
      document.getElementById("page-content").innerHTML = data;
      
      // If the page is search and there's a query parameter in the URL
      if (page === 'search') {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        
        if (query && document.getElementById('search-input')) {
          document.getElementById('search-input').value = query;
          // If performSearch function exists on the page, call it
          if (typeof performSearch === 'function') {
            performSearch(query);
          }
        }
      }
    })
    .catch(error => {
      console.error("Error loading page:", error);
      document.getElementById("page-content").innerHTML = `
        <div class="alert alert-danger">
          Error loading page. Please try again later.
        </div>
      `;
    });
}

document.addEventListener("DOMContentLoaded", function () {
  // Load the home page by default
  loadPage("home");
  
  // Set up the navbar search form
  const navbarSearchForm = document.getElementById('navbar-search-form');
  if (navbarSearchForm) {
    navbarSearchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchInput = document.getElementById('navbar-search-input').value.trim();
      
      if (searchInput) {
        // Load the search page with the query parameter
        loadPage('search');
        
        // Update URL with search query
        const newUrl = window.location.pathname + '?q=' + encodeURIComponent(searchInput);
        window.history.pushState({ path: newUrl }, '', newUrl);
        
        // Wait a bit for the search page to load, then set the input value and perform search
        setTimeout(function() {
          if (document.getElementById('search-input')) {
            document.getElementById('search-input').value = searchInput;
            
            // If performSearch function exists on the page, call it
            if (typeof window.performSearch === 'function') {
              window.performSearch(searchInput);
            }
          }
        }, 300);
      }
    });
  }
  
  // Handle browser back/forward buttons
  window.onpopstate = function(event) {
    if (event.state && event.state.path) {
      const urlParams = new URLSearchParams(event.state.path.split('?')[1]);
      const page = urlParams.get('page') || 'home';
      loadPage(page);
    } else {
      loadPage('home');
    }
  };
});

// Make performSearch globally available if it's defined in a page
window.performSearch = function(query) {
  // This is a placeholder that will be overridden by the search page's implementation
  console.log("Default performSearch called with query:", query);
};