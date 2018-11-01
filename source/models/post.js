// post.js
// our Post model

import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    summary: { type: String, required: true }
}, { timestamps: true });

const Post = mongoose.model('Post', PostSchema);
export default Post;
