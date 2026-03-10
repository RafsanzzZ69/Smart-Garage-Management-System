const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  supplier: { type: String },
  purchasePrice: { type: Number, required: true },
  usageHistory: [{ service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' }, quantityUsed: Number, date: Date }],
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);