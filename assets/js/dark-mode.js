// FILE: assets/js/dark-mode.js

// Initialize dark mode based on user preference
function initDarkMode() {
    // Check if dark mode is enabled in localStorage
    const isDarkMode = localStorage.getItem('darkMode') === 'enabled';

    // Apply dark mode if enabled
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }

    // Update any UI toggles that might exist
    updateDarkModeToggles(isDarkMode);
}

// Update all dark mode toggle switches to match current state
function updateDarkModeToggles(isDarkMode) {
    // Find all dark mode toggle inputs
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle, #darkMode');

    // Update their checked state
    darkModeToggles.forEach(toggle => {
        if (toggle) toggle.checked = isDarkMode;
    });
}

// Toggle dark mode
function toggleDarkMode(enable) {
    if (enable) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }

    // Update all toggles
    updateDarkModeToggles(enable);
}

// Setup event listeners for dark mode toggles
function setupDarkModeListeners() {
    // Find all dark mode toggle inputs
    const darkModeToggles = document.querySelectorAll('.dark-mode-toggle, #darkMode');

    // Add event listeners to them
    darkModeToggles.forEach(toggle => {
        if (toggle) {
            toggle.addEventListener('change', function () {
                toggleDarkMode(this.checked);
            });
        }
    });
}

// Initialize dark mode when the script loads
initDarkMode();

// Set up listeners when DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    setupDarkModeListeners();
    fixNavbarInDarkMode();
});

// Fix specific elements in dark mode
function fixNavbarInDarkMode() {
    // Fix the search bar in dark mode
    const searchInput = document.querySelector('#navbar-search-input');
    if (searchInput) {
        searchInput.style.backgroundColor = document.body.classList.contains('dark-mode') ? '#1A1A1B' : '#fff';
        searchInput.style.color = document.body.classList.contains('dark-mode') ? '#D7DADC' : '#1c1c1c';
        searchInput.style.borderColor = document.body.classList.contains('dark-mode') ? '#343536' : '#ced4da';
    }

    // Fix the trending section in dark mode
    const trendingItems = document.querySelectorAll('.trending-item');
    trendingItems.forEach(item => {
        item.style.color = document.body.classList.contains('dark-mode') ? '#D7DADC' : '#1c1c1c';
    });

    // Fix the follow buttons
    const followButtons = document.querySelectorAll('.follow-btn');
    followButtons.forEach(button => {
        button.style.backgroundColor = '#ff4500';
        button.style.color = '#ffffff';
    });

    // Fix the user info in the right sidebar
    const userInfoContainers = document.querySelectorAll('.user-info-container');
    userInfoContainers.forEach(container => {
        container.querySelectorAll('.user-name, .user-description, .user-additional-info').forEach(element => {
            element.style.color = document.body.classList.contains('dark-mode') ? '#D7DADC' : '#1c1c1c';
        });
    });
}

// Re-setup listeners when page changes in SPA mode
// This needs to be called after dynamic content is loaded
window.setupDarkModeAfterPageLoad = function () {
    setupDarkModeListeners();
    updateDarkModeToggles(localStorage.getItem('darkMode') === 'enabled');
    fixNavbarInDarkMode();
};


// Fix search page UI in dark mode
function fixSearchPageInDarkMode() {
    const isDarkMode = document.body.classList.contains('dark-mode');

    // Fix form inputs (including placeholders)
    const searchInputs = document.querySelectorAll('#searchInput, #navbar-search-input, input[type="text"], input[type="search"]');
    searchInputs.forEach(input => {
        if (input) {
            input.style.backgroundColor = isDarkMode ? '#1A1A1B' : '#fff';
            input.style.color = isDarkMode ? '#D7DADC' : '#1c1c1c';
            input.style.borderColor = isDarkMode ? '#343536' : '#ced4da';

            // Apply placeholder color via a CSS class instead of direct styling
            if (isDarkMode) {
                input.classList.add('dark-placeholder');
            } else {
                input.classList.remove('dark-placeholder');
            }
        }
    });

    // Fix select elements
    const selectElements = document.querySelectorAll('select.form-select, .form-select');
    selectElements.forEach(select => {
        if (select) {
            select.style.backgroundColor = isDarkMode ? '#1A1A1B' : '#fff';
            select.style.color = isDarkMode ? '#D7DADC' : '#1c1c1c';
            select.style.borderColor = isDarkMode ? '#343536' : '#ced4da';
        }
    });

    // Fix social posts in search results
    const socialPosts = document.querySelectorAll('.social-post, .card-body');
    socialPosts.forEach(post => {
        if (post) {
            post.style.backgroundColor = isDarkMode ? '#1A1A1B' : '#fff';
            post.style.color = isDarkMode ? '#D7DADC' : '#1c1c1c';
            post.style.borderColor = isDarkMode ? '#343536' : '#EDEFF1';
        }
    });

    // Fix text elements
    const textElements = document.querySelectorAll('.post-content, .post-author, .post-info, h2, h3, h4, h5, .fw-bold');
    textElements.forEach(element => {
        if (element) {
            element.style.color = isDarkMode ? '#D7DADC' : '#1c1c1c';
        }
    });

    // Fix secondary text
    const secondaryTextElements = document.querySelectorAll('.text-muted, .post-meta, .post-date, small');
    secondaryTextElements.forEach(element => {
        if (element) {
            element.style.color = isDarkMode ? '#818384' : '#6c757d';
        }
    });

    // Fix tags navigation
    const navLinks = document.querySelectorAll('.nav-tabs .nav-link');
    navLinks.forEach(link => {
        if (link) {
            link.style.color = isDarkMode ? '#818384' : '#495057';

            if (link.classList.contains('active')) {
                link.style.color = isDarkMode ? '#0079d3' : '#0079d3';
                link.style.borderColor = isDarkMode ? '#0079d3' : '#0079d3';
                link.style.backgroundColor = isDarkMode ? '#1A1A1B' : '#fff';
            }
        }
    });
}

// Modify the existing toggleDarkMode function to include the search page fix
function toggleDarkMode(enable) {
    if (enable) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }

    // Update all toggles
    updateDarkModeToggles(enable);

    // Fix navbar in dark mode
    fixNavbarInDarkMode();

    // Fix search page UI in dark mode
    fixSearchPageInDarkMode();
}

// Update the window.setupDarkModeAfterPageLoad function
window.setupDarkModeAfterPageLoad = function () {
    setupDarkModeListeners();
    updateDarkModeToggles(localStorage.getItem('darkMode') === 'enabled');
    fixNavbarInDarkMode();
    fixSearchPageInDarkMode();
};

// Add this CSS to handle placeholders specifically
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .dark-placeholder::placeholder {
      color: #818384 !important;
      opacity: 1 !important;
    }
  </style>
`);

// Fix profile page elements in dark mode
function fixProfilePageInDarkMode() {
    const isDarkMode = document.body.classList.contains('dark-mode');

    // Fix the edit profile modal
    const customModalContent = document.querySelector('.custom-modal-content');
    if (customModalContent) {
        customModalContent.style.backgroundColor = isDarkMode ? '#1A1A1B' : '#fff';
        customModalContent.style.color = isDarkMode ? '#D7DADC' : '#1c1c1c';
        customModalContent.style.borderColor = isDarkMode ? '#343536' : '#dee2e6';
    }

    // Fix form elements
    const formControls = document.querySelectorAll('#editProfileForm .form-control, #editProfileForm input, #editProfileForm textarea');
    formControls.forEach(control => {
        if (control) {
            control.style.backgroundColor = isDarkMode ? '#2D2D2D' : '#fff';
            control.style.color = isDarkMode ? '#D7DADC' : '#1c1c1c';
            control.style.borderColor = isDarkMode ? '#343536' : '#ced4da';
        }
    });

    // Fix labels
    const formLabels = document.querySelectorAll('#editProfileForm label');
    formLabels.forEach(label => {
        if (label) {
            label.style.color = isDarkMode ? '#D7DADC' : '#212529';
        }
    });

    // Fix buttons
    const cancelButton = document.querySelector('.btn-secondary');
    if (cancelButton) {
        cancelButton.style.backgroundColor = isDarkMode ? '#3A3A3C' : '#6c757d';
        cancelButton.style.color = isDarkMode ? '#D7DADC' : '#fff';
        cancelButton.style.borderColor = isDarkMode ? '#343536' : '#6c757d';
    }

    // Fix profile header
    const profileHeader = document.querySelector('.profile-header');
    if (profileHeader) {
        profileHeader.style.backgroundColor = isDarkMode ? '#1A1A1B' : '#fff';
        profileHeader.style.borderColor = isDarkMode ? '#343536' : '#eee';
    }

    // Fix profile banner
    const profileBanner = document.querySelector('.profile-banner');
    if (profileBanner) {
        profileBanner.style.backgroundColor = isDarkMode ? '#dc3545' : '#dc3545';
    }

    // Fix profile name and bio
    const profileName = document.getElementById('profileName');
    if (profileName) {
        profileName.style.color = isDarkMode ? '#D7DADC' : '#1c1c1c';
    }

    const profileBio = document.getElementById('profileBio');
    if (profileBio) {
        profileBio.style.color = isDarkMode ? '#818384' : '#6c757d';
    }

    // Fix the stats section
    const statsSection = document.querySelectorAll('.profile-stats div');
    statsSection.forEach(div => {
        if (div && !div.classList.contains('text-muted')) {
            div.style.color = isDarkMode ? '#D7DADC' : '#1c1c1c';
        }
    });

    const statsMuted = document.querySelectorAll('.profile-stats .text-muted');
    statsMuted.forEach(element => {
        if (element) {
            element.style.color = isDarkMode ? '#818384' : '#6c757d';
        }
    });

    // Fix tabs
    const tabs = document.querySelectorAll('.nav-tabs .nav-link');
    tabs.forEach(tab => {
        if (tab) {
            tab.style.color = isDarkMode ? '#818384' : '#495057';

            if (tab.classList.contains('active')) {
                tab.style.color = isDarkMode ? '#dc3545' : '#dc3545';
                tab.style.borderBottomColor = isDarkMode ? '#dc3545' : '#dc3545';
            }
        }
    });

    // Fix comments
    const commentItems = document.querySelectorAll('.comment-item');
    commentItems.forEach(item => {
        if (item) {
            item.style.backgroundColor = isDarkMode ? '#1A1A1B' : '#fff';
            item.style.borderColor = isDarkMode ? '#343536' : '#eaecef';
        }
    });

    const originalPostPreviews = document.querySelectorAll('.original-post-preview');
    originalPostPreviews.forEach(preview => {
        if (preview) {
            preview.style.backgroundColor = isDarkMode ? '#2D2D2D' : '#f7f9fa';
            preview.style.borderLeftColor = isDarkMode ? '#4A4A4C' : '#e1e4e8';
        }
    });

    // Fix notification alerts
    const alerts = document.querySelectorAll('.alert-success');
    alerts.forEach(alert => {
        if (alert) {
            alert.style.backgroundColor = isDarkMode ? '#0F3B2C' : '#d4edda';
            alert.style.color = isDarkMode ? '#4AD295' : '#155724';
            alert.style.borderColor = isDarkMode ? '#176644' : '#c3e6cb';
        }
    });
}

// Update the toggleDarkMode function to include the profile page fix
function toggleDarkMode(enable) {
    if (enable) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
    }

    // Update all toggles
    updateDarkModeToggles(enable);

    // Fix navbar in dark mode
    fixNavbarInDarkMode();

    // Fix search page UI in dark mode
    fixSearchPageInDarkMode();

    // Fix profile page UI in dark mode
    fixProfilePageInDarkMode();
}

// Add this function to handle modal stack and z-index issues
function handleModalStack() {
    // Get all open modals
    const customEditModal = document.getElementById('customEditModal');
    const settingsOverlay = document.getElementById('settingsOverlay');

    // If both are open, ensure proper z-index order
    if (customEditModal && settingsOverlay) {
        // Check if edit profile modal is open
        if (customEditModal.style.display === 'block') {
            // When edit modal is open, make sure settings panel can still be opened
            // by properly closing the edit modal first
            const editProfileBtn = document.getElementById('editProfileBtn');
            if (editProfileBtn) {
                const originalEditFn = editProfileBtn.onclick;
                editProfileBtn.onclick = function () {
                    // Close any open settings panel first
                    if (settingsOverlay.style.display === 'flex') {
                        settingsOverlay.style.display = 'none';
                        document.body.style.overflow = 'auto';
                    }

                    // Then proceed with original click handler
                    if (originalEditFn) originalEditFn.call(this);
                };
            }
        }
    }

    // Make sure clicking Open Settings Panel closes any open edit profile modal
    const openSettingsBtn = document.getElementById('openSettings');
    if (openSettingsBtn && customEditModal) {
        const originalOpenFn = openSettingsBtn.onclick;
        openSettingsBtn.onclick = function (e) {
            // Close edit profile modal if open
            if (customEditModal.style.display === 'block') {
                customEditModal.style.display = 'none';

                // If profilePage object exists, call its closeEditModal function
                if (window.profilePage && typeof window.profilePage.closeEditModal === 'function') {
                    window.profilePage.closeEditModal();
                }
            }

            // Continue with original click handler
            if (originalOpenFn) originalOpenFn.call(this, e);
            else {
                // Default handler if original was not found
                if (settingsOverlay) {
                    settingsOverlay.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            }

            // Prevent event from continuing (stops propagation)
            e.stopPropagation();
        };
    }
}

// Update window.setupDarkModeAfterPageLoad to include modal stack handling
window.setupDarkModeAfterPageLoad = function () {
    setupDarkModeListeners();
    updateDarkModeToggles(localStorage.getItem('darkMode') === 'enabled');
    fixNavbarInDarkMode();
    fixSearchPageInDarkMode();
    fixProfilePageInDarkMode();
    handleModalStack(); // Add this line
};