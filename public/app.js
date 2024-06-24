document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('post-form');
    const postsList = document.getElementById('posts-list');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const authorInput = document.getElementById('author');

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
        li.innerHTML = `
            <span>${post.title} by ${post.author}</span>
            <button class="edit" data-id="${post._id}">Edit</button>
            <button class="delete" data-id="${post._id}">Delete</button>
        `;

        const editButton = li.querySelector('.edit');
        const deleteButton = li.querySelector('.delete');

        editButton.addEventListener('click', () => {
            titleInput.value = post.title;
            contentInput.value = post.content;
            authorInput.value = post.author;
            form.dataset.id = post._id;
        });

        deleteButton.addEventListener('click', async () => {
            try {
                await fetch(`/posts/${post._id}`, { method: 'DELETE' });
                li.remove();
            } catch (error) {
                console.error('Error:', error);
            }
        });

        postsList.appendChild(li);
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = titleInput.value;
        const content = contentInput.value;
        const author = authorInput.value;
        const id = form.dataset.id;

        if (id) {
            try {
                const response = await fetch(`/posts/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content, author })
                });
                const updatedPost = await response.json();
                document.querySelector(`button.edit[data-id="${id}"]`).parentElement.querySelector('span').textContent = `${updatedPost.title} by ${updatedPost.author}`;
                form.removeAttribute('data-id');
                titleInput.value = '';
                contentInput.value = '';
                authorInput.value = '';
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            try {
                const response = await fetch('/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title, content, author })
                });
                const newPost = await response.json();
                addPostToList(newPost);
                titleInput.value = '';
                contentInput.value = '';
                authorInput.value = '';
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    fetchPosts();
});
