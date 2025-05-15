/**
 * @file core/dom-utils.js
 * Utilities for DOM manipulation and script execution
 */

// A safer script execution function that creates a unique scope for each script
export function executeScriptsWithScope(container) {
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

// Legacy version for compatibility
export function executeScripts(html, targetElement) {
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

// Emergency fix for stuck modals
export function fixStuckModals() {
    // Check if a modal is currently displayed
    const visibleModal = document.getElementById('customEditModal');
    if (visibleModal && visibleModal.style.display === 'block') {
        console.log("Found stuck modal, applying emergency fix");

        // Force close the modal
        visibleModal.style.display = 'none';

        // Re-enable scrolling
        document.body.style.overflow = 'auto';

        // Add a new close button functionality to ensure closing works in the future
        const closeButtons = document.querySelectorAll('.custom-close');
        closeButtons.forEach(button => {
            // Remove existing event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);

            // Add new reliable event listener
            newButton.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();

                const modal = document.getElementById('customEditModal');
                if (modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }

                return false;
            }, true);
        });

        // Add click-outside functionality
        visibleModal.addEventListener('click', function (event) {
            if (event.target === this) {
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }, true);
    }
}

// Add ESC key support to close any open modal
export function setupModalKeyboardControls() {
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') {
            const customModal = document.getElementById('customEditModal');
            if (customModal && customModal.style.display === 'block') {
                customModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }

            const settingsOverlay = document.getElementById('settingsOverlay');
            if (settingsOverlay && settingsOverlay.style.display === 'flex') {
                settingsOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
    });
}