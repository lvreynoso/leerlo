"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _post = _interopRequireDefault(require("../models/post.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// subleerlos.js
// app
const subleerlos = _express.default.Router(); // models


// show one subleerlo
subleerlos.get(`/:subleerlo`, async (req, res) => {
  const currentUser = req.user;
  const query = {
    subleerlo: req.params.subleerlo
  };
  const posts = await _post.default.find(query).catch(err => {
    console.log(err);
  });
  res.render(`posts-index`, {
    posts,
    currentUser
  });
});
var _default = subleerlos;
exports.default = _default;
//# sourceMappingURL=subleerlos.js.map