const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },

  },

  { timestamps: true }
);

module.exports = mongoose.model('Admin', AdminUserSchema);
