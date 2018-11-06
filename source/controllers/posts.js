// posts.js

// app
import express from 'express'
const posts = express.Router()

// model
import Post from '../models/post.js'

// show all posts
posts.get('/', async (req, res) => {
    const currentUser = req.user;
    const posts = await Post.find().catch(err => console.log(err))
    res.render(`posts-index`, { posts, currentUser });
})

// show one post
posts.get('/:id', async (req, res, next) => {
    const currentUser = req.user;
    if (req.params.id == `new`) {
        next()
    } else {
        const post = await Post.findById(req.params.id).populate(`comments`).catch(err => console.log(err))
        res.render(`posts-show`, { post, currentUser });
    }
})

// get new post form
posts.get('/new', (req, res) => {
    const currentUser = req.user;
    res.render('posts-new', { currentUser });
})

// create new post
posts.post('/', async (req, res) => {
    const post = new Post(req.body)
    const savedPost = await post.save().catch(err => console.log(err))
    console.log(savedPost);
    res.redirect(`/`)
})

export default posts;
