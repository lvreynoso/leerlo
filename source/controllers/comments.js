// comments.js

// app
import express from 'express'
const comments = express.Router()

// models
import Comment from '../models/comment.js'
import Post from '../models/post.js'
import User from '../models/user.js'

// create comment
comments.post(`/`, async (req, res) => {
    // save the comment to the db
    const comment = new Comment(req.body);
    comment.author = req.user._id;
    const savedComment = await comment.save().catch(err => { console.log(err) });
    // add it to the parent post
    const parentPost = await Post.findById(req.body.post).catch(err => { console.log(err) });
    parentPost.comments.unshift(savedComment);
    const result = await parentPost.save().catch(err => { console.log(err) });
    // add it to the user's profile
    const user = await User.findById(req.user._id).catch(err => { console.log(err) })
    user.comments.unshift(comment)
    const savedUser = await user.save().catch(err => { console.log(err) })
    res.redirect(`/posts/${req.body.post}`);
})

// get new reply form
comments.get(`/:commentId/replies/new`, async (req, res) => {
    const comment = await Comment.findById(req.params.commentId)
    res.render(`replies-new`, { comment: comment })
})

// create reply
comments.post(`/:commentId/replies`, async (req, res) => {
    const reply = new Comment(req.body)
    reply.author = req.user._id;
    const savedReply = await reply.save().catch(err => { console.log(err) })

    const parentComment = await Comment.findById(req.params.commentId).catch(err => { console.log(err) })
    parentComment.children.unshift(savedReply._id)
    const result = await parentComment.save().catch(err => { console.log(err) })

    res.redirect(`/posts/${req.body.post}`)
})

export default comments;
