document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('post-form');
    const postsList = document.getElementById('posts-list');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const authorInput = document.getElementById('author');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = titleInput.value;
        const content = contentInput.value;
        const author = authorInput.value;

        try {
            const response = await fetch('/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, content, author })
            });
            const post = await response.json();
            addPostToList(post);
            titleInput.value = '';
            contentInput.value = '';
            authorInput.value = '';
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function fetchPosts() {
        try {
            const response = await fetch('/posts');
            const posts = await response.json();
            posts.forEach(post => addPostToList(post));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function addPostToList(post) {
        const li = document.createElement('li');
        li.textContent = `${post.title} by ${post.author}`;
        postsList.appendChild(li);
    }

    fetchPosts();
});
