/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-4
 * Time: 下午11:08
 * To change this template use File | Settings | File Templates.
 */

var db = require("./db");

function User(user){
    this.id = user.id;
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback){
    var user = {
        id:1,
        name : this.name,
        password:this.password,
        email:this.email
    };
    db.collection('user').find().sort({id:-1}).limit(1).toArray(function(err,maxobj){
        if(maxobj.length){
            user.id = maxobj[0].id + 1;
        }
        db.collection("user").insert(user,function(err,docs){
            if(err){
                return callback(err);
            }
            return callback(err,docs);
        });
    });
}
User.findByName = function(name,callback){
    db.collection('user').findOne({name:name},function(err,doc){
        if(err){
            return callback(err,null);
        }
        if(doc){
            return callback(err,doc);
        }else{
            return callback(err,null);
        }
    });
};

User.userById = function(id,callback){
    db.collection('user').findById(id,function(err,user){
        if(err){
            return callback(err,null);
        }
        return callback(err,user);
    });
};
