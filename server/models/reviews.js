const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    resource_id: {
        type: mongoose.Schema.Types.Number,
        ref: 'Resource',
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.Number,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;