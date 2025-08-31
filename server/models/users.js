const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['student', 'admin','faculty'],
        required: true
    },
    semester: {
        type: Number,
        min: 1,
        max: 8,
    },
    department: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now()
    }
});

// Add passport-local-mongoose plugin to handle authentication
userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email' // Use email as the username field
});

const User = mongoose.model('User', userSchema);

module.exports = User;
