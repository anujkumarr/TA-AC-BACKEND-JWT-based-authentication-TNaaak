var express = require('express');
var router = express.Router();
var V1User = require('../models/User');

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
    next(error);
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
    res.status(200).json('Loggen In');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
