const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  isReply: {
    type: Boolean,
    required: true,
  },
  like: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
  content: {
    type: String,
    required: [true, "Please provide a content"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reply: [
    {
      comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    },
  ],
});

const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;
