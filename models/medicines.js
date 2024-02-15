const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medicineSchema = new Schema({
    name: { type: String, required: true },
    count: { type: Number, required: true },
    cost: { type: Number, required: true },
    schedule: { type: Date },
    Farm_Id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Farm' }
})

const Medicine = mongoose.model('Medicine', medicineSchema);

module.exports = Medicine;