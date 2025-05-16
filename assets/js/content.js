// content.js - Script to make posts clickable throughout the application

// Immediately execute this anonymous function to ensure it runs
(function () {
    console.log("Content script loaded");

    // Apply clickable behavior immediately
    makePostsClickable();

    // And also when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function () {
        console.log("DOM loaded - applying clickable behavior to posts");
        makePostsClickable();

        // Try again after a delay to ensure all content is rendered
        setTimeout(makePostsClickable, 500);

        // If the page is dynamically loaded, we need to apply this when the page content changes
        observePageContentChanges();
    });
})();

// Make social posts clickable
function makePostsClickable() {
    console.log("Making posts clickable...");

    // Find all social posts on the page
    const socialPosts = document.querySelectorAll('.social-post');
    console.log(`Found ${socialPosts.length} posts`);

    socialPosts.forEach((post, index) => {
        // Skip if it's a reposted content within another post
        if (post.closest('.reposted-content')) {
            return;
        }

        // Assign an ID if it doesn't have one
        if (!post.dataset.postId) {
            post.dataset.postId = index + 1;
        }

        // Remove any existing click listeners to prevent duplicates
        post.removeEventListener('click', postClickHandler);

        // Add the new click listener
        post.addEventListener('click', postClickHandler);

        // Add hover effect to indicate clickability
        post.style.cursor = 'pointer';

        // Add a visual class for hover effect
        post.classList.add('clickable-post');

        console.log(`Made post ${post.dataset.postId} clickable`);
    });

    // Add event listeners for post action buttons
    setupActionButtons();
}

// Handler function for post clicks
function postClickHandler(event) {
    // If the click came from an action button or media element, do nothing
    if (
        event.target.closest('.post-actions') ||
        event.target.closest('.video-placeholder') ||
        event.target.closest('.post-options') ||
        event.target.closest('video') ||
        event.target.tagName === 'A' ||
        event.target.tagName === 'BUTTON'
    ) {
        console.log('Click was on an action element - ignoring');
        return;
    }

    // Get the post ID
    const post = this;
    const postId = post.dataset.postId;
    console.log(`Post ${postId} clicked - navigating to comment page`);

    // Navigate to comment page
    loadPage('comment', postId);

    // Prevent the click from triggering other elements
    event.preventDefault();
    event.stopPropagation();
}

// Setup event listeners for like, comment, etc. buttons
function setupActionButtons() {
    // Like buttons
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            // Prevent the click from bubbling up to the post
            event.stopPropagation();
        });
    });

    // Comment buttons
    document.querySelectorAll('.comment-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            // Get the post ID
            const post = this.closest('.social-post');
            if (post) {
                const postId = post.dataset.postId;

                // Navigate to comment page and focus on comment box
                loadPage('comment', postId);

                // We'll focus on the comment box after the page loads
                localStorage.setItem('focusCommentBox', 'true');

                // Prevent the click from bubbling up to the post
                event.stopPropagation();
            }
        });
    });

    // Repost buttons
    document.querySelectorAll('.repost-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            // Prevent the click from bubbling up to the post
            event.stopPropagation();
        });
    });

    // Share buttons
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            // Prevent the click from bubbling up to the post
            event.stopPropagation();
        });
    });

    // Save buttons
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            // Prevent the click from bubbling up to the post
            event.stopPropagation();
        });
    });

    // Post options
    document.querySelectorAll('.post-options').forEach(button => {
        button.addEventListener('click', function (event) {
            // Prevent the click from bubbling up to the post
            event.stopPropagation();
        });
    });
}

// Observe changes to the page content
function observePageContentChanges() {
    // Get the page content container
    const pageContent = document.getElementById('page-content');

    // Create a MutationObserver
    const observer = new MutationObserver(function (mutations) {
        // When the content changes, apply our clickable behavior
        console.log("Page content changed - reapplying clickable behavior");
        setTimeout(makePostsClickable, 200);
    });

    // Start observing the page content for changes
    if (pageContent) {
        observer.observe(pageContent, { childList: true });
        console.log("Now observing page content for changes");
    }
}

// Add event listener for video playback
function playVideo(videoId) {
    const video = document.getElementById(videoId);
    const placeholder = video.parentElement.querySelector('.video-placeholder');

    if (video && placeholder) {
        // Hide the placeholder
        placeholder.style.display = 'none';

        // Show the video
        video.style.display = 'block';

        // Play the video
        video.play();
    }
}

// Update the window object to make functions available globally
window.makePostsClickable = makePostsClickable;
window.playVideo = playVideo;