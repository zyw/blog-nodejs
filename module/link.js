/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-7-6
 * Time: 下午5:04
 * To change this template use File | Settings | File Templates.
 */

var db = require('./db');

function Link(link){
    this.id = link.id;
    this.number = link.number;
    this.linkname = link.linkname;
    this.linkaddress = link.linkaddress;
    this.opentype = link.opentype;
    this.isvisible = link.isvisible;
    this.describe = link.describe
};

module.exports = Link;

Link.prototype.save = function(callback){
    var link = {
        id:1,
        number:this.number,
        linkname:this.linkname,
        linkaddress:this.linkaddress,
        opentype:this.opentype,
        isvisible:this.isvisible,
        describe:this.describe
    };
    db.collection('link').find().sort({id:-1}).limit(1).toArray(function(err,maxobj){
        if(maxobj.length){
            link.id = maxobj[0].id + 1;
        }

        db.collection('link').insert(article,function(err,docs){
            if(err){
                return callback(err,null);
            }
            return callback(err,docs);
        });
    });
};

Link.linkAll = function(callback){
    db.collection('link').find().toArray(function(err,acs){
        if(err){
            return callback(err,null);
        }
        return callback(err,acs);
    });
};