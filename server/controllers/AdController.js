const Ad = require("../models/Ad.model");
const sanitize = require("mongo-sanitize");
const fs = require("fs");
const path = require("path");

exports.getAllAds = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortField = req.query.sort || "publishDate";
    const sortOrder = req.query.order === "asc" ? 1 : -1;

    const ads = await Ad.find()
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .populate("seller", "login avatar phoneNumber");

    const totalAds = await Ad.countDocuments();

    res.json({
      ads,
      totalPages: Math.ceil(totalAds / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching ads", error: err.message });
  }
};

exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(sanitize(req.params.id)).populate(
      "seller",
      "login avatar phoneNumber"
    );

    if (!ad) return res.status(404).json({ message: "Ad not found" });

    res.status(200).json(ad);
  } catch (err) {
    res.status(500).json({ message: "Error fetching ad", error: err.message });
  }
};

exports.createAd = async (req, res) => {
  try {
    const newAd = new Ad({
      title: sanitize(req.body.title),
      content: sanitize(req.body.content),
      price: sanitize(req.body.price),
      location: sanitize(req.body.location),
      image: req.file ? `${req.file.filename}` : null,
      seller: req.session.user.id,
    });

    await newAd.save();
    res.status(201).json({ message: "Ad created", ad: newAd });
  } catch (err) {
    res.status(500).json({ message: "Error creating ad", error: err.message });
  }
};

exports.updateAd = async (req, res) => {
  try {
    const ad = await Ad.findById(sanitize(req.params.id));
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (ad.seller.toString() !== req.session.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    ad.title = sanitize(req.body.title) || ad.title;
    ad.content = sanitize(req.body.content) || ad.content;
    ad.price = sanitize(req.body.price) || ad.price;
    ad.location = sanitize(req.body.location) || ad.location;

    await ad.save();
    res.json({ message: "Ad updated", ad });
  } catch (err) {
    res.status(500).json({ message: "Error updating ad", error: err.message });
  }
};

exports.deleteAd = async (req, res) => {
  try {
    const ad = await Ad.findById(sanitize(req.params.id));
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    if (ad.seller.toString() !== req.session.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (ad.image) {
      const imagePath = path.join(__dirname, "..", "uploads", "public", ad.image);

      fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(imagePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error("Błąd usuwania pliku:", unlinkErr);
            } else {
              console.log("Plik został usunięty:", imagePath);
            }
          });
        } else {
          console.warn("Plik nie istnieje:", imagePath);
        }
      });
    }
    await ad.deleteOne();
    res.json({ message: "Ad deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting ad", error: err.message });
  }
};

exports.searchAds = async (req, res) => {
  try {
    const searchPhrase = req.params.searchPhrase;
    const ads = await Ad.find({
      title: { $regex: searchPhrase, $options: "i" },
    }).populate("seller", "login avatar phoneNumber");

    res.json(ads);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error searching ads", error: err.message });
  }
};
