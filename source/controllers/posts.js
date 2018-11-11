// posts.js

// app
import express from 'express'
const posts = express.Router()

// model
import Post from '../models/post.js'
import User from '../models/user.js'

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
        const post = await Post.findById(req.params.id)
            .populate({
                path: `comments`,
                populate: { path: `author` }
            })
            .populate(`author`)
            .catch(err => console.log(err))
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
    console.log(req.user);
    // save the post
    const post = new Post(req.body)
    post.author = req.user._id;
    const savedPost = await post.save().catch(err => console.log(err))
    // add it to the user's profile
    const user = await User.findById(req.user._id).catch(err => console.log(err))
    user.posts.unshift(post);
    const result = await user.save().catch(err => console.log(err))
    res.redirect(`/`)
})

export default posts;
