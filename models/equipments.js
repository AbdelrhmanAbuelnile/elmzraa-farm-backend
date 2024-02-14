const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  Eq_Type: { type: String, required: true, maxlength: 50 },
  Eq_cost: { type: Number, required: true },
  Eq_count: { type: Number, default: 0 },
  Farm_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;