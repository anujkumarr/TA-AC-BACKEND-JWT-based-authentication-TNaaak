var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    avatar: { type: String },
    following: { type: Boolean },
    followingList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followersList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Hashing the password
userSchema.pre('save', async function (next) {
  try {
    if (this.password && this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    return next();
  } catch (error) {
    return next(error);
  }
});

//Method for verification of Password
userSchema.methods.verifyPassword = async function (password) {
  try {
    let result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

// Method for signing the token
userSchema.methods.signToken = async function () {
  let payload = {
    userId: this.id,
    email: this.email,
    username: this.username,
    name: this.name,
  };
  try {
    let token = await jwt.sign(payload, process.env.SECRET);
    return token;
  } catch (error) {
    return error;
  }
};

// Method to make userJSON data
userSchema.methods.userJSON = function (token) {
  return {
    name: this.name,
    username: this.username,
    email: this.email,
    bio: this.bio,
    avatar: this.avatar,
    token: token,
  };
};

// Method to display User
userSchema.methods.displayUser = function (id = null) {
  return {
    name: this.name,
    username: this.username,
    bio: this.bio,
    avatar: this.avatar,
    following: id ? this.followersList.includes(id) : false,
  };
};

module.exports = mongoose.model('User', userSchema);
