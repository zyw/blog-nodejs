
/**
 * Module dependencies.
 */

var express = require('express')
  , route = require('./route')
  , http = require('http')
  , path = require('path')
  , MongoStore = require("connect-mongo")(express)
  , settings = require('./settings')
  , flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(flash());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({uploadDir:'./temp'}));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret:settings.cookieSecret,
    key:settings.db,
    cookie:{maxAge:1000},   //cookie存储天数
    store:new MongoStore({
        db:settings.db
    })
}));
//利用中间件代替app.dynamicHelpers
app.use(function(req,res,next){
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.user = req.session.user;
    next();
});
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//代替helpers
app.locals({
    title:settings.siteTitle
});

route(app);

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

