/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-7-5
 * Time: 下午3:31
 * To change this template use File | Settings | File Templates.
 */

var db = require("./db");

function Article(article){
    this.id = article.id;
    this.title = article.title;
    this.content = article.content;
    this.userId = article.userId;
    this.classifyId = article.classifyId;
    this.labelId = article.labelId;
    this.createDate = article.createDate;
    this.imgURL = article.imgURL;
    this.attasURL = article.attasURL;
}
module.exports = Article;

Article.prototype.save = function(callback){
    var article = {
        id:1,
        title:this.title,
        content:this.content,
        userId:this.userId,
        classifyId:this.classifyId,
        labelId:this.labelId,
        createDate:this.createDate,
        imgURL:this.imgURL,
        attasURL:this.attasURL
    };
    db.collection('article').find().sort({id:-1}).limit(1).toArray(function(err,maxobj){
        if(maxobj.length){
            article.id = maxobj[0].id + 1;
        }

        db.collection('article').insert(article,function(err,docs){
            if(err){
                return callback(err,null);
            }
            return callback(err,docs);
        });
    });
};