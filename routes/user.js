const express = require("express");
const router = express.Router();
const {getUserBlogs} = require("../controllers/user.controller.js");
const { getUserProfile } = require("../controllers/user.controller.js");
const {authenticateUser} = require("../middleware/auth");

router.get('/', authenticateUser, getUserBlogs);
router.get("/profile", getUserProfile);

module.exports = router;