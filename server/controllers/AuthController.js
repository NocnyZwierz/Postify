const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const sanitize = require("mongo-sanitize");
const getImageFileType = require("../utils/getImageFileType");

exports.registerUser = async (req, res) => {
  try {
    const { login, password, phoneNumber } = req.body;
    const avatar = req.file;

    const existingUser = await User.findOne({ login: sanitize(login) });
    if (existingUser) {
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

    const hashedPassword = await bcryptjs.hash(sanitize(password), 10);

    const newUser = new User({
      login: sanitize(login),
      password: hashedPassword,
      phoneNumber: sanitize(phoneNumber),
      avatar: avatarPath,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered", user: newUser });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login: sanitize(login) });
    if (!user || !(await bcryptjs.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid login or password" });
    }

    req.session.user = { id: user._id, login: user.login };
    res.json({ message: "Logged in successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
};

exports.getUser = async (req, res) => {
  res.sene('Logd in')
}

exports.logoutUser = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
};
