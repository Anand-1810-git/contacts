const vision = require("@google-cloud/vision");
const multer = require("multer");
const parseContactText = require("../utils/parseContactText");

const upload = multer({ storage: multer.memoryStorage() });

const parseText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required for parsing" });
    }

    const parsed = parseContactText(text);
    return res.json({ rawText: text, parsed });
  } catch (error) {
    return res.status(500).json({ message: "Failed to parse OCR text", error: error.message });
  }
};

const extractFromImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.textDetection(req.file.buffer);
    const rawText = result.fullTextAnnotation?.text || "";
    const parsed = parseContactText(rawText);

    return res.json({ rawText, parsed });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to run cloud OCR. Configure GOOGLE_APPLICATION_CREDENTIALS.",
      error: error.message
    });
  }
};

module.exports = {
  upload,
  parseText,
  extractFromImage
};
