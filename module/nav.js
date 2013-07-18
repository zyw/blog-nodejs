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