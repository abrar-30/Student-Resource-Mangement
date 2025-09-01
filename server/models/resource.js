const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['ppt', 'notes', 'book', 'lab manual', 'mid paper', 'gtu paper'],
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    file_url: {
        type: String,
        required: true
    },
    uploaded_by: {
        type: mongoose.Schema.Types.Number,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;