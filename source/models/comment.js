// comment.j;
// our Comment model

import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User", required: true},
    content: { type: String, required: true }
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
