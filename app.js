var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
var logger = require('morgan');
const session = require('express-session');
const MongoStore = require('connect-mongo');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//export libraries
var config=require('./config/globals');
var mongoose=require('mongoose');
const { Session } = require('inspector');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride('_method'));
// Session configuration
const sessionStore = MongoStore.create({
  mongoUrl: 'mongodb+srv://admin3:Assignment02@cluster0.b9kehct.mongodb.net/Assignment'
});

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use('/', indexRouter);
app.use('/', require('./routes/admin'));
// app.use('/users', usersRouter);
//configure mongoose
mongoose.connect(config.db, {
  useNewUrlParser: true, useUnifiedTopology: true
}).then((message)=>{
  console.log('Done!')
}).catch((err)=>{
  console.log('Error'+err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
