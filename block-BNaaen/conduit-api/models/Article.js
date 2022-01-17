var slug = require('mongoose-slug-generator');
var User = require('./User');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.plugin(slug);

var articleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, slug: 'title', unique: true },
    description: { type: String },
    body: { type: String },
    tagList: [{ type: String }],
    favorited: { type: Boolean },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    favoritesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    favoriteList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// Method to give details of Article
articleSchema.methods.resultArticle = function (id = null) {
  return {
    title: this.title,
    slug: this.slug,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favorited: id ? this.favoriteList.includes(id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.displayUser(id),
  };
};

module.exports = mongoose.model('Article', articleSchema);
