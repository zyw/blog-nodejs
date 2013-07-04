/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-4
 * Time: 下午11:08
 * To change this template use File | Settings | File Templates.
 */

var db = require("./db");

function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
};

module.exports = User;

User.prototype.save = function(callback){
    var user = {
        name : this.name,
        password:this.password,
        email:this.email
    };
    db.collection("user").insert(user,function(err,docs){
        if(err){
            return callback(err);
        }
        return callback(err,docs);
    });
}
User.findByName = function(name,callback){
    db.collection('user').findOne({name:name},function(err,doc){
        if(err){
            return callback(err,null);
        }
        if(doc){
            var user = new User(doc);
            return callback(err,user);
        }else{
            return callback(err,null);
        }
    });
};
