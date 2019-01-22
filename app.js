const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//passport config
require('./config/passport')(passport);


//routes
const auth = require('./routes/auth');

const app = express();

app.get('/', (req, res) => {
    res.send('up and running son...');
});

app.use('/auth', auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is running on ${port}`);
});