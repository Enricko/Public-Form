/**
 * @file features/profile.js
 * Profile page functionality
 */

// Function to open the edit modal
export function openEditModal() {
    const modal = document.getElementById("customEditModal");
    if (!modal) return;

    console.log("Opening edit modal");

    // Close any open settings panel first
    const settingsOverlay = document.getElementById('settingsOverlay');
    if (settingsOverlay && settingsOverlay.style.display === 'flex') {
        settingsOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Hide any visible success message
        const successMessage = document.getElementById('settingsSuccessMessage');
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }

    // Now open the edit modal
    modal.style.display = "block";

    // Set proper display mode
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

    // Update dark mode styling
    import('./dark-mode.js').then(module => {
        if (module.fixProfilePageInDarkMode) {
            module.fixProfilePageInDarkMode();
        }
    });
}

// Function to close the edit modal
export function closeEditModal() {
    console.log("Closing edit modal");
    const modal = document.getElementById("customEditModal");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Function to switch tabs
export function switchTab(tabId) {
    console.log("Switching to tab:", tabId);

    // Remove active class from all tab buttons
    var tabButtons = document.querySelectorAll(".nav-tabs .nav-link");
    tabButtons.forEach(function (button) {
        button.classList.remove("active");
    });

    // Add active class to the clicked tab button
    document.getElementById(tabId + "-tab").classList.add("active");

    // Hide all tab panes
    var tabPanes = document.querySelectorAll(".tab-pane");
    tabPanes.forEach(function (pane) {
        pane.classList.remove("show");
        pane.classList.remove("active");
    });

    // Show the selected tab pane
    var selectedPane = document.getElementById(tabId);
    selectedPane.classList.add("fade");
    selectedPane.classList.add("show");
    selectedPane.classList.add("active");
}

// Function to preview the selected image
export function previewImage(input) {
    console.log("Previewing image");
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            document.getElementById("previewAvatar").src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
    }
}

// Function to save profile changes
export function saveProfile() {
    console.log("Saving profile");

    // Get form values
    var displayName = document.getElementById("displayName").value;
    var bioMe = document.getElementById("bioMe").value;

    // Update profile info
    document.getElementById("profileName").textContent = displayName;
    document.getElementById("profileBio").textContent = bioMe;

    // Update avatar if changed
    var previewAvatar = document.getElementById("previewAvatar");
    if (previewAvatar.src !== "../assets/images/post.jpg") {
        document.getElementById("profileAvatar").src = previewAvatar.src;
    }

    // Close modal
    closeEditModal();

    // Show notification
    showNotification();
}

// Function to show notification
export function showNotification() {
    console.log("Showing notification");
    var notificationArea = document.getElementById("notificationArea");
    if (!notificationArea) return;

    notificationArea.innerHTML = "";

    var alertHTML = `
    <div class="alert alert-success">
      <i class="fas fa-check-circle me-2"></i>
      Profile updated successfully!
      <button type="button" class="btn-close" onclick="this.parentNode.style.display='none'"></button>
    </div>
  `;

    notificationArea.innerHTML = alertHTML;

    // Auto dismiss after 5 seconds
    setTimeout(function () {
        var alert = notificationArea.querySelector(".alert");
        if (alert) {
            alert.style.display = "none";
        }
    }, 5000);
}

// Initialize the profile page
export function initProfile() {
    console.log("Initializing profile page");

    // Close modal when clicking outside of it
    const customEditModal = document.getElementById("customEditModal");
    if (customEditModal) {
        customEditModal.addEventListener("click", function (event) {
            if (event.target === this) {
                closeEditModal();
            }
        });
    }

    // Set up profile edit button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn && !editProfileBtn.hasAttribute('data-initialized')) {
        editProfileBtn.setAttribute('data-initialized', 'true');
        editProfileBtn.addEventListener('click', function () {
            openEditModal();
        });
    }

    // Video player functionality
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function () {
            const videoId = this.getAttribute('data-video-id') ||
                this.closest('.video-container').querySelector('.video-element').id;
            if (videoId) {
                window.playVideo(videoId);
            }
        });
    });

    // Add playVideo to window object
    window.playVideo = function (videoId) {
        const video = document.getElementById(videoId);
        const placeholder = video.parentNode.querySelector(".video-placeholder");

        if (video && placeholder) {
            video.style.display = "block";
            placeholder.style.display = "none";
            video.play();
        }
    };

    // Load the first frame of videos to use as thumbnail
    const thumbnailVideos = document.querySelectorAll(".video-thumbnail-source");
    thumbnailVideos.forEach((video) => {
        // Load just enough of the video to show the first frame
        video.addEventListener("loadeddata", function () {
            // Pause immediately to just show the first frame
            this.currentTime = 0.1; // Small offset to ensure we get a frame
            this.pause();
        });

        // Make sure it's muted
        video.muted = true;
        video.preload = "metadata";
        // Start loading
        video.load();
    });

    // Handle video end event to show placeholder again
    const videos = document.querySelectorAll(".video-element");
    videos.forEach((video) => {
        video.addEventListener("ended", function () {
            this.style.display = "none";
            const placeholder =
                this.parentNode.querySelector(".video-placeholder");
            if (placeholder) {
                placeholder.style.display = "block";
            }
        });
    });

    // Initialize interaction buttons
    initInteractionButtons();

    console.log("Profile page initialized");
}

// Helper function to initialize post interaction buttons
function initInteractionButtons() {
    // Helper function for interactions
    function handleInteraction(button, type) {
        if (type === "like" || type === "save") {
            button.classList.toggle("active");

            // Update icon if needed
            const icon = button.querySelector("i");
            if (type === "like") {
                if (button.classList.contains("active")) {
                    icon.className = "fas fa-heart";
                    // Optionally increment counter
                    const counter = button.querySelector("span");
                    if (counter) {
                        counter.textContent = parseInt(counter.textContent) + 1;
                    }
                } else {
                    icon.className = "far fa-heart";
                    // Optionally decrement counter
                    const counter = button.querySelector("span");
                    if (counter) {
                        counter.textContent = parseInt(counter.textContent) - 1;
                    }
                }
            } else if (type === "save") {
                if (button.classList.contains("active")) {
                    icon.className = "fas fa-bookmark";
                } else {
                    icon.className = "far fa-bookmark";
                }
            }
        }

        console.log(`${type} button clicked`);
    }

    // Attach event listeners to interaction buttons
    const likeButtons = document.querySelectorAll(".like-btn");
    likeButtons.forEach((button) => {
        if (!button.hasAttribute('data-initialized')) {
            button.setAttribute('data-initialized', 'true');
            button.addEventListener("click", function () {
                handleInteraction(this, "like");
            });
        }
    });

    // Comment buttons
    const commentButtons = document.querySelectorAll(".comment-btn");
    commentButtons.forEach((button) => {
        if (!button.hasAttribute('data-initialized')) {
            button.setAttribute('data-initialized', 'true');
            button.addEventListener("click", function () {
                handleInteraction(this, "comment");
            });
        }
    });

    // Repost buttons
    const repostButtons = document.querySelectorAll(".repost-btn");
    repostButtons.forEach((button) => {
        if (!button.hasAttribute('data-initialized')) {
            button.setAttribute('data-initialized', 'true');
            button.addEventListener("click", function () {
                handleInteraction(this, "repost");
            });
        }
    });

    // Share buttons
    const shareButtons = document.querySelectorAll(".share-btn");
    shareButtons.forEach((button) => {
        if (!button.hasAttribute('data-initialized')) {
            button.setAttribute('data-initialized', 'true');
            button.addEventListener("click", function () {
                handleInteraction(this, "share");
            });
        }
    });

    // Save buttons
    const saveButtons = document.querySelectorAll(".save-btn");
    saveButtons.forEach((button) => {
        if (!button.hasAttribute('data-initialized')) {
            button.setAttribute('data-initialized', 'true');
            button.addEventListener("click", function () {
                handleInteraction(this, "save");
            });
        }
    });
}

// Expose profile page object to window
if (!window.profilePage) {
    window.profilePage = {
        openEditModal,
        closeEditModal,
        switchTab,
        previewImage,
        saveProfile,
        showNotification,
        init: initProfile
    };
}