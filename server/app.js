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


app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port 3000")
});