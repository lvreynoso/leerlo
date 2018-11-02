// comment.j;
// our Comment model

import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: { type: String, required: true }
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
