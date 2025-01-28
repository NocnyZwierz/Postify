const express = require("express");
const AdController = require("../controllers/AdController");
const authMiddleware = require("../utils/authMiddleware");
const upload = require("../utils/upload");

const router = express.Router();

router.get("/", AdController.getAllAds);
router.get("/:id", AdController.getAdById);
router.post("/", authMiddleware, upload.single("image"), AdController.createAd);
router.patch("/:id", authMiddleware, upload.single("image"), AdController.updateAd);
router.delete("/:id", authMiddleware, AdController.deleteAd);
router.get("/search/:searchPhrase", AdController.searchAds);

module.exports = router;
