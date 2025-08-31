const express = require('express');
const app = express();
const connect = require('./DB/connect');
require('dotenv').config();
const passport = require('./config/passport'); // already configured passport
const userRoutes = require('./routes/user');

// Middlewares
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Connect DB and start server
connect();
app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running on port ' + (process.env.PORT || 3000));
});
