const express = require("express");
const router = express.Router();

const {
  create,
  getbyid,
  like,
  deletecommentbyid,
  deletereplybyid,
  createreply,
  updatebyid,
} = require("../controllers/comment");

const { protect } = require("../middleware/auth");

router.route("/create").post(protect, create);

router.route("/getbyid/:commentID").get(protect, getbyid);

router.route("/like/:commentID").patch(protect, like);

router.route("/deletereplybyid/:commentID").delete(protect, deletereplybyid);

router
  .route("/deletecommentbyid/:commentID")
  .delete(protect, deletecommentbyid);

router.route("/createreply").post(protect, createreply);

router.route("/updatebyid/:commentID").patch(protect, updatebyid);

module.exports = router;
