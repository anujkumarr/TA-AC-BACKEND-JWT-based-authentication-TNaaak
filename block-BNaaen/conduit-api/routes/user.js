var express = require('express');
var router = express.Router();
var User = require("../models/User");
var auth = require("../middlewares/auth");


router.get('/', auth.verifyToken, async (req, res, next) => {
  let id = req.user.userId;
  try {
    let user = await User.findById(id);
   return res.status(200).json({ user: user.displayUser(id) });
  } catch (error) {
   return next(error);
  }
});

router.put("/", auth.verifyToken, async (req, res, next) => {
  let id = req.user.userId;
  try {
   let user = await User.findByIdAndUpdate(id, req.body.user, { new: true });
    return res.status(200).json({ user: user.displayUser(id) });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;