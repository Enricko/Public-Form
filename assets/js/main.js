/**
 * @file main.js
 * Main entry point for the application
 */

// Import modules
import * as loader from './core/loader.js';
import * as state from './core/state.js';
import * as domUtils from './core/dom-utils.js';
import * as darkMode from './features/dark-mode.js';
import * as auth from './features/auth.js';
import * as search from './features/search.js';
import * as profile from './features/profile.js';
import * as modal from './components/modal.js';
import * as sidebar from './components/sidebar.js';
import * as settings from './components/settings.js';

// Initialize application
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM loaded, initializing application...");

    // Fix any stuck modals first
    domUtils.fixStuckModals();

    // Set up modal keyboard controls
    domUtils.setupModalKeyboardControls();

    // Initialize dark mode
    darkMode.initDarkMode();

    // Initialize auth
    auth.initAuth();

    // Initialize search
    search.initSearch();

    // Initialize sidebar
    sidebar.initSidebar();

    // Initialize modals
    modal.initModals();

    // Initialize routes
    loader.initRoutes();

    // Determine which page to load
    const urlState = state.getPageStateFromURL();
    if (urlState) {
        // First priority: URL parameters
        loader.loadPage(urlState.page, urlState.id);
    } else {
        // Second priority: localStorage (for refresh persistence)
        const currentState = state.getCurrentPageState();
        if (currentState.page) {
            loader.loadPage(currentState.page, currentState.id);
        } else {
            // Default fallback: home page
            loader.loadPage("home");
        }
    }

    // Expose necessary functions globally for backward compatibility
    window.loadPage = loader.loadPage;
    window.loadComponent = loader.loadComponent;
    window.performSearch = search.performSearch;

    console.log("Application initialized successfully");
});

// Handle initialization after dynamic page loads
window.initDynamicPage = function (pageName) {
    console.log(`Initializing dynamic page: ${pageName}`);

    // Initialize based on page type
    switch (pageName) {
        case 'profile':
            profile.initProfile();
            break;
        case 'settings':
            settings.initSettingsPanel();
            break;
        case 'search':
            search.initSearch();
            break;
        default:
            // General initialization for all pages
            break;
    }

    // Always initialize dark mode on any page
    darkMode.setupDarkModeAfterPageLoad();
};