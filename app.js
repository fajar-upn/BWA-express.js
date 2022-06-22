var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// method override for use method="put" (update data)
const methodOverride = require('method-override')
// express session for manage session
const session = require('express-session')
// flash for show flash message
const flash = require('connect-flash')

// cors for allow API to consumed in Front end
var cors = require('cors')

/**
 * this code for connect to database MongoDB (Mongoose)
 * import mongoose and create connection
 */
const mongoose = require('mongoose')


mongoose.connect('<DATABASE_CONNECT>', {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
})

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

/**
 * router admin
 * router api
 */
const adminRouter = require("./routes/admin")
const apiRouter = require("./routes/api.js")

var app = express();

/**
 * this code for allow API from server to front end
 */
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// method override setup
app.use(methodOverride('_method'))

/**
 * method for initialize express session
 * please read more in npmjs.com
 */
app.use(session({
  secret: 'keyboard car',
  resave: false,
  saveUninitialized: true,
  // cookie: { maxAge: 3600000 } //for organize available session, if not set can't auto logout
}))

// method for initialize flash
app.use(flash())

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// call template sbadmin2
app.use('/sb-admin-2', express.static(path.join(__dirname, 'node_modules/startbootstrap-sb-admin-2')))

app.use('/', indexRouter);
app.use('/users', usersRouter);
/**
 * use admin routes ('/routes/admin')
 * use api routes ('/routes/api')
 */
app.use('/admin', adminRouter)
app.use('/api/v1/member', apiRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
