const express = require("express");
const AuthController = require("../controllers/AuthController");
const upload = require("../utils/upload");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/register", upload.single("avatar"), AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/user", authMiddleware, AuthController.getUser);
router.delete("/logout", AuthController.logoutUser);

module.exports = router;
