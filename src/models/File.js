const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure you have a 'User' model
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('File', fileSchema);
