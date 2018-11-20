"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _post = _interopRequireDefault(require("../models/post.js"));

var _user = _interopRequireDefault(require("../models/user.js"));

var _comment = _interopRequireDefault(require("../models/comment.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// posts.js
// app
const posts = _express.default.Router(); // model


// show all posts
posts.get('/', async (req, res) => {
  const currentUser = req.user;
  const posts = await _post.default.find().catch(err => console.log(err));
  res.render(`posts-index`, {
    posts,
    currentUser
  });
}); // show one post

posts.get('/:id', async (req, res, next) => {
  const currentUser = req.user;

  if (req.params.id == `new`) {
    next();
  } else {
    const post = await _post.default.findById(req.params.id) // .populate({
    //     path: `comments`,
    //     populate: { path: `author` }
    // })
    .populate(`author`).catch(err => console.log(err)); // get root comments

    const comments = [];

    for (let i = 0; i < post.comments.length; i++) {
      const rootComment = await _comment.default.findById(post.comments[i]).populate(`author`).catch(err => {
        console.log(err);
      });
      comments.push(rootComment);
    } // get replies for each comment


    for (let i = 0; i < comments.length; i++) {
      comments[i] = await populateChildren(comments[i]);
    }

    res.render(`posts-show`, {
      post,
      comments,
      currentUser
    });
  } // recursively populate the comment tree LOL
  // poor database :( hope it can handle the load


  async function populateChildren(inputComment) {
    let outputComment = inputComment;

    for (let i = 0; i < inputComment.children.length; i++) {
      let childComment = await _comment.default.findById(inputComment.children[i]).populate(`author`).catch(err => {
        console.log(err);
      });

      if (childComment.children.length > 0) {
        childComment = await populateChildren(childComment);
      }

      outputComment.children[i] = childComment;
    }

    return outputComment;
  }
}); // get new post form

posts.get('/new', (req, res) => {
  const currentUser = req.user;
  res.render('posts-new', {
    currentUser
  });
}); // create new post

posts.post('/', async (req, res) => {
  console.log(req.user); // save the post

  const post = new _post.default(req.body);
  post.author = req.user._id;
  const savedPost = await post.save().catch(err => console.log(err)); // add it to the user's profile

  const user = await _user.default.findById(req.user._id).catch(err => console.log(err));
  user.posts.unshift(post);
  const result = await user.save().catch(err => console.log(err));
  res.redirect(`/`);
});
var _default = posts;
exports.default = _default;
//# sourceMappingURL=posts.js.map