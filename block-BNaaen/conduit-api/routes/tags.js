var express = require("express");
var router = express.Router();
var Article = require("../models/Article");

router.get("/", async (req, res, next) => {
  try {
    var allTags = await Article.distinct('tagList');
   return res.status(200).json(allTags);
  } catch (error) {
  return next(error);
  }
})

module.exports = router;