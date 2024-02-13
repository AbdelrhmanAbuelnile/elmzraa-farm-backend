const mongoose = require('mongoose');
const fertilizerSchema = new mongoose.Schema({
  // Fer_Id: { type: Number, required: true },
  Fer_Name: { type: String, required: true, maxlength: 50 },
  Fer_Type: { type: String, required: true, maxlength: 50 },
  Fer_Cost: { type: Number, required: true },
  Fer_Quantity: { type: Number, required: true },
  Fer_AppSchedule: { type: Date }
});

const Fertilizer = mongoose.model('Fertilizer', fertilizerSchema);
module.exports = Fertilizer