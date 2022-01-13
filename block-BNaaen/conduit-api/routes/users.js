var express = require('express');
var router = express.Router();
var User = require("../models/User");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({ message: "Welcome to the Conduit-API"});
});


// signup

router.post("/signup", async (req, res, next) => {
  req.body.following = false;
  try {
    var user = await User.create(req.body.user);
    res.status(200).json({ name: user.name, message: 'Registered successfully' });
  } catch (error) {
    if (error) {
      if (error.code === 11000) {
        return res.status(400).json({ error: 'This email is already registered' })
      }
      if (error.name === 'Validation error') {
        return res.status(400).json({ error: "Enter a valid and strong password" })
      }
    }
  }
});

// login

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body.user;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email or password is missing' });
  }

  try {
    var user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not registered' });
    }

    var result = await user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: 'Password is wrong' });
    }
    var token = await user.signToken();
    res.status(200).json({ user: user.userJSON(token) });
  } catch (error) {
    return error;
  }
});


module.exports = router;
