/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-7-28
 * Time: 下午2:10
 * To change this template use File | Settings | File Templates.
 */

var db = require('./db');

function Remark(remark){
    this.id = remark.id;
    this.articleId = remark.articleId;
    this.name = remark.name;
    this.email = remark.email;
    this.site = remark.site;
    this.rcontent = remark.rcontent;
    this.rdt = remark.rdt;          //发布评语的时间
    this.pid = remark.pid;            //父评语
};

module.exports = Remark;

Remark.prototype.save = function(callback){
    var remark = {
        id:1,
        articleId:this.articleId,
        name:this.name,
        email:this.email,
        site:this.site,
        rcontent:this.rcontent,
        rdt:this.rdt,
        pid:this.pid
    };
    db.collection('remark').find().sort({id:-1}).limit(1).toArray(function(err,maxobj){
        if(maxobj.length){
            remark.id = maxobj[0].id + 1;
        }
        db.collection("remark").insert(remark,function(err,docs){
            if(err){
                return callback(err);
            }
            return callback(err,docs);
        });
    });
};

Remark.findByPid = function(artId,pid,callback){
    db.collection('remark').find({articleId:artId,pid:pid}).sort({rdt:1}).toArray(function(err,remarks){
        if(err){
            callback(err,null);
        }
        callback(err,remarks);
    });
};