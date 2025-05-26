var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
require('./mqtt/tracker');

// vključimo mongoose in ga povežemo z MongoDB
var mongoose = require('mongoose');
var mongoDB = process.env.BASE_LINK;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// vključimo routerje
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/userRoutes');
var fridgeRouter = require('./routes/fridgeRoutes');
var recipeRouter = require('./routes/recipeRoutes');
var barcodeRouter = require('./routes/barcodeRoutes');
var loginConfirmationRoutes = require('./routes/loginConfirmationRoutes');
var mqttRoutes = require('./routes/mqttRoutes');



var app = express();
const cors = require('cors');
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Vključimo session in connect-mongo.
 * Connect-mongo skrbi, da se session hrani v bazi.
 * Posledično ostanemo prijavljeni, tudi ko spremenimo kodo (restartamo strežnik)
 */
var session = require('express-session');
var MongoStore = require('connect-mongo');
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: mongoDB}),
  cookie: {
    sameSite: 'lax', // or 'none' if using HTTPS across origins
    secure: false,   // true if you're using HTTPS
    httpOnly: true
  }
}));
//Shranimo sejne spremenljivke v locals
//Tako lahko do njih dostopamo v vseh view-ih (glej layout.hbs)
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});
const auth = require('./middleware/auth');

app.get('/test-auth', auth, (req, res) => {
  res.json({ success: true, user: req.user });
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/myfridge', fridgeRouter);
app.use('/recipes', recipeRouter);
app.use('/barcodes', barcodeRouter);
app.use('/login-confirmation', loginConfirmationRoutes);
app.use('/api', mqttRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  if (
      req.originalUrl.startsWith('/login-confirmation') ||
      req.originalUrl.startsWith('/api') ||
      req.headers.accept && req.headers.accept.includes('application/json')
  ) {
    res.json({ error: err.message });
  } else {
    res.render('error');
  }
});
module.exports = app;