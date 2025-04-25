const express = require('express');
const mongoose = require('mongoose');

const songModuleSchema = mongoose.Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    audioUrl: { type: String, required: true },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Song', songModuleSchema);