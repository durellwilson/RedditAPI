document.addEventListener('DOMContentLoaded', () => {
    const postsContainer = document.getElementById('posts');
    const loadPostsButton = document.getElementById('loadPosts');
    const subredditInput = document.getElementById('subreddit');
    const topSubredditLinks = document.querySelectorAll('#top-subreddits a');

    const fetchPosts = (subreddit) => {
        loadingSpinner.style.display = 'block'; // Show spinner
        fetch(`https://www.reddit.com/r/${subreddit}/.json`)
        .then(response => response.json())
        .then(data => {
                postsContainer.innerHTML = ''; // Clear previous posts
                const posts = data.data.children.slice(0, 10); // Limit to first 10 posts
            posts.forEach(post => {
                const postData = post.data;
                const postElement = document.createElement('div');
                postElement.classList.add('post');

                const postTitle = document.createElement('h2');
                postTitle.textContent = postData.title;

                const postImage = document.createElement('img');
                    if (postData.thumbnail && postData.thumbnail !== 'self' && postData.thumbnail.startsWith('http')) {
                        postImage.src = postData.thumbnail;
                    }

                const postLink = document.createElement('a');
                postLink.href = `https://www.reddit.com${postData.permalink}`;
                postLink.textContent = 'View Post';
                postLink.target = '_blank';

                postElement.appendChild(postTitle);
                if (postImage.src) postElement.appendChild(postImage);
                postElement.appendChild(postLink);

                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => console.error('Error fetching data:', error))
        .finally(() => {
            loadingSpinner.style.display = 'none'; // Hide spinner
        });
    };

    loadPostsButton.addEventListener('click', () => {
        const subreddit = subredditInput.value.trim();
        if (subreddit) {
            fetchPosts(subreddit);
        }
});

    topSubredditLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const subreddit = event.target.getAttribute('data-subreddit');
            subredditInput.value = subreddit;
            fetchPosts(subreddit);
});
    });

    // Load default subreddit on initial load
    fetchPosts(subredditInput.value);
});