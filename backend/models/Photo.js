// models/Photo.js
const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    // Add other fields as necessary
});

module.exports = mongoose.model('Photo', photoSchema);
