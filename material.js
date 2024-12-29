const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
    grade: { type: String, required: true },
    subject: { type: String, required: true },
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    premium: { type: Boolean, default: false },
});

module.exports = mongoose.model("Material", MaterialSchema);
