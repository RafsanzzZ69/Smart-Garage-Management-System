const mongoose = require('mongoose');
const servicePackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  services: [
    {
      type: String 
    }
  ],
  price: {
    type: Number,
    required: true
  },
  estimatedDuration: {
    type: Number 
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });
module.exports = mongoose.model('ServicePackage', servicePackageSchema);