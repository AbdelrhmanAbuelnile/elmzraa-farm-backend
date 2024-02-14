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
    crops: [{
        type: Schema.Types.ObjectId,
        ref: 'Crop'
    }],
    workers: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    equipments: [{
        name: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    fertilizers: [{
        name: { type: String, required: true },
        count: { type: Number, required: true }
    }],
    medicines: [{
        name: { type: String, required: true },
        count: { type: Number, required: true }
    }]
});

const Farm = mongoose.model('Farm', farmSchema);

module.exports = Farm;