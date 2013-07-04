/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-5
 * Time: 下午1:48
 * To change this template use File | Settings | File Templates.
 */

var crypto = require('crypto'),
    settings = require('../settings'),
    fs = require('fs');

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