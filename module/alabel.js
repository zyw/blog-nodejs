/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-7-4
 * Time: 下午5:20
 * To change this template use File | Settings | File Templates.
 */

var db = require("./db");

function Alabel(alabel){
    this.id = alabel.id;
    this.alname = alabel.alname;
}
module.exports = Alabel;

Alabel.prototype.save = function(callback){
    var maxId = 1;
    var alname = this.alname;
    db.collection('alabel').find().sort({id:-1}).limit(1).toArray(function(err,maxobj){
        if(maxobj.length){
            maxId = maxobj[0].id + 1;
        }
        var alabel = {
            id:maxId,
            alname:alname
        }
        db.collection('alabel').insert(alabel,function(err,docs){
            if(err){
                return callback(err,null);
            }
            return callback(err,docs);
        });
    });
}

Alabel.alabelAll = function(callback){
    db.collection('alabel').find().toArray(function(err,acs){
        if(err){
            return callback(err,null);
        }
        return callback(err,acs);
    });
};
Alabel.deleById = function(id,callback){
    db.collection('alabel').removeById(id,function(err){
        if(err){
            return callback(err);
        }
        return callback(null);
    });
};
Alabel.update = function(_id,alname,callback){
    db.collection('alabel').updateById(_id,{$set:{alname:alname}},function(err){
        if(err){
            return callback(err);
        }
        return callback(null);
    });
}