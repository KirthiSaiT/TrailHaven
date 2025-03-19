const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  policeId: { type: String, required: function() { return this.role === 'admin'; } },
  idPicture: { type: String, required: function() { return this.role === 'admin'; } },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);