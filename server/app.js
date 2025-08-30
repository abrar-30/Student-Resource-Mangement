const express = require('express');
const app=express();
const User = require('./models/users');
const jwt = require('jsonwebtoken');
const passport = require('./config/passport');
const passportLocalMongoose = require('passport-local-mongoose');
require('dotenv').config();

app.use(express.json()); // Add this line to parse JSON request bodies

app.get('/',(req,res)=>{
    res.send("Hello World");
});

// Add passport-local-mongoose plugin to the User schema
UserSchema.plugin(passportLocalMongoose, {
    usernameField: 'email', // Use email as the username field
    hashField: 'password', // Store hashed password
    saltField: 'salt'      // Store salt for hashing
});

// Initialize passport-local-mongoose strategy
passport.use(User.createStrategy());

// Serialize and deserialize user for session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Route to create a new user
app.post('/create-user', async (req, res) => {
    const { id, name, email, password, role } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({
            id,
            name,
            email,
            password,
            role
        });

        await newUser.save();

        // Generate JWT
        const token = jwt.sign({ id: newUser.id, role: newUser.role }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });

        res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port 3000")
});