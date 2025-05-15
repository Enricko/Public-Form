/**
 * @file components/modal.js
 * Modal handling functionality
 */

import * as profileModule from '../features/profile.js';

// Fix for the profilePage object if missing
if (!window.profilePage) {
    window.profilePage = {
        closeEditModal: function () {
            const modal = document.getElementById('customEditModal');
            if (modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        },

        openEditModal: function () {
            const modal = document.getElementById('customEditModal');
            if (modal) {
                modal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            }
        },

        // Other functions from the profile page module
        ...profileModule
    };
}

// Custom Modal (Profile Edit) functionality
export function openCustomModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // Set proper display mode
        modal.style.display = "flex";

        // Get the modal dialog
        const modalDialog = modal.querySelector(".custom-modal-dialog");
        const modalContent = modal.querySelector(".custom-modal-content");

        // Reset any inline styles that might be causing problems
        if (modalDialog) {
            modalDialog.style.position = "relative";
            modalDialog.style.width = "100%";
            modalDialog.style.maxWidth = "550px";
            modalDialog.style.margin = "1.75rem auto";
        }

        if (modalContent) {
            modalContent.style.width = "100%";
            modalContent.style.minHeight = "400px";
        }

        // Prevent scrolling behind the modal
        document.body.style.overflow = "hidden";

        // Add click-outside functionality
        modal.addEventListener('click', function (event) {
            if (event.target === this) {
                closeCustomModal(modalId);
            }
        });
    }
}

export function closeCustomModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Bootstrap Modal functionality
export function showBootstrapModal(modalId, callback) {
    // If the modal is already in the DOM, just show it
    if (document.getElementById(modalId)) {
        const modalInstance = new bootstrap.Modal(document.getElementById(modalId));
        modalInstance.show();
        return;
    }

    // Otherwise, load the component first
    import('../core/loader.js').then(module => {
        module.loadComponent(modalId, function () {
            setTimeout(() => {
                const modalEl = document.getElementById(modalId);
                if (modalEl) {
                    const modalInstance = new bootstrap.Modal(modalEl);
                    modalInstance.show();

                    if (callback && typeof callback === 'function') {
                        callback(modalInstance);
                    }
                }
            }, 200);
        });
    });
}

export function hideBootstrapModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (modalEl) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    }
}

// Handle login button click
export function showLoginModal() {
    showBootstrapModal('loginModal');
}

// Handle register button click
export function showRegisterModal() {
    showBootstrapModal('registerModal');
}
// Switch from login to register modal
export function switchToRegister() {
    hideBootstrapModal('loginModal');
    setTimeout(() => {
        showRegisterModal();
    }, 300);
}

// Switch from register to login modal
export function switchToLogin() {
    hideBootstrapModal('registerModal');
    setTimeout(() => {
        showLoginModal();
    }, 300);
}

// Initialize modal keyboard controls
export function initModalKeyboardControls() {
    // Add ESC key support to close any open modal
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const customModal = document.getElementById('customEditModal');
            if (customModal && customModal.style.display === 'block') {
                closeCustomModal('customEditModal');
            }

            const settingsOverlay = document.getElementById('settingsOverlay');
            if (settingsOverlay && settingsOverlay.style.display === 'flex') {
                settingsOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }

            // Close any bootstrap modals
            const bootstrapModals = document.querySelectorAll('.modal.show');
            bootstrapModals.forEach(modal => {
                const modalInstance = bootstrap.Modal.getInstance(modal);
                if (modalInstance) {
                    modalInstance.hide();
                }
            });
        }
    });
}

// Initialize all modal functionality
export function initModals() {
    initModalKeyboardControls();

    // Expose global functions for backward compatibility
    window.showLoginModal = showLoginModal;
    window.showRegisterModal = showRegisterModal;
    window.hideLoginModal = () => hideBootstrapModal('loginModal');
    window.hideRegisterModal = () => hideBootstrapModal('registerModal');
    window.switchToRegister = switchToRegister;
    window.switchToLogin = switchToLogin;
}