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
    , db = require('./db')
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

/*
 * @param objs  需要遍历的对象数组
 * @param attrs 取出的字段数组
 * @return 返回新的对象数组
 * 遍历对象数组，取出需要的字段组成新的对象数组
 * */
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
//转换字符串类型为ObjectId类型
Toolkit.toId = function(id){
    return db.toId(id);
};
//格式化输出发布文章的日期时间
Toolkit.dateFormat = function(date){
    var nowDate = new Date();
    var oneHours = 1000 * 60 * 60;
    var oneDay = oneHours * 1 * 24;
    var timeDiffer = nowDate.getTime() - date.getTime();
    if(timeDiffer < oneHours){
        var temp = new Date(timeDiffer);
        var minutes = temp.getUTCMinutes();
        return minutes + "分钟前";
    }else if(timeDiffer < oneDay){
        var temp = new Date(timeDiffer);
        var hours = temp.getUTCHours();
        return hours + "小时前";
    }else if(timeDiffer < (oneDay * 2)){
              return "昨天 " + date.getHours() + ":" + date.getMinutes();
//            全日期时间 : date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
//            + " " + date.getHours() + ":" + date.getMinutes()
    }else{
        return date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate()
            + " " + date.getHours() + ":" + date.getMinutes();
    }
};

Toolkit.page = function(total,currentPage,pagerows){
    //每一页显示多少行在settions中配置
    var rows = pagerows || settings.afterPage;
    //根据总记录数每一页显示多少行计算总页数
    var totalPages = Math.floor((total+rows-1)/rows);
    //计算起始行
    var startRow = (currentPage - 1) * rows;
    return {totalPages:totalPages,startRow:startRow,rows:rows,currentPage:currentPage};
};

//去除分页参数
Toolkit.revmoecp = function(originalUrl){
    var index = originalUrl.indexOf('cp=');
    if(index > 0){
        return originalUrl.substring(0,index-1);
    }
    return originalUrl;
};

Toolkit.revmoeTag = function(origContent){
    var result = origContent || "";
    return result.replace(/<.*?>/ig,"");
};

Toolkit.truncation = function(origContent){
    var trunNum = settings.truncation;
    var content = origContent || "";
    var len = content.length;
    if(len < trunNum)
        return origContent;
    return origContent.substring(0,trunNum) + "...";
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