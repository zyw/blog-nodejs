
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var MongoStore = require("connect-mongo")(express);
var settings = require('./settings');
var route = require('./route');
var middle = require('./module/custom_middle');
var flash = require('connect-flash');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
//创建上传的临时文件夹
app.use(middle.createTempDir({tempURL:settings.uploadtemp}));

app.use(express.bodyParser({uploadDir:settings.uploadtemp}));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret:settings.cookieSecret,
    key:settings.db,
    cookie:{maxAge:1000 * 60 * 60 * 24 * 2},   //session 保存时间 单位是毫秒 现在是2天
    store:new MongoStore({
        db:settings.db
    })
}));
app.use(flash());
//利用中间件代替app.dynamicHelpers
app.use(middle.middleFun());

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

