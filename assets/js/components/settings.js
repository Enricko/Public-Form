/**
 * @file components/settings.js
 * Settings panel functionality
 */

// Initialize settings panel
export function initSettingsPanel() {
    // Only initialize if settings panel exists
    const settingsOverlay = document.getElementById('settingsOverlay');
    if (!settingsOverlay) return;

    const openSettingsBtn = document.getElementById('openSettings');
    const closeSettingsBtn = document.getElementById('closeSettings');
    const settingsForm = document.getElementById('settingsForm');
    const successMessage = document.getElementById('settingsSuccessMessage');

    // Open settings popup
    if (openSettingsBtn && !openSettingsBtn.hasAttribute('data-initialized')) {
        openSettingsBtn.setAttribute('data-initialized', 'true');
        openSettingsBtn.addEventListener('click', function (e) {
            e.stopPropagation();

            // Close any open modals first
            const customEditModal = document.getElementById('customEditModal');
            if (customEditModal && customEditModal.style.display === 'block') {
                customEditModal.style.display = 'none';

                // If profilePage object exists, call its closeEditModal function
                if (window.profilePage && typeof window.profilePage.closeEditModal === 'function') {
                    window.profilePage.closeEditModal();
                }
            }

            // Now show settings overlay
            settingsOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling behind overlay
        }, true); // Use capturing phase to ensure this listener runs first
    }

    // Close settings popup
    if (closeSettingsBtn && !closeSettingsBtn.hasAttribute('data-initialized')) {
        closeSettingsBtn.setAttribute('data-initialized', 'true');
        closeSettingsBtn.addEventListener('click', function () {
            settingsOverlay.style.display = 'none';
            document.body.style.overflow = 'auto'; // Re-enable scrolling
            if (successMessage) successMessage.style.display = 'none'; // Hide success message if visible
        });
    }

    // Close popup when clicking outside of it
    if (!settingsOverlay.hasAttribute('data-initialized')) {
        settingsOverlay.setAttribute('data-initialized', 'true');
        settingsOverlay.addEventListener('click', function (e) {
            if (e.target === settingsOverlay) {
                settingsOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
                if (successMessage) successMessage.style.display = 'none';
            }
        });
    }

    // Handle form submission
    if (settingsForm && !settingsForm.hasAttribute('data-initialized')) {
        settingsForm.setAttribute('data-initialized', 'true');
        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent form submission

            // Simple validation for email and password fields
            const email = document.getElementById('changeEmail')?.value;
            const password = document.getElementById('changePassword')?.value;

            // Simulate saving settings (replace with real API call)
            setTimeout(() => {
                if (successMessage) successMessage.style.display = 'block';

                // Auto-hide success message after 3 seconds
                setTimeout(() => {
                    if (successMessage) successMessage.style.display = 'none';
                }, 3000);
            }, 1000);
        });
    }

    // Call the function to set up dark mode listeners after the page loads
    import('../features/dark-mode.js').then(module => {
        if (module.setupDarkModeAfterPageLoad) {
            module.setupDarkModeAfterPageLoad();
        }
    });
}