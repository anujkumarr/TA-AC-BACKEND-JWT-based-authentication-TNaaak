var express = require('express');
var router = express.Router();
var User = require('../models/User');
router.get('/', (req, res, next) => {
  res.render('index');
});

// SignUp
router.post('/signup', async (req, res, next) => {
  req.body.following = false;
  try {
    var user = await User.create(req.body.user);
    res
      .status(200)
      .json({ name: user.name, message: 'registered successfully' });
  } catch (error) {
    if (error) {
      if (error.code === 11000) {
        return res
          .status(400)
          .json({ error: 'This Email is already registered...' });
      }
      if (error.name === 'ValidationError') {
        return res
          .status(400)
          .json({ error: 'Enter a valid and strong Password...' });
      }
    }
  }
});

// LogIn
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body.user;
  if (!email || !password) {
    return res.status(400).json({ error: ' Email or Password is missing.' });
  }
  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: ' Email not registered.' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Password is wrong.' });
    }
    var token = await user.signToken();
    res.status(200).json({ user: user.userJSON(token) });
  } catch (error) {
    return error;
  }
});

module.exports = router;
