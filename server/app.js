const express = require('express');
const app=express();
const User = require('./models/users');
const connect=require("./DB/connect");
const jwt = require('jsonwebtoken');
const passport = require('./config/passport');
require('dotenv').config();

app.use(express.json()); // Add this line to parse JSON request bodies

app.get('/',(req,res)=>{
    res.send("Hello World");
});

// Initialize passport-local-mongoose strategy
passport.use(User.createStrategy());

// Serialize and deserialize user for session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

connect();
app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port 3000")
});