var express = require('express');
var router = express.Router();
var User = require('../models/User');
var auth = require('../middlewares/auth');
var bcrypt = require('bcrypt');

// Protecting The Routes
router.use(auth.verifyToken);

//Get Current User (Authenticated)
router.get('/', async (req, res, next) => {
  let id = req.user.userId;
  try {
    let user = await User.findById(id);
    res.status(200).json({ user: user.displayUser(id) });
  } catch (error) {
    next(error);
  }
});

//Update User (Authenticated)
router.put('/', async (req, res, next) => {
  let id = req.user.userId;
  try {
    user = await User.findByIdAndUpdate(id, req.body.user, { new: true });
    return res.status(201).json({ user: user.displayUser(id) });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
