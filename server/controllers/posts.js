"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// posts.js
const posts = _express.default.Router();

posts.get('/new', (req, res) => {
  res.render('posts-new');
});
posts.post('/new', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});
var _default = posts;
exports.default = _default;
//# sourceMappingURL=posts.js.map