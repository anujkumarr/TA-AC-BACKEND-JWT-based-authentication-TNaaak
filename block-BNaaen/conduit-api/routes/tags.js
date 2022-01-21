var express = require('express');
var router = express.Router();
var Article = require('../models/Article');

//Get All Tags (Not Authenticated)
router.get('/', async (req, res, next) => {
  try {
    var allTags = await Article.distinct('tagList');
    res.status(200).json({ allTags });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
