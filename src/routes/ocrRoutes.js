const express = require("express");
const authMiddleware = require("../middleware/auth");
const { upload, parseText, extractFromImage } = require("../controllers/ocrController");

const router = express.Router();

router.use(authMiddleware);
router.post("/parse", parseText);
router.post("/image", upload.single("image"), extractFromImage);

module.exports = router;
