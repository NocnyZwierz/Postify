const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const sanitize = require("mongo-sanitize");
const getImageFileType = require("../utils/getImageFileType");
const fs = require("fs");

exports.registerUser = async (req, res) => {
  try {
    const { login, password, phoneNumber } = req.body;
    const avatar = req.file;

    if (!login || !password || !phoneNumber) {
      if (avatar) fs.unlinkSync(avatar.path);
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ login: sanitize(login) });
    if (existingUser) {
      if (avatar) fs.unlinkSync(avatar.path);
      return res.status(409).json({ message: "Login already exists" });
    }

    let avatarPath = null;
    if (avatar) {
      const fileType = await getImageFileType(avatar);
      if (fileType === "unknown") {
        fs.unlinkSync(avatar.path);
        return res.status(400).json({ message: "Invalid image format" });
      }
      avatarPath = `/uploads/${avatar.filename}`;
    }
    
    const newUser = new User({
      login: sanitize(login),
      password: sanitize(password),
      phoneNumber: sanitize(phoneNumber),
      avatar: avatarPath,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login: sanitize(login) });

    if (!user) {
      return res.status(400).json({ message: "Invalid login or password" });
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid login or password" });
    }

    req.session.user = { id: user._id, login: user.login };
    req.session.save((err) => {
      if (err) console.error("Session save error:", err);
    });
    return res.status(200).json({ message: "Logged in successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error logging in", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  res.send("Logged in");
};

exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
};
