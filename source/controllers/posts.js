// posts.js

import express from 'express'
const posts = express.Router()

posts.get('/new', (req, res) => {
    res.render('posts-new')
})

posts.post('/new', (req, res) => {
    console.log(req.body);
    res.redirect('/')
})

export default posts;
