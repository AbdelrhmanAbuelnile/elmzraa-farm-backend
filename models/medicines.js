const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicinesSchema = new Schema({
    name: { type: String, required: true },
    count: { type: Number, required: true },
    cost: { type: Number, required: true },
    schedule: { type: Date },
    Farm_Id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }
})

const Medicines = mongoose.model('Medicines', medicinesSchema);
module.exports = Medicines