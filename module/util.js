/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-5
 * Time: 下午1:48
 * To change this template use File | Settings | File Templates.
 */

var crypto = require('crypto')
    , settings = require('../settings')
    , fs = require('fs')
    , util = require('util')
    , User = require("./user");

function Toolkit(){};

module.exports = Toolkit;

Toolkit.md5 = function(original){
    var md5Obj = crypto.createHash('md5');
    var ciphertext = md5Obj.update(original).digest('hex');
    return ciphertext;
};
Toolkit.plusZore = function(number){
    return number < 10 ? '0' + number : number;
};
//递归遍历文件夹中的文件

Toolkit.pathURL = "";

Toolkit.filesPath = function(path){
    //异步方式没有实现
//    fs.readdir(path,function(err,files){
//        files.forEach(function(fileName){
//            var pathName = path + "/" + fileName;
//            if(!fs.statSync(pathName).isDirectory()){
//                Toolkit.pathURL += pathName + "ue_myblog_ue";
//            }else{
//                Toolkit.filesPath(pathName);
//            }
//        });
//
//    });
    var files = fs.readdirSync(path);
    files.forEach(function(fileName){
        var pathName = path + "/" + fileName;
            if(!fs.statSync(pathName).isDirectory()){
                var diplayPath = pathName.substring(settings.commonPath.length);
                Toolkit.pathURL += diplayPath + "ue_myblog_ue";
            }else{
                Toolkit.filesPath(pathName);
            }
    });
};

Toolkit.inspect = function(objs,attrs){
    if(objs == null)
        return "[]";

    var result = [];
    for(var i = 0; i<objs.length; i++){
        var avs = [];
        if(attrs != null && attrs != undefined){
            for(var j = 0; j < attrs.length; j++){
                avs.push(attrs[j] + ":'" + objs[i][attrs[j]] + "'");
            }
        }else{
            for(var key in objs[i]){
                avs.push(key + ":'" + objs[i][key] + "'");
            }
        }
        result[i] = "{" + avs.join(',') + "}";
    }
    return "[" + result.join(',') + "]";
};

Toolkit.login = function(req,res,opts){
    var name = req.body.inputName,
        password = req.body.inputPassword;
    User.findByName(name,function(err,user){
        if(err){
            req.flash('error','登录失败，请稍后重试！');
            return res.redirect(opts.failPage);
        }
        if(!user){
            req.flash('error','用户不存在！');
            return res.redirect(opts.failPage);
        }
        //检查密码是否一致
        if(Toolkit.md5(password) != user.password){
            req.flash('error','输入密码有误!');
            return res.redirect(opts.failPage);
        }
        req.session.user = user;
        res.redirect(opts.successPage);
    });
}