const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const { info, deleteaccount, getbyid } = require("../controllers/profile");

router.route("/info").get(protect, info);

router.route("/getbyid/:userID").get(protect, getbyid);

router.route("/deleteaccount").delete(protect, deleteaccount);

module.exports = router;
