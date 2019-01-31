require('./config/config');
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');

// Load User Model
require('./models/User');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');

// Map global promises
mongoose.Promise = global.Promise;
// Mongoose Connect
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}))

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Set global vars
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
})

app.use('/', index);
app.use('/auth', auth);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is running on ${port}`);
});