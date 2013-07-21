/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-7-18
 * Time: 下午4:44
 * To change this template use File | Settings | File Templates.
 */

var db = require('./db');

function Nav(nav){
    this.id       = nav.id;
    this.number   = nav.number;
    this.title    = nav.title;
    this.icid     = nav.icid;          //包含的分类ID
    this.url      = nav.url;
    this.opentype = nav.opentype;
    this.icon     = nav.icon;
    this.parentId = nav.parentId;
    this.des      = nav.des;
};

module.exports = Nav;

Nav.prototype.save = function(callback){
    var nav = {
        id:1,
        number:this.number,
        title:this.title,
        icid:this.icid,
        url:this.url,
        opentype:this.opentype,
        icon:this.icon,
        parentId:this.parentId,
        des:this.des
    };
    db.collection('nav').find().sort({id:-1}).limit(1).toArray(function(err,maxobj){
        if(maxobj.length){
            nav.id = maxobj[0].id + 1;
        }
        db.collection("nav").insert(nav,function(err,docs){
            if(err){
                return callback(err);
            }
            return callback(err,docs);
        });
    });
};

Nav.findByParentId = function(parentId,opts,callback){
    var options = opts || {_id:1,number:1,title:1,icid:1,url:1,opentype:1,icon:1,parentId:1,des:1};
    db.collection('nav').find({parentId:parentId},options).sort({number:1}).toArray(function(err,navs){
        if(err){
            return callback(err,null);
        }
        return callback(err,navs);
    });
};

Nav.countByParentId = function(parentId,callback){
    db.collection('nav').count({parentId:parentId},function(err,count){
        if(err){
            return callback(err,0);
        }
        return callback(err,count);
    });
};

Nav.delById = function(id,callback){
    db.collection('nav').removeById(id,function(err){
        if(err){
            return callback(err);
        }
        return callback(null);
    });
};