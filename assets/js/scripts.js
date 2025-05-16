// Enhanced scripts.js with improved component loading

// Main script for the Public Forum
function loadPage(page, id) {
  let url = `pages/${page}.html`;

  // If an ID is provided (for specific content pages)
  if (id) {
    url += `?id=${id}`;
  }

  // Immediately save current page to sessionStorage (before fetch)
  saveCurrentPageState(page, id);

  // Force immediate scroll to top WITHOUT animation
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'auto' // This explicitly disables smooth scrolling
  });

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

      // Force another immediate scroll to top to ensure it's at the top
      // This helps with pages that might have content loaded dynamically
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
      });

      // Force script execution by replacing all scripts
      executeScripts(data, document.getElementById("page-content"));

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

// New function to load components (like modals)
function loadComponent(component, callback) {
  const url = `components/${component}.html`;

  // Check if the component is already loaded - if yes, just run the callback
  if (document.getElementById(`${component}`)) {
    if (callback && typeof callback === 'function') {
      callback();
    }
    return;
  }

  fetch(url)
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
      // to avoid variable redeclaration issues
      if (callback && typeof callback === 'function') {
        setTimeout(() => {
          callback();
        }, 100);
      }

      // Force script execution with a delay to ensure DOM is ready
      setTimeout(() => {
        executeScriptsWithScope(container);
      }, 150);

      console.log(`Component ${component} loaded successfully`);
    })
    .catch(error => {
      console.error("Error loading component:", error);
    });
}

// A safer script execution function that creates a unique scope for each script
function executeScriptsWithScope(container) {
  // Get all scripts in the container
  const scripts = container.querySelectorAll('script');

  // Process each script
  scripts.forEach(oldScript => {
    // Create a new script element
    const newScript = document.createElement('script');

    // If it has a src attribute, just copy it
    if (oldScript.src) {
      newScript.src = oldScript.src;
    } else {
      // For inline scripts, wrap in an IIFE to create a new scope
      // This prevents variable redeclaration issues
      newScript.textContent = `
        (function() { 
          ${oldScript.textContent} 
        })();
      `;
    }

    // Replace the old script with the new one
    oldScript.parentNode.replaceChild(newScript, oldScript);
  });
}

// Helper function to execute scripts - legacy version (keeping for compatibility)
function executeScripts(html, targetElement) {
  const container = targetElement || document.body;
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  const scripts = tempDiv.querySelectorAll('script');
  scripts.forEach(oldScript => {
    const newScript = document.createElement('script');

    // Copy all attributes
    Array.from(oldScript.attributes).forEach(attr => {
      newScript.setAttribute(attr.name, attr.value);
    });

    // Copy the content - this will execute when added to DOM
    newScript.textContent = oldScript.textContent;

    // Add to the container
    container.appendChild(newScript);
  });
}

// Helper function to save current page state
function saveCurrentPageState(page, id) {
  // Use localStorage instead of sessionStorage for better persistence
  localStorage.setItem('currentPage', page);
  if (id) {
    localStorage.setItem('currentId', id);
  } else {
    localStorage.removeItem('currentId');
  }

  // Also update the URL query parameter for extra reliability
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

// Handle login button click to load and show the login modal
function showLoginModal() {
  // If the login modal is already in the DOM, just show it
  if (document.getElementById('loginModal')) {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
    return;
  }

  // Otherwise, load the component first
  loadComponent('login-modal', function () {
    setTimeout(() => {
      const loginModalEl = document.getElementById('loginModal');
      if (loginModalEl) {
        const loginModal = new bootstrap.Modal(loginModalEl);
        loginModal.show();
      }
    }, 200);
  });
}

// Handle register button click to load and show the register modal
function showRegisterModal() {
  // If the register modal is already in the DOM, just show it
  if (document.getElementById('registerModal')) {
    const registerModal = new bootstrap.Modal(document.getElementById('registerModal'));
    registerModal.show();
    return;
  }

  // Otherwise, load the component first
  loadComponent('register-modal', function () {
    setTimeout(() => {
      const registerModalEl = document.getElementById('registerModal');
      if (registerModalEl) {
        const registerModal = new bootstrap.Modal(registerModalEl);
        registerModal.show();
      }
    }, 200);
  });
}

// Function to hide login modal
function hideLoginModal() {
  const loginModalEl = document.getElementById('loginModal');
  if (loginModalEl) {
    const loginModal = bootstrap.Modal.getInstance(loginModalEl);
    if (loginModal) {
      loginModal.hide();
    }
  }
}

// Function to hide register modal
function hideRegisterModal() {
  const registerModalEl = document.getElementById('registerModal');
  if (registerModalEl) {
    const registerModal = bootstrap.Modal.getInstance(registerModalEl);
    if (registerModal) {
      registerModal.hide();
    }
  }
}

// Switch from login to register modal
function switchToRegister() {
  hideLoginModal();
  setTimeout(() => {
    showRegisterModal();
  }, 300);
}

// Switch from register to login modal
function switchToLogin() {
  hideRegisterModal();
  setTimeout(() => {
    showLoginModal();
  }, 300);
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
    navbarSearchForm.addEventListener('submit', function (e) {
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
        setTimeout(function () {
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

  console.log("Application initialized successfully");
});

// Make performSearch globally available if it's defined in a page
window.performSearch = function (query) {
  // This is a placeholder that will be overridden by the search page's implementation
  console.log("Default performSearch called with query:", query);
};

// Export global functions
window.loadPage = loadPage;
window.loadComponent = loadComponent;
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.hideLoginModal = hideLoginModal;
window.hideRegisterModal = hideRegisterModal;
window.switchToRegister = switchToRegister;
window.switchToLogin = switchToLogin;
