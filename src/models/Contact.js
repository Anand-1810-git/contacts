const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    address: {
      type: String,
      default: "",
      trim: true
    }
  },
  { timestamps: true }
);

contactSchema.index({ userId: 1, phone: 1 }, { unique: true });

module.exports = mongoose.model("Contact", contactSchema);
