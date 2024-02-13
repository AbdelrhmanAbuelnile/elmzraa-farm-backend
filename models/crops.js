const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cropSchema = new Schema({
    Crop_Type: { type: String, required: true, maxlength: 50 },
    Crop_PlantDate: { type: Date, required: true },
    Crop_HarvestDate: { type: Date, required: true }
});

const Crop = mongoose.model('Crop', cropSchema);

module.exports = Crop;
