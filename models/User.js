const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true},
  role: { type: String, enum: ['farmer', 'engineer', 'stakeholder'], required: true },
  email: { type: String, unique: true, required: true },
  Farm_Id: { type: mongoose.Schema.Types.Mixed, ref: 'Farm' }
});

const User = mongoose.model('User', userSchema);

module.exports = User;