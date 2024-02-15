const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Importing the Crops,User schema
const Crop = require('./crops');
const User = require('./User');

const farmSchema = new Schema({
    name: { type: String, required: true },
    size: { type: Number, required: true },
    planted_percentage: { type: Number, required: true },
    harvest_percentage: { type: Number, required: true },
    stackholders: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    crops: [{
        type: Schema.Types.ObjectId,
        ref: 'Crop'
    }],
    workers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    equipments: [{
        type: Schema.Types.ObjectId,
        ref: 'Equipment'
    }],
    fertilizers: [{
        type: Schema.Types.ObjectId,
        ref: 'Fertilizer'
    }],
    medicines: [{
        type: Schema.Types.ObjectId,
        ref: 'Medicine'
    }],
});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;