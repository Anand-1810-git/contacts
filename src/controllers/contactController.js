const { stringify } = require("csv-stringify/sync");
const Contact = require("../models/Contact");

const listContacts = async (req, res) => {
  try {
    const search = (req.query.search || "").trim();
    const filters = { userId: req.user.id };

    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const contacts = await Contact.find(filters).sort({ name: 1 });
    return res.json(contacts);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch contacts", error: error.message });
  }
};

const createContact = async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const existing = await Contact.findOne({ userId: req.user.id, phone: phone.trim() });
    if (existing) {
      return res.status(409).json({ message: "Contact with this phone already exists" });
    }

    const contact = await Contact.create({
      userId: req.user.id,
      name: name.trim(),
      phone: phone.trim(),
      address: (address || "").trim()
    });

    return res.status(201).json(contact);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create contact", error: error.message });
  }
};

const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, address } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    const duplicate = await Contact.findOne({
      userId: req.user.id,
      phone: phone.trim(),
      _id: { $ne: id }
    });
    if (duplicate) {
      return res.status(409).json({ message: "Another contact already uses this phone" });
    }

    const updated = await Contact.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { name: name.trim(), phone: phone.trim(), address: (address || "").trim() },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update contact", error: error.message });
  }
};

const deleteContact = async (req, res) => {
  try {
    const deleted = await Contact.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Contact not found" });
    }
    return res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete contact", error: error.message });
  }
};

const exportContacts = async (req, res) => {
  try {
    const format = (req.query.format || "json").toLowerCase();
    const contacts = await Contact.find({ userId: req.user.id }).sort({ name: 1 }).lean();

    if (format === "csv") {
      const csv = stringify(contacts, {
        header: true,
        columns: ["name", "phone", "address", "createdAt", "updatedAt"]
      });
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=contacts.csv");
      return res.send(csv);
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", "attachment; filename=contacts.json");
    return res.send(JSON.stringify(contacts, null, 2));
  } catch (error) {
    return res.status(500).json({ message: "Failed to export contacts", error: error.message });
  }
};

module.exports = {
  listContacts,
  createContact,
  updateContact,
  deleteContact,
  exportContacts
};
