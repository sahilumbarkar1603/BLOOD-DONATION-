const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['public', 'owner'], default: 'public' },
  
  // Donor Specific Info (They can fill this out later)
  bloodGroup: { type: String },
  phone: { type: String },
  location: { type: String },
  city: { type: String },
  lastDonationDate: { type: Date },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);