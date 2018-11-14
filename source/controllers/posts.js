// posts.js

// app
import express from 'express'
const posts = express.Router()

// model
import Post from '../models/post.js'
import User from '../models/user.js'
import Comment from '../models/comment.js'

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
            // .populate({
            //     path: `comments`,
            //     populate: { path: `author` }
            // })
            .populate(`author`)
            .catch(err => console.log(err))
        // get root comments
        const comments = []
        for (let i = 0; i < post.comments.length; i++) {
            const rootComment = await Comment.findById(post.comments[i])
                .populate(`author`)
                .catch(err => { console.log(err) })
            comments.push(rootComment)
        }
        // get replies for each comment
        for (let i = 0; i < comments.length; i++) {
            comments[i] = await populateChildren(comments[i])
        }
        res.render(`posts-show`, { post, comments, currentUser });
    }

    // recursively populate the comment tree LOL
    // poor database :( hope it can handle the load
    async function populateChildren(inputComment) {
        let outputComment = inputComment
        for (let i = 0; i < inputComment.children.length; i++) {
            let childComment = await Comment.findById(inputComment.children[i])
                .populate(`author`)
                .catch(err => { console.log(err) })
            if (childComment.children.length > 0) {
                childComment = await populateChildren(childComment)
            }
            outputComment.children[i] = childComment
        }
        return outputComment
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
