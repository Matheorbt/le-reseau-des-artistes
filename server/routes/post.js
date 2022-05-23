const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const {
  createpost,
  postlist,
  postbyid,
  likepost,
  savepost,
  deletebyid,
} = require("../controllers/post");

const { protect } = require("../middleware/auth");

router.route("/createpost").post(protect, upload.single("object"), createpost);

router.route("/postlist").get(protect, postlist);

router.route("/postbyid/:postID").get(protect, postbyid);

router.route("/like/:postID").patch(protect, likepost);

router.route("/save/:postID").patch(protect, savepost);

router.route("/delete/:postID").patch(protect, deletebyid);

module.exports = router;
