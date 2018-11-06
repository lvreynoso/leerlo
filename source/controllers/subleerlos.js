// subleerlos.js

// app
import express from 'express'
const subleerlos = express.Router()

// models
import Post from '../models/post.js'

// show one subleerlo
subleerlos.get(`/:subleerlo`, async (req, res) => {
    const currentUser = req.user;
    const query = {
        subleerlo: req.params.subleerlo
    }
    const posts = await Post.find(query).catch( err => { console.log(err) })
    res.render(`posts-index`, { posts, currentUser })
})

export default subleerlos;
