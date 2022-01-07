var express = require('express');
var router = express.Router();
var V1User = require('../models/Users');
var auth = require('../middlewares/auth');

// User Information
router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'User Information' });
});

// Sign In
router.post('/register', async (req, res, next) => {
  try {
    var user = await V1User.create(req.body);
    res.status(201).json({
      name: user.name,
      message: 'Registered Succesfully',
    });
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

// Log In
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email/Password is missing' });
  }
  try {
    var user = await V1User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }
    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Wrong password' });
    }
    var token = await user.signToken();
    res.json({ user: user.userJSON(token) });
  } catch (error) {
    next(error);
  }
});

// Protected Route
router.get('/dashboard', auth.verifyToken, (req, res, next) => {
  res.status(200).json({ acess: 'Dashboard accessed', user: req.user });
});

module.exports = router;
