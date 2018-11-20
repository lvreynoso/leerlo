// post.js
// our Post model

import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    subleerlo: { type: String, required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    summary: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true},
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
}, { timestamps: true });

PostSchema.virtual('score').get(function () {
    return this.upvotes - this.downvotes;
})

const Post = mongoose.model('Post', PostSchema);
export default Post;
