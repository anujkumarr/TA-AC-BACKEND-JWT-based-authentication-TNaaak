var express = require('express');
var router = express.Router();
var Article = require('../models/Article');
var User = require('../models/User');
var Comment = require('../models/Comment');
var slugger = require('slugger');
var auth = require('../middlewares/auth');

// Feed Articles  (Authenticated)
router.get('/feed', auth.verifyToken, async (req, res, next) => {
  var limit = 20;
  var skip = 0;
  if (req.query.limit) {
    limit = req.query.limit;
  }
  if (req.query.skip) {
    skip = req.query.skip;
  }
  try {
    let result = await User.findById(req.user.userId).distinct('followingList');
    let articles = await Article.find({ author: { $in: result } })
      .populate('author')
      .limit(Number(limit))
      .skip(Number(skip))
      .sort({ createdAt: -1 });
    res.status(200).json({
      articles: articles.map((art) => {
        return art.resultArticle(req.user.userId);
      }),
      arcticlesCount: articles.length,
    });
  } catch (error) {
    next(error);
  }
});

//List Articles  (Optional Authentication)
router.get('/', auth.authorizeOptional, async (req, res, next) => {
  let id = req.user ? req.user.userId : false;
  var limit = 20;
  var skip = 0;
  var tag = null;
  var authorName = null;
  var favorited = null;
  var author;

  var tags = await Article.find({}).distinct('tagList');
  var authors = await User.find({}).distinct('_id');

  if (req.query.tag) {
    tag = req.query.tag;
  }

  if (req.query.limit) {
    limit = req.query.limit;
  }

  if (req.query.skip) {
    skip = req.query.skip;
  }

  if (req.query.author) {
    authorName = req.query.author;
    var user = await User.findOne({ username: authorName });
    if (!user) {
      return res
        .status(400)
        .json({ errors: { body: 'There is no such results for this name' } });
    }
    author = user.id;
  }

  try {
    if (req.query.favorited) {
      favorited = req.query.favorited;
      var user = await User.findOne({ username: favorited });
      if (!user) {
        return res
          .status(400)
          .json({ errors: { body: 'There is no such result' } });
      }

      var articles = await Article.find({
        tagList: !tag ? { $in: tags } : tag,
        favoriteList: user.id,
        author: !author ? { $in: authors } : author,
      })
        .populate('author')
        .limit(Number(limit))
        .skip(Number(skip))
        .sort({ createdAt: -1 });
      res.status(200).json({
        articles: articles.map((arr) => {
          return arr.resultArticle(id);
        }),
        arcticlesCount: articles.length,
      });
    } else if (!req.query.favorited) {
      console.log('yes');
      var articles = await Article.find({
        tagList: !tag ? { $in: tags } : tag,
        author: !author ? { $in: authors } : author,
      })
        .populate('author')
        .limit(Number(limit))
        .skip(Number(skip))
        .sort({ createdAt: -1 });
      res.status(200).json({
        articles: articles.map((arr) => {
          return arr.resultArticle(id);
        }),
        arcticlesCount: articles.length,
      });
    } else {
      return res
        .status(400)
        .json({ errors: { body: 'No results for the search' } });
    }
  } catch (error) {
    next(error);
  }
});

//Get Article  (Not Authenticated)
router.get('/:slug', async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let article = await Article.findOne({ slug }).populate('author');
    res.status(200).json({ article: article.resultArticle() });
  } catch (error) {
    next(error);
  }
});

//Create Article  (Authenticated)
router.post('/', auth.verifyToken, async (req, res, next) => {
  req.body.article.author = req.user.userId;
  try {
    let article = await Article.create(req.body.article);
    let article2 = await Article.findById(article.id).populate('author');
    res.status(200).json({ article: article2.resultArticle(req.user.userId) });
  } catch (error) {
    next(error);
  }
});

//Update Article  (Authenticated)
router.put('/:slug', auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  if (req.body.article.title) {
    req.body.article.slug = slugger(req.body.article.title, {
      replacement: '-',
    });
  }
  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      return res
        .status(400)
        .json({ errors: { body: 'Theres is no such article' } });
    }
    if (req.user.userId == article.author) {
      article = await Article.findOneAndUpdate({ slug }, req.body.article, {
        new: true,
      }).populate('author');
      return res
        .status(200)
        .json({ article: article.resultArticle(req.user.userId) });
    } else {
      return res
        .status(403)
        .json({ error: { body: 'Not Authorized to perform this action' } });
    }
  } catch (error) {
    next(error);
  }
});

//Delete Article  (Authenticated)
router.delete('/:slug', auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      return res
        .status(400)
        .json({ errors: { body: 'Theres is no such article' } });
    }
    if (req.user.userId == article.author) {
      article = await Article.findOneAndDelete({ slug });
      let comments = await Comment.deleteMany({ articleId: article.id });
      return res.status(400).json({ msg: 'Article is successfully deleted' });
    } else {
      return res
        .status(403)
        .json({ error: { body: 'Not Authorized to perform this action' } });
    }
  } catch (error) {
    next(error);
  }
});

//Add Comments To An Article  (Authenticated)
router.post('/:slug/comments', auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      return res.status(400).json({
        errors: { body: 'Theres is no such article for this search' },
      });
    }
    req.body.comment.articleId = article.id;
    req.body.comment.author = req.user.userId;
    let comment = await Comment.create(req.body.comment);
    article = await Article.findOneAndUpdate(
      { slug },
      { $push: { comments: comment.id } }
    );
    comment = await Comment.findById(comment.id).populate('author');
    return res
      .status(200)
      .json({ comment: comment.displayComment(req.user.userId) });
  } catch (error) {
    next(error);
  }
});

//Get Comments From An Article   (Optional Authentication)
router.get(
  '/:slug/comments',
  auth.authorizeOptional,
  async (req, res, next) => {
    let slug = req.params.slug;
    let id = req.user ? req.user.userId : false;
    try {
      let article = await Article.findOne({ slug });
      if (!article) {
        return res
          .status(400)
          .json({ errors: { body: 'There is no such article' } });
      }
      let comments = await Comment.find({ articleId: article.id }).populate(
        'author'
      );
      res.status(200).json({
        comments: comments.map((comment) => {
          return comment.displayComment(id);
        }),
      });
    } catch (error) {
      next(error);
    }
  }
);

//Delete Comments  (Authenticated)
router.delete(
  '/:slug/comments/:id',
  auth.verifyToken,
  async (req, res, next) => {
    let slug = req.params.slug;
    let id = req.params.id;
    try {
      let article = await Article.findOne({ slug });
      if (!article) {
        return res
          .status(400)
          .json({ errors: { body: 'Theres is no such article' } });
      }
      let comment = await Comment.findById(id);
      if (req.user.userId == comment.author) {
        comment = await Comment.findByIdAndDelete(id);
        article = await Article.findOneAndUpdate(
          { slug },
          { $pull: { comments: id } }
        );
        return res.status(200).json({ msg: 'Comment is successfully deleted' });
      } else {
        return res
          .status(403)
          .json({ error: { body: 'Not Authorized to perform this action' } });
      }
    } catch (error) {
      next(error);
    }
  }
);

//Favorite Article  (Authenticated)
router.post('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      return res
        .status(400)
        .json({ errors: { body: 'Theres is no such article' } });
    }
    let user = await User.findById(req.user.userId);
    if (!article.favoriteList.includes(user.id)) {
      article = await Article.findOneAndUpdate(
        { slug },
        { $inc: { favoritesCount: 1 }, $push: { favoriteList: user.id } }
      ).populate('author');
      return res.status(200).json({ article: article.resultArticle(user.id) });
    } else {
      return res.status(200).json({
        errors: { body: 'Article is already added to your favorite list' },
      });
    }
  } catch (error) {
    next(error);
  }
});

//Unfavorite Article  (Authenticated)
router.delete('/:slug/favorite', auth.verifyToken, async (req, res, next) => {
  let slug = req.params.slug;
  try {
    let article = await Article.findOne({ slug });
    if (!article) {
      return res
        .status(400)
        .json({ errors: { body: 'Theres is no such article' } });
    }
    let user = await User.findById(req.user.userId);
    if (article.favoriteList.includes(user.id)) {
      article = await Article.findOneAndUpdate(
        { slug },
        { $inc: { favoritesCount: -1 }, $pull: { favoriteList: user.id } }
      ).populate('author');

      return res.status(200).json({ article: article.resultArticle(user.id) });
    } else {
      return res.status(200).json({
        errors: { body: 'Article is removed from the favorite list' },
      });
    }
  } catch (error) {
    next(error);
  }

});


module.exports = router;
