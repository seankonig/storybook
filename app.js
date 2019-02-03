require('./config/config');
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// Load User Model
require('./models/User');

// Load User Model
require('./models/Story');

// Passport Config
require('./config/passport')(passport);

// Load Routes
const auth = require('./routes/auth');
const index = require('./routes/index');
const stories = require('./routes/stories');
const user = require('./routes/user');

//handlebars helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    getAge
} = require('./helpers/hbs');

// Map global promises
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
// Mongoose Connect
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));


const app = express();

// create application/json parser
app.use(bodyParser.json());
 
// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));

//Method Override Middleware
app.use(methodOverride('_method'));

app.engine('handlebars', exphbs({
    helpers: {
        truncate,
        stripTags,
        formatDate,
        select,
        getAge
    },
    defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')

app.use(express.static(path.join(__dirname, 'public')));

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

app.use('/auth', auth);
app.use('/', index);
app.use('/stories', stories);
app.use('/user', user);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is running on ${port}`);
});