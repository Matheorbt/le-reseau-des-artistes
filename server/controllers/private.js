exports.getPrivateData = (req, res, next) => {
  res.status(200).json({
    success: true,
    data: "You got acces to the private data in this route",
  });
};
