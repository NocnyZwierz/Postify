const User = require("../models/User.model");
const bcryptjs = require("bcryptjs");
const sanitize = require("mongo-sanitize");
const getImageFileType = require("../utils/getImageFileType");

exports.registerUser = async (req, res) => {
  try {
    const { login, password, phoneNumber } = req.body;
    const avatar = req.file;

    if (!login || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }
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

    // const hashedPassword = await bcryptjs.hash(sanitize(password), 10);
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("Plain password before hashing:", password);
    console.log("Hashed password before saving:", hashedPassword);

    const newUser = new User({
      login: sanitize(login),
      password: hashedPassword,
      phoneNumber: sanitize(phoneNumber),
      avatar: avatarPath,
    });
    console.log("Register attempt:", login, password);
    console.log("Final hashed password before saving:", hashedPassword);
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
    console.log("Login attempt:", login, password);
    const user = await User.findOne({ login: sanitize(login) });
    console.log("Found user:", user);

    if (!user) {
      return res.status(400).json({ message: "Invalid login or password" });
    }
    console.log(password, 'przed porównaniem')
    console.log('Otrzymane dane:', req.body);
    console.log("Comparing:", password, "with hash:", user.password);
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    console.log("Password valid?", isPasswordValid);

    console.log("Password valid?", isPasswordValid);
    console.log("Hashed password from DB:", user.password);
    console.log("Comparing with:", password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid login or password" });
    }

    req.session.user = { id: user._id, login: user.login };
    req.session.save((err) => {
      if (err) console.error("Session save error:", err);
    });
    console.log(`[${password}] length:`, password.length);
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
