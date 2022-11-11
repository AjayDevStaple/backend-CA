const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    userType: {
      type: String,
      required: true,
    },
    documentNo: {
      type: Number,
      required: false,
      default : 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
