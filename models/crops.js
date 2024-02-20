const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cropSchema = new Schema({
    name: { type: String, required: true, maxlength: 50 },
    plantDate: { type: Date, required: true },
    harvestDate: { type: Date, required: true },
    count: { type: Number, required: true },
    farm: { type: Schema.Types.ObjectId, ref: 'Farm' }
});
// Creating a model for the crop collection based on the defined schema

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;