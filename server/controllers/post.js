const User = require("../models/User");
const Post = require("../models/Post");
const AWS = require("aws-sdk");
const fs = require("fs");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

exports.createpost = async (req, res, next) => {
  let { title, description, contentType, author, fileName } = req.body;
  const file = req.file;
  author = JSON.parse(author);
  const userId = author._id.toString();

  const content =
    "https://lrda.s3.eu-west-3.amazonaws.com/" + encodeURI(fileName);

  // AWS S3 setup

  const fileStream = fs.createReadStream(file.path);
  const S3_BUCKET = process.env.AWS_S3_BUCKET;
  const REGION = process.env.AWS_REGION;

  AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET },
    region: REGION,
  });

  const params = {
    Body: fileStream,
    Bucket: S3_BUCKET,
    Key: fileName,
  };

  try {
    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({
        succes: false,
        error: error.message,
      });
    }

    myBucket.upload(params, function (err, data) {
      if (err) console.log(err, err.stack);
    });

    const post = await Post.create({
      title,
      description,
      contentType,
      content,
      author,
    });
    user?.posts.push(post);
    await user.save();
    res.status(200).json({
      succes: true,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.postlist = async (req, res, next) => {
  try {
    const posts = await Post.find();

    if (!posts) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: "Posts list fetch success",
      postsList: posts,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.postbyid = async (req, res, next) => {
  const postId = req.params.postID;
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }
    res.status(201).json({
      success: true,
      message: "Post fetch success",
      post: post,
    });
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.savepost = async (req, res, next) => {
  const postId = req.params.postID;
  const { user } = req.body;
  const userId = user._id.toString();

  try {
    const post = await Post.findOne({ _id: postId });
    const user = await User.findOne({ _id: userId });

    if (!post) {
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

    if (user.savedPosts.toString().includes(post._id)) {
      let updatedSavedPosts = user.savedPosts.filter(function (e) {
        return e._id.toString() != post._id;
      });
      user.savedPosts = updatedSavedPosts;
      await post.updateOne({ like: post.save - 1 });
      await user.save();
      res.status(201).json({
        succes: true,
      });
    } else {
      user.savedPosts.push(post);

      await post.updateOne({ like: post.save + 1 });
      await user.save();
      res.status(201).json({
        succes: true,
      });
    }
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.likepost = async (req, res, next) => {
  const postId = req.params.postID;
  const { user } = req.body;
  const userId = user._id.toString();

  try {
    const post = await Post.findOne({ _id: postId });
    const user = await User.findOne({ _id: userId });

    if (!post) {
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

    if (user.likedPosts.toString().includes(post._id)) {
      let updatedLikedPosts = user.likedPosts.filter(function (e) {
        return e._id.toString() != post._id;
      });
      user.likedPosts = updatedLikedPosts;
      await post.updateOne({ like: post.like - 1 });
      await user.save();
      res.status(201).json({
        succes: true,
      });
    } else {
      user.likedPosts.push(post);

      await post.updateOne({ like: post.like + 1 });
      await user.save();
    }
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

exports.deletebyid = async (req, res, next) => {
  const postId = req.params.postID;
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      res.status(500).json({
        succes: false,
        error: error.message,
      });
    }
    post.deleteOne();
    await post.save;
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
