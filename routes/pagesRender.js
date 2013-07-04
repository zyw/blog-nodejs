/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-7-4
 * Time: 下午3:10
 * To change this template use File | Settings | File Templates.
 */

var settings = require('../settings');

//渲染注册页面
exports.reg = function(req,res){
    res.render('skin_views/' +settings.template + '/reg');
};
//渲染登录页面
exports.login = function(req,res){
    res.render('skin_views/' +settings.template + '/login');
};
//退出
exports.logout = function(req,res){
    req.session.user = null;
    res.render('skin_views/' +settings.template + '/suclogout');
}