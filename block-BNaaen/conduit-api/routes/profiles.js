var express = require("express");
var router = express.Router();
var User = require("../models/User");
var auth = require("../middlewares/auth");

// get profile

router.get("/:username", async (req, res, next) => {
  var id = req.user.userId;
  var username = req.params.username;
  try {
    var user = await User.findOne({ username: username });
    if (user) {
      return res.status(201).json({ profile: user.displayUser(id) });
    } else {
      return res.status(400).json({ error: "Such user is not exists" })
    }
  } catch (error) {
    next(error);
  }
});


// follow user

router.post("/:username/follow", auth.verifyToken, async (req, res, next) => {
  var id = req.user.userId;
  var username = req.params.username;

  try {
    var fisrtUser = await User.findOne({ username });
    if (!fisrtUser) {
      return res.status(400).json({ error: 'No such user exists' });
    }

    var secondUser = await User.findById(id);
    if (fisrtUser.username !== secondUser.username && !secondUser.followingList.includes(fisrtUser.id)) {
      secondUser = await User.findByIdAndUpdate(secondUser.id, { $push: { followingList: fisrtUser.id } }, { new: true });
      fisrtUser = await User.findByIdAndUpdate(fisrtUser.id, { $push: { followersList: secondUser.id } }, {
        new: true
      });
      return res.status(201).json({ user: fisrtUser.displayUser(secondUser.id) });
    } else {
      return res
        .status(400)
        .json({ errors: { body: 'You are already following the person' } });
    }
  } catch (error) {
    next(error);
  }
});

// unfollow user

router.delete("/:username/follow", auth.verifyToken, async (req, res, next) => {
  var username = req.params.username;
  try {
    var fisrtUser = await User.findOne({ username });
    if (!fisrtUser) {
      return res.status(400).json({ errors: 'No such user exists' });
    }
    var secondUser = await User.findById(req.user.userId);
    if (secondUser.followingList.includes(fisrtUser.id)) {
      secondUser = await User.findByIdAndUpdate(secondUser.id, { $pull: { followingList: fisrtUser.id } }, { new: true });
      fisrtUser = await User.findByIdAndUpdate(
        fisrtUser.id,
        {
          $pull: { followersList: secondUser.id },
        },
        { new: true }
      );
      return res.status(200).json({ user: fisrtUser.displayUser(secondUser.id) });
    } else {
      return res
        .status(400)
        .json({ errors: { body: 'You are not following this person' } });
    }
  } catch (error) {
    return next(error);
  }
});

module.exports = router;




