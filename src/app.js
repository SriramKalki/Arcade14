const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// MongoDB connection
mongoose.connect('mongodb://localhost/blog-app', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// BlogPost model
const blogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    date: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/posts', async (req, res) => {
    const blogPost = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author
    });

    try {
        const savedPost = await blogPost.save();
        res.status(201).send(savedPost);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get('/posts', async (req, res) => {
    try {
        const posts = await BlogPost.find();
        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.put('/posts/:id', async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!post) {
            return res.status(404).send();
        }
        res.status(200).send(post);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/posts/:id', async (req, res) => {
    try {
        const post = await BlogPost.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).send();
        }
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
