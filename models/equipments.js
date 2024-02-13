

// Define schema for EQUIPMENTS collection
const equipmentSchema = new mongoose.Schema({
  // Eq_Id: { type: Number, required: true },
  Eq_Type: { type: String, required: true, maxlength: 50 },
  Eq_cost: { type: Number, required: true },
  Eq_count: { type: Number, default: 0 } // Adding Eq_count field
});

// Define schema for Fertilizers collection

// Create EQUIPMENTS model
const Equipment = mongoose.model('Equipment', equipmentSchema);

// Create Fertilizers model


module.exports = Equipment