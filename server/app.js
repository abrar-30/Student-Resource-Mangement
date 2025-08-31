const express = require('express');
const app = express();
const User = require('./models/users');
const connect = require('./DB/connect');
const jwt = require('jsonwebtoken');
const passport = require('./config/passport');
const user = require('./routes/user');
require('dotenv').config();

app.use(express.json()); // Parse JSON request bodies
app.use('/api/user', user);

app.get('/', (req, res) => {
    res.send('Hello World');
});

// Initialize passport-local-mongoose strategy
passport.use(User.createStrategy());

connect();
app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running on port 3000');
});