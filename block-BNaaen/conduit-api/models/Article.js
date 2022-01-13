var mongoose = require("mongoose");
var slug = require("mongoose-slug-generator");
var Schema = mongoose.Schema;

mongoose.plugin(slug);

var articleSchema = new Schema(
  {
  title: { type: String, required: true},
  slug: { type: String, slug:'title', unique: true },
  description: { type: String },
  body: { type: String },
  tagList: [{ type: String }],
  favourited: { type: Boolean },
  author: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true
  },
  favouritesCount: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  favouriteList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
  },
  { timestamps: true }
);

// method for details of article

articleSchema.methods.resultArticle = function (id = null) {
  return {
    title: this.title,
    slug: this.slug,
    description: this.description,
    body: this.body,
    tagList: this.tagList,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    favourited: id ? this.favouriteList.includes(id) : false,
    favouritesCount: this.favouritesCount,
    author: this.author.displayUser(id),
  };
};

module.exports = mongoose.model('Article', articleSchema);