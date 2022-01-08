var express = require('express');
var router = express.Router();
var Version1Comment = require('../models/Comments');
var Version1Book = require('../models/Books');
var auth = require('../middlewares/auth');
const { findById } = require('../models/Books');

// Protecting Route
router.use(auth.verifyToken);

// Add comment
router.post('/add-new-comment/:id', async (req, res, next) => {
  var bookId = req.params.id;
  req.body.bookId = bookId;
  req.body.author = req.user.userId;
  try {
    var comment = await Version1Comment.create(req.body);
    var book = await Version1Book.findByIdAndUpdate(
      bookId,
      {
        $push: { comments: comment._id },
      },
      { new: true }
    );
    res.status(200).json({ book });
  } catch (error) {
    return next(error);
  }
});

// Edit comment
router.put('/edit-comment/:id', async (req, res, next) => {
  var commentId = req.params.id;
  var data = findById(commentId);
  if (req.user.userId === data.author.toString()) {
    try {
      var comment = await Version1Comment.findByIdAndUpdate(
        commentId,
        req.body,
        {
          new: true,
        }
      );
      res.status(200).json({ comment });
    } catch (error) {
      return next(error);
    }
  }
});

// Delete comment
router.delete('/delete-comment/:id', async (req, res, next) => {
  var commentId = req.params.id;
  var data = findById(commentId);
  if (req.user.userId === data.author.toString()) {
    try {
      var comment = await Version1Comment.findByIdAndDelete(commentId);
      var book = await Version1Book.findByIdAndUpdate(
        comment.bookId,
        {
          $pull: { comments: comment.id },
        },
        { new: true }
      );
      res.status(200).json({ book: book, comment: comment });
    } catch (error) {
      return next(error);
    }
  }
});

module.exports = router;
