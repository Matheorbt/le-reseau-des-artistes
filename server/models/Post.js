const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  like: {
    type: Number,
    default: 0,
  },
  save: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    default: undefined,
    required: [true, "Please provide a content"],
  },
  contentType: {
    type: String,
    required: [true, "Please specify a content type"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      date: {
        type: Date,
        default: new Date(),
        required: true,
      },
      comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    },
  ],
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
