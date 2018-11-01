// posts.js

// app
import express from 'express'
const posts = express.Router()

// model
import Post from '../models/post.js'

// show all posts
posts.get('/', async (req, res) => {
    const posts = await Post.find().catch(err => console.log(err))
    res.render(`posts-index`, { posts });
})

// show one post
posts.get('/:id', async (req, res) => {
    console.log(req.params.id);
    const post = await Post.findById(req.params.id).catch(err => console.log(err))
    res.render(`posts-show`, { post });
})

// get new post form
posts.get('/new', (req, res) => {
    res.render('posts-new')
})

// create new post
posts.post('/', async (req, res) => {
    const post = new Post(req.body)
    const savedPost = await post.save().catch(err => console.log(err))
    console.log(savedPost);
    res.redirect(`/`)
})

export default posts;
