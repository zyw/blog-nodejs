/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-7-6
 * Time: 上午11:17
 * To change this template use File | Settings | File Templates.
 */


var fs = require('fs');

function Middle(){};

module.exports = Middle;

//创建上传的临时文件夹
Middle.createTempDir = function(opts){
    var opts = opts || {};
    var uploadTempURL = opts.tempURL || './temp';
    return function(req,res,next){
                if(!fs.existsSync(uploadTempURL)){
                    fs.mkdirSync(uploadTempURL);
                }
                next();
           }
};

//利用中间件代替app.dynamicHelpers
Middle.middleFun = function(){
    return function(req,res,next){
                res.locals.success = req.flash('success');
                res.locals.error = req.flash('error');
                res.locals.user = req.session.user;
                res.locals.navs = req.session.navs;
                next();
           }
}