


(function () {
    console.log("Content script loaded");

    
    makePostsClickable();

    
    document.addEventListener('DOMContentLoaded', function () {
        console.log("DOM loaded - applying clickable behavior to posts");
        makePostsClickable();

        
        setTimeout(makePostsClickable, 500);

        
        observePageContentChanges();
    });
})();


function makePostsClickable() {
    console.log("Making posts clickable...");

    
    const socialPosts = document.querySelectorAll('.social-post');
    console.log(`Found ${socialPosts.length} posts`);

    socialPosts.forEach((post, index) => {
        
        if (post.closest('.reposted-content')) {
            return;
        }

        
        if (!post.dataset.postId) {
            post.dataset.postId = index + 1;
        }

        
        post.removeEventListener('click', postClickHandler);

        
        post.addEventListener('click', postClickHandler);

        
        post.style.cursor = 'pointer';

        
        post.classList.add('clickable-post');

        console.log(`Made post ${post.dataset.postId} clickable`);
    });

    
    setupActionButtons();
}


function postClickHandler(event) {
    
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

    
    const post = this;
    const postId = post.dataset.postId;
    console.log(`Post ${postId} clicked - navigating to comment page`);

    
    loadPage('comment', postId);

    
    event.preventDefault();
    event.stopPropagation();
}


function setupActionButtons() {
    
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            
            event.stopPropagation();
        });
    });

    
    document.querySelectorAll('.comment-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            
            const post = this.closest('.social-post');
            if (post) {
                const postId = post.dataset.postId;

                
                loadPage('comment', postId);

                
                localStorage.setItem('focusCommentBox', 'true');

                
                event.stopPropagation();
            }
        });
    });

    
    document.querySelectorAll('.repost-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            
            event.stopPropagation();
        });
    });

    
    document.querySelectorAll('.share-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            
            event.stopPropagation();
        });
    });

    
    document.querySelectorAll('.save-btn').forEach(button => {
        button.addEventListener('click', function (event) {
            
            event.stopPropagation();
        });
    });

    
    document.querySelectorAll('.post-options').forEach(button => {
        button.addEventListener('click', function (event) {
            
            event.stopPropagation();
        });
    });
}


function observePageContentChanges() {
    
    const pageContent = document.getElementById('page-content');

    
    const observer = new MutationObserver(function (mutations) {
        
        console.log("Page content changed - reapplying clickable behavior");
        setTimeout(makePostsClickable, 200);
    });

    
    if (pageContent) {
        observer.observe(pageContent, { childList: true });
        console.log("Now observing page content for changes");
    }
}


function playVideo(videoId) {
    const video = document.getElementById(videoId);
    const placeholder = video.parentElement.querySelector('.video-placeholder');

    if (video && placeholder) {
        
        placeholder.style.display = 'none';

        
        video.style.display = 'block';

        
        video.play();
    }
}


window.makePostsClickable = makePostsClickable;
window.playVideo = playVideo;