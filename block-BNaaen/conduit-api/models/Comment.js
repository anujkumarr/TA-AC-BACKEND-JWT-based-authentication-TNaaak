var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema(
  {
    body: { type: String, required: true },
    articleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Article',
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

//Method for displaying the comment
commentSchema.methods.displayComment = function (id = null) {
  return {
    id: this.id,
    body: this.body,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    author: this.author.displayUser(id),
  };
};

module.exports = mongoose.model('Comment', commentSchema);
