const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

exports.create = async (req, res, next) => {
  let { commentContent: content, user: author, post } = req.body;

  const userId = author._id.toString();
  const postId = post._id.toString();
  const isReply = false;
  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user) {
      res.status(404).json({
        succes: false,
        error: error.message,
      });
    }

    const comment = await Comment.create({
      content,
      author,
      isReply,
    });

    await post.updateOne({ comments: [...post.comments, comment] });
    await user.updateOne({ comments: [...user.comments, comment] });
    res.status(201).json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.createreply = async (req, res, next) => {
  let { commentContent: content, userID: author, comment } = req.body;
  const userId = author._id.toString();
  const commentId = comment._id.toString();
  const isReply = true;

  try {
    const user = await User.findById(userId);
    const parentComment = await Comment.findById(commentId);

    if (!user) {
      res.status(404).json({
        succes: false,
        error: error.message,
      });
    }

    if (!parentComment) {
      res.status(404).json({
        succes: false,
        error: error.message,
      });
    }

    const reply = await Comment.create({
      content,
      author,
      isReply,
    });

    parentComment.reply.push(reply);
    user.comments.push(reply);

    await user.save();
    await parentComment.save();
    res.status(201).json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.getbyid = async (req, res, next) => {
  const commentID = req.params.commentID;

  try {
    const comment = await Comment.findOne({ _id: commentID });

    if (!comment) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: "Comment fetch success",
      comment: comment,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.like = async (req, res, next) => {
  const commentID = req.params.commentID;
  const { user } = req.body;
  const userId = user._id.toString();

  try {
    const comment = await Comment.findOne({ _id: commentID });
    const user = await User.findOne({ _id: userId });

    if (!comment) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }

    if (!user) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }

    if (comment.like.toString().includes(user._id)) {
      let updatedComments = comment.like.filter(function (e) {
        return e._id.toString() != user._id;
      });
      comment.like = updatedLikedPosts;
      await comment.save();
    } else {
      comment.like.push(user);

      await comment.save();
    }
    res.status(201).json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.updatebyid = async (req, res, next) => {
  const commentID = req.params.commentID;
  const { user } = req.body;
  const userId = user._id.toString();

  try {
    const comment = await Comment.findOne({ _id: commentID });
    const user = await User.findOne({ _id: userId });

    if (!comment) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }

    if (!user) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }

    if (comment.like.toString().includes(user._id)) {
      let updatedComments = comment.like.filter(function (e) {
        return e._id.toString() != user._id;
      });
      comment.like = updatedLikedPosts;
      await comment.save();
    } else {
      comment.like.push(user);

      await comment.save();
    }
    res.status(201).json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.deletereplybyid = async (req, res, next) => {
  const commentID = req.params.commentID;
  const { user } = req.body;
  const userID = user._id.toString();

  try {
    const comment = await Comment.findOne({ _id: commentID });
    const user = await User.findOne({ _id: userID });

    if (!comment || !user) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }

    let updatedCommentsUser = user.comments.filter(function (e) {
      return e._id.toString() != comment._id;
    });
    user.comments = updatedCommentsUser;

    comment.deleteOne();
    await comment.save();
    await user.save();
    res.status(201).json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.deletecommentbyid = async (req, res, next) => {
  const commentID = req.params.commentID;
  const { user, post } = req.body;
  const userID = user._id.toString();
  const postID = post._id.toString();
  try {
    const comment = await Comment.findOne({ _id: commentID });
    const user = await User.findOne({ _id: userID });
    const post = await Post.findOne({ _id: postID });

    if (!comment || !post || !user) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }

    let updatedComments = post.comments.filter(function (e) {
      return e._id.toString() != comment._id;
    });
    post.comments = updatedComments;

    let updatedCommentsUser = user.comments.filter(function (e) {
      return e._id.toString() != comment._id;
    });
    user.comments = updatedCommentsUser;

    comment.deleteOne();
    await comment.save();
    await user.save();
    await post.save();
    res.status(201).json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
