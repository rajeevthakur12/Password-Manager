const home = require('../routes/home');
const join = require('../routes/join');
const error = require('../middleware/error');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const record = require('../routes/record');


module.exports = function(app, express) {
   
    // flash messaging...
    app.use(cookieParser('keyboard cat'));
    app.use(session({ 
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }}
    ));
    app.use(flash());

    //standard middleware for parsing json request
    app.use(express.json());

    //form data parsing
    app.use(express.urlencoded({extended:true}));

    // rendering public static files
    app.use('/', express.static('public'));

    //set view engine ejs
    app.set('view engine', 'ejs');

    // route
    app.use('/', home);
    app.use('/join/', join);
    app.use('/secret/', record);
    app.use(error);
}