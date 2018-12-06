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
        // get the post
        const post = await Post.findById(req.params.id)
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
    // TODO: Replace this with something like Edwin's 'pre' hook
    // then again, you could modify this to limit the number of comments
    // fetched to a certain level of nesting
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
    // console.log(req.user);
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

// upvote a post
posts.put(`/:id/vote-up`, async (req, res) => {
    const post = await Post.findById(req.params.id).catch(err => { console.log(err) })
    const user = await User.findById(req.user._id).catch(err => { console.log(err) })
    let previousVote = null;
    if (user.votes.get(req.params.id) != undefined) {
        previousVote = user.votes.get(req.params.id)
    }
    switch (previousVote) {
        // there's already an upvote, do nothing
        case true:
            break;
        // there's a downvote
        case false:
            user.votes.set(req.params.id, true)
            post.downvotes -= 1
            post.upvotes += 1
            break;
        // there's nothing there
        default:
            user.votes.set(req.params.id, true)
            post.upvotes += 1
    }
    await post.save()
    await user.save()
    res.status(200).send({
        previousVote: previousVote
    })
})

// downvote a post
posts.put(`/:id/vote-down`, async (req, res) => {
    const post = await Post.findById(req.params.id).catch(err => { console.log(err) })
    const user = await User.findById(req.user._id).catch(err => { console.log(err) })
    let previousVote = null;
    if (user.votes.get(req.params.id) != undefined) {
        previousVote = user.votes.get(req.params.id)
    }
    switch (previousVote) {
        // there's an upvote
        case true:
            user.votes.set(req.params.id, false)
            post.downvotes += 1
            post.upvotes -= 1
            break;
        // there's a downvote, do nothing
        case false:
            break;
        // there's nothing there
        default:
            user.votes.set(req.params.id, false)
            post.downvotes += 1
    }
    await post.save()
    await user.save()
    res.status(200).send({
        previousVote: previousVote
    })
})

export default posts;
