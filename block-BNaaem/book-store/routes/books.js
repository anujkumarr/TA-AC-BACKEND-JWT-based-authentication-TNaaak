var express = require('express');
var router = express.Router();
var auth = require('../middlewares/auth');
const { findById } = require('../models/Books');
var Version1Book = require('../models/Books');
var Version1User = require('../models/Users');

// Protecting the routes
router.use(auth.verifyToken);

//Get all books
router.get('/get-all-books', async (req, res, next) => {
  try {
    var books = await Version1Book.find({});
    res.status(200).json({ books });
  } catch (error) {
    return next(error);
  }
});

//Adding a book
router.post('/add-new-book', async (req, res, next) => {
  req.body.creator = req.user.userId;
  if (req.body.tags) {
    req.body.tags = req.body.tags.trim().split(',');
  }
  if (req.body.categories) {
    req.body.categories = req.body.categories.trim().split(',');
  }
  try {
    var book = await Version1Book.create(req.body);
    res.status(200).json({ book });
  } catch (error) {
    return next(error);
  }
});

//Get all books
router.get('/get-book/:id', async (req, res, next) => {
  var bookId = req.params.id;
  try {
    var book = await Version1Book.findById(bookId);
    res.status(200).json({ book });
  } catch (error) {
    return next(error);
  }
});

//Editing a book
router.put('/edit-book/:id', async (req, res, next) => {
  var bookId = req.params.id;
  req.body.tags = req.body.tags.trim().split(',');
  req.body.categories = req.body.categories.trim().split(',');

  var data = await Version1Book.findById(bookId);
  if (req.user.userId === data.creator.toString()) {
    try {
      var book = await Version1Book.findByIdAndUpdate(bookId, req.body, {
        new: true,
      });
      res.status(200).json({ book });
    } catch (error) {
      return next(error);
    }
  }
});

//Delete a book
router.delete('/delete-book/:id', async (req, res, next) => {
  var bookId = req.params.id;
  var data = await Version1Book.findById(bookId);
  console.log(req.user.userId, data.creator);
  if (req.user.userId === data.creator.toString()) {
    try {
      var book = await Version1Book.findByIdAndDelete(bookId);
      res.status(200).json({ book });
    } catch (error) {
      return next(error);
    }
  }
});

//Get books by author
router.get('/get-books-by-author', async (req, res, next) => {
  var { author } = req.query;
  try {
    var books = await Version1Book.find({ author });
    res.status(200).json({ books });
  } catch (error) {
    return next(error);
  }
});

// Adding category
router.put('/add-category/:id', async (req, res, next) => {
  var bookId = req.params.id;
  req.body.categories = req.body.categories.trim().split(',');
  var data = await Version1Book.findById(bookId);
  if (req.user.userId === data.creator.toString()) {
    try {
      var book = await Version1Book.findByIdAndUpdate(
        bookId,
        {
          $push: { categories: req.body.categories },
        },
        { new: true }
      );
      res.status(200).json({ book });
    } catch (error) {
      return next(error);
    }
  }
});

// Update category
router.put('/edit-category/:id', async (req, res, next) => {
  var bookId = req.params.id;
  const { categoryToRemove, categoryToAdd } = req.body;
  var data = await Version1Book.findById(bookId);
  if (req.user.userId === data.creator.toString()) {
    try {
      await Version1Book.updateOne(
        { _id: bookId, categories: categoryToRemove },
        { $set: { 'categories.$': categoryToAdd } }
      );
      var book = await Version1Book.findById(bookId);
      res.status(200).json({ book });
    } catch (error) {
      return next(error);
    }
  }
});

// Delete category
router.put('/delete-category/:id', async (req, res, next) => {
  var bookId = req.params.id;
  var data = await Version1Book.findById(bookId);
  if (req.user.userId === data.creator.toString()) {
    try {
      var book = await Version1Book.findByIdAndUpdate(
        bookId,
        {
          $pull: { categories: req.body.category },
        },
        { new: true }
      );
      res.status(200).json({ book });
    } catch (error) {
      return next(error);
    }
  }
});

//Get all categories
router.get('/get-all-categories', async (req, res, next) => {
  try {
    var categories = await Version1Book.distinct('categories');
    res.status(200).json({ categories });
  } catch (error) {
    return next(error);
  }
});

//Get books by category
router.get('/get-books-by-category', async (req, res, next) => {
  console.log(req.query);
  var { category } = req.query;
  try {
    var books = await Version1Book.find({ categories: { $in: category } });
    res.status(200).json({ books });
  } catch (error) {
    return next(error);
  }
});

// Adding tags
router.put('/add-tag/:id', async (req, res, next) => {
  var bookId = req.params.id;

  req.body.tags = req.body.tags.trim().split(',');

  var data = await Version1Book.findById(bookId);
  if (req.user.userId === data.creator.toString()) {
    try {
      var book = await Version1Book.findByIdAndUpdate(
        bookId,
        {
          $push: { tags: req.body.tags },
        },
        { new: true }
      );
      res.status(200).json({ book });
    } catch (error) {
      return next(error);
    }
  }
});

// Update tags
router.put('/edit-tag/:id', async (req, res, next) => {
  var bookId = req.params.id;
  const { tagToRemove, tagToAdd } = req.body;
  var data = await Version1Book.findById(bookId);
  if (req.user.userId === data.creator.toString()) {
    try {
      await Version1Book.updateOne(
        { _id: bookId, tags: tagToRemove },
        { $set: { 'tags.$': tagToAdd } }
      );
      var book = await Version1Book.findById(bookId);
      res.status(200).json({ book });
    } catch (error) {
      return next(error);
    }
  }
});

// Delete tags
router.put('/delete-tag/:id', async (req, res, next) => {
  var bookId = req.params.id;
  var data = await Version1Book.findById(bookId);
  if (req.user.userId === data.creator.toString()) {
    try {
      var book = await Version1Book.findByIdAndUpdate(
        bookId,
        {
          $pull: { tags: req.body.tag },
        },
        { new: true }
      );
      res.status(200).json({ book });
    } catch (error) {
      return next(error);
    }
  }
});

//Get all tags
router.get('/get-all-tags', async (req, res, next) => {
  try {
    var tags = await Version1Book.distinct('tags');
    res.status(200).json({ tags });
  } catch (error) {
    return next(error);
  }
});

//Get books by tags
router.get('/get-books-by-tag', async (req, res, next) => {
  console.log(req.query);
  var { tag } = req.query;
  try {
    var books = await Version1Book.find({ tags: { $in: tag } });
    res.status(200).json({ books });
  } catch (error) {
    return next(error);
  }
});

// Add book to cart
router.put('/add-to-cart/:id', async (req, res, next) => {
  var bookId = req.params.id;
  var book = await Version1Book.findById(bookId);
  console.log(book);
  if (book.quantity > 0) {
    var user = await Version1User.findByIdAndUpdate(req.user.userId, {
      $push: {
        cart: {
          quantity: 1,
          book: book._id,
        },
      },
    });
    res.status(200).json({ cart: user.cart });
  }
});

// Remove book from cart
router.put('/remove-from-cart/:id', async (req, res, next) => {
  var bookId = req.params.id;
  var user = await Version1User.findByIdAndUpdate(
    req.user.userId,
    {
      $pull: {
        quantity: 1,
        book: bookId,
      },
    },
    { new: true }
  );
  res.status(200).json({ cart: user.cart });
});

module.exports = router;
