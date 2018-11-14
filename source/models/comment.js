// comment.js;
// our Comment model

import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true},
    author: { type: Schema.Types.ObjectId, ref: "User", required: true},
    content: { type: String, required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Comment" },
    children: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment;
