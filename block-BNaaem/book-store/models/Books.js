var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 0 }, 
    description: { type: String },
    tags: [{ type: String }],
    categories: [{ type: String }],
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comments' },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', bookSchema);
