/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-7
 * Time: 上午12:03
 * To change this template use File | Settings | File Templates.
 */
var db = require("./db");
function Aclassify(aclassify){
    this.id = aclassify.id;
    this.acname = aclassify.acname;
}

module.exports = Aclassify;

Aclassify.prototype.save = function(callback){
    var maxId = 1;
    var acname = this.acname;
    db.collection('aclassify').find().sort({id:-1}).limit(1).toArray(function(err,maxobj){
        if(maxobj.length){
            maxId = maxobj[0].id + 1;
        }
        var aclassify = {
            id:maxId,
            acname:acname
        }
        db.collection('aclassify').insert(aclassify,function(err,docs){
            if(err){
                return callback(err,null);
            }
            return callback(err,docs);
        });
    });
}

Aclassify.aclasifyAll = function(callback){
    db.collection('aclassify').find().toArray(function(err,acs){
        if(err){
            return callback(err,null);
        }
        return callback(err,acs);
    });
};
Aclassify.deleById = function(id,callback){
    db.collection('aclassify').removeById(id,function(err){
        if(err){
            return callback(err);
        }
        return callback(null);
    });
};
Aclassify.update = function(_id,acname,callback){
    db.collection('aclassify').updateById(_id,{$set:{acname:acname}},function(err){
        if(err){
            return callback(err);
        }
        return callback(null);
    });
};

Aclassify.aclassifysByIds = function(ids,callback){
    db.collection('aclassify').find({_id:{'$in':ids}}).toArray(function(err,aclassifys){
        if(err){
            return callback(err,null);
        }
        return callback(err,aclassifys);
    });
}
