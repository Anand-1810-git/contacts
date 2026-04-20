const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  listContacts,
  createContact,
  updateContact,
  deleteContact,
  exportContacts
} = require("../controllers/contactController");

const router = express.Router();

router.use(authMiddleware);
router.get("/", listContacts);
router.post("/", createContact);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);
router.get("/export/all", exportContacts);

module.exports = router;
