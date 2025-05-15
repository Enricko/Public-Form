/**
 * @file core/state.js
 * Handle application state management
 */

// Helper function to save current page state
export function saveCurrentPageState(page, id) {
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

// Get the current page state
export function getCurrentPageState() {
    const page = localStorage.getItem('currentPage') || 'home';
    const id = localStorage.getItem('currentId') || null;
    return { page, id };
}

// Check URL parameters for page state
export function getPageStateFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get('page');
    const idParam = urlParams.get('id');

    if (pageParam) {
        return { page: pageParam, id: idParam };
    }

    return null;
}

// Save other application state
export function saveState(key, value) {
    try {
        if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }
        return true;
    } catch (e) {
        console.error('Error saving state:', e);
        return false;
    }
}

// Get state value
export function getState(key, defaultValue = null) {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;

    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}