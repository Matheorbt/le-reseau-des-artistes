const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.info = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new ErrorResponse("No user found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

exports.getbyid = async (req, res, next) => {
  const userID = req.params.userID;
  const user = await User.findOne({ _id: userID });

  if (!user) {
    return next(new ErrorResponse("No user found", 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
};

exports.deleteaccount = async (req, res, next) => {
  const user = req.user;

  if (!user) {
    return next(new ErrorResponse("No user found", 404));
  }

  user.deleteOne();
  await user.save;

  res.status(200).json({
    success: true,
    data: user,
  });
};
