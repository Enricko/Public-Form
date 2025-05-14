// Fixed scripts.js with reliable page persistence (even with Ctrl+R)

// Main script for the Public Forum
function loadPage(page, id) {
  let url = `pages/${page}.html`;
  
  // If an ID is provided (for specific content pages)
  if (id) {
    url += `?id=${id}`;
  }
  
  // Immediately save current page to sessionStorage (before fetch)
  // This ensures it's saved even during quick refreshes
  saveCurrentPageState(page, id);
  
  fetch(url)
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
      // This is crucial for making buttons work in dynamically loaded content
      const parser = new DOMParser();
      const doc = parser.parseFromString(data, 'text/html');
      const scriptElements = doc.querySelectorAll('script');
      
      scriptElements.forEach(oldScript => {
        const newScript = document.createElement('script');
        
        // Copy attributes
        Array.from(oldScript.attributes).forEach(attr => {
          newScript.setAttribute(attr.name, attr.value);
        });
        
        // Copy content
        newScript.textContent = oldScript.textContent;
        
        // Find the equivalent script in the actual DOM
        const actualOldScript = document.querySelector(`script[src="${oldScript.getAttribute('src')}"]`) || 
                               Array.from(document.querySelectorAll('script')).find(s => 
                                 s.textContent === oldScript.textContent && !s.getAttribute('src')
                               );
        
        if (actualOldScript) {
          // Replace it if found
          actualOldScript.parentNode.replaceChild(newScript, actualOldScript);
        } else {
          // Otherwise append to body
          document.body.appendChild(newScript);
        }
      });
      
      // Update active state in sidebar
      updateActiveSidebarItem(page);
      
      // If the page is search and there's a query parameter in the URL
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
      
      // Update URL to reflect the current page
      const newUrl = window.location.pathname + '?page=' + encodeURIComponent(page) + (id ? '&id=' + encodeURIComponent(id) : '');
      window.history.pushState({ path: newUrl, page: page, id: id }, '', newUrl);
      
      console.log(`Page ${page} loaded successfully`);
    })
    .catch(error => {
      console.error("Error loading page:", error);
      document.getElementById("page-content").innerHTML = `
        <div class="alert alert-danger">
          Error loading page: ${error.message}. Please try again later.
        </div>
      `;
    });
}

// Helper function to save current page state
// Called early to ensure state is saved even during quick refreshes
function saveCurrentPageState(page, id) {
  // Use localStorage instead of sessionStorage for better persistence
  localStorage.setItem('currentPage', page);
  if (id) {
    localStorage.setItem('currentId', id);
  } else {
    localStorage.removeItem('currentId');
  }
  
  // Also update the URL query parameter for extra reliability
  // This creates multiple ways for the state to persist
  const params = new URLSearchParams(window.location.search);
  params.set('page', page);
  if (id) {
    params.set('id', id);
  } else {
    params.delete('id');
  }
  
  // Update URL without triggering page reload
  const newUrl = window.location.pathname + '?' + params.toString();
  window.history.replaceState({ path: newUrl, page: page, id: id }, '', newUrl);
}

// Helper function to update active state in sidebar
function updateActiveSidebarItem(currentPage) {
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

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded, initializing application...");
  
  // Check if we need to restore a page from the previous session
  const urlParams = new URLSearchParams(window.location.search);
  const pageParam = urlParams.get('page');
  const idParam = urlParams.get('id');
  
  // First priority: URL parameters
  if (pageParam) {
    loadPage(pageParam, idParam || null);
  } 
  // Second priority: localStorage (for refresh persistence)
  else if (localStorage.getItem('currentPage')) {
    const storedPage = localStorage.getItem('currentPage');
    const storedId = localStorage.getItem('currentId') || null;
    loadPage(storedPage, storedId);
  } 
  // Default fallback: home page
  else {
    loadPage("home");
  }
  
  // Set up the navbar search form
  const navbarSearchForm = document.getElementById('navbar-search-form');
  if (navbarSearchForm) {
    navbarSearchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const searchInput = document.getElementById('navbar-search-input').value.trim();
      
      if (searchInput) {
        // Save search query to localStorage for persistence
        localStorage.setItem('lastSearchQuery', searchInput);
        
        // Load the search page
        loadPage('search');
        
        // Update URL with search query
        const newUrl = window.location.pathname + '?page=search&q=' + encodeURIComponent(searchInput);
        window.history.pushState({ path: newUrl, page: 'search' }, '', newUrl);
        
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
  
  // Add click events to sidebar links (as a backup in case the onclick attributes don't work)
  const sidebarLinks = document.querySelectorAll('.sidebar .nav-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Extract page name from the onclick attribute if it exists
      const onclickAttr = this.getAttribute('onclick');
      if (onclickAttr && onclickAttr.includes('loadPage')) {
        const pageName = onclickAttr.match(/loadPage\(['"]([^'"]+)['"]/);
        if (pageName && pageName[1]) {
          e.preventDefault();
          
          // Get ID parameter if present
          const idMatch = onclickAttr.match(/loadPage\(['"][^'"]+['"],\s*['"]([^'"]+)['"]/);
          const id = idMatch ? idMatch[1] : null;
          
          loadPage(pageName[1], id);
        }
      }
    });
  });
  
  console.log("Application initialized successfully");
});

// Make performSearch globally available if it's defined in a page
window.performSearch = function(query) {
  // This is a placeholder that will be overridden by the search page's implementation
  console.log("Default performSearch called with query:", query);
};

// Log that scripts.js has loaded
console.log("Fixed scripts.js loaded successfully with improved page persistence"); 