"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _comment = _interopRequireDefault(require("../models/comment.js"));

var _post = _interopRequireDefault(require("../models/post.js"));

var _user = _interopRequireDefault(require("../models/user.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// comments.js
// app
const comments = _express.default.Router(); // models


// create comment
comments.post(`/`, async (req, res) => {
  // save the comment to the db
  const comment = new _comment.default(req.body);
  comment.author = req.user._id;
  const savedComment = await comment.save().catch(err => {
    console.log(err);
  }); // add it to the parent post

  const parentPost = await _post.default.findById(req.body.post).catch(err => {
    console.log(err);
  });
  parentPost.comments.unshift(savedComment);
  const result = await parentPost.save().catch(err => {
    console.log(err);
  }); // add it to the user's profile

  const user = await _user.default.findById(req.user._id).catch(err => {
    console.log(err);
  });
  user.comments.unshift(comment);
  const savedUser = await user.save().catch(err => {
    console.log(err);
  });
  res.redirect(`/posts/${req.body.post}`);
}); // get new reply form

comments.get(`/:commentId/replies/new`, async (req, res) => {
  const comment = await _comment.default.findById(req.params.commentId);
  res.render(`replies-new`, {
    comment: comment
  });
}); // create reply

comments.post(`/:commentId/replies`, async (req, res) => {
  const reply = new _comment.default(req.body);
  reply.author = req.user._id;
  const savedReply = await reply.save().catch(err => {
    console.log(err);
  });
  const parentComment = await _comment.default.findById(req.params.commentId).catch(err => {
    console.log(err);
  });
  parentComment.children.unshift(savedReply._id);
  const result = await parentComment.save().catch(err => {
    console.log(err);
  });
  res.redirect(`/posts/${req.body.post}`);
});
var _default = comments;
exports.default = _default;
//# sourceMappingURL=comments.js.map