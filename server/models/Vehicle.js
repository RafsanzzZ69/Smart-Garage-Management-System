const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  model: { type: String, required: true },
  fuelType: { type: String, required: true },
  mileage: { type: Number, required: true },
  year: { type: Number, required: true },
  licensePlate: { type: String, required: true, unique: true },
  serviceHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service' }],
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);