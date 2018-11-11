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
    const parentPost = await Post.findById(req.body.postId).catch(err => { console.log(err) });
    parentPost.comments.unshift(savedComment);
    const result = await parentPost.save().catch(err => { console.log(err) });
    // add it to the user's profile
    const user = await User.findById(req.user._id).catch(err => { console.log(err) })
    user.comments.unshift(comment)
    const savedUser = await user.save().catch(err => { console.log(err) })
    res.redirect(`/posts/${req.body.postId}`);
})

export default comments;
