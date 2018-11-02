// comments.js

// app
import express from 'express'
const comments = express.Router()

// models
import Comment from '../models/comment.js'
import Post from '../models/post.js'

// create comment
comments.post(`/`, async (req, res) => {
    console.log(req.body);
    const comment = new Comment(req.body);
    const savedComment = await comment.save().catch(err => { console.log(err) });
    const parentPost = await Post.findById(req.body.postId).catch(err => { console.log(err) });
    parentPost.comments.unshift(savedComment);
    const result = await parentPost.save().catch(err => { console.log(err) });
    res.redirect(`/posts/${req.body.postId}`);
})

export default comments;
