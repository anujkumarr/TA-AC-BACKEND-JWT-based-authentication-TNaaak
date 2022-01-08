var express = require('express');
const Version1User = require('../models/Users');
var router = express.Router();
var auth = require('../middlewares/auth');

// SignUp
router.post('/signup', async (req, res, next) => {
  try {
    var user = await Version1User.create(req.body);
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

// SignIn
router.post('/signin', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: ' Email or Password is missing.' });
  }
  try {
    var user = await Version1User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: ' Email not registered.' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Password is wrong.' });
    }
    var token = await user.signToken();
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    return error;
  }
});

// Protected route


router.get('/dashboard',auth.verifyToken, async (req, res, next) => {
  try {
    var user = await Version1User.findById(req.user.userId);
    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        userId: user.id,
      },
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
