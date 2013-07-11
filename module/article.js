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
    this.articlestatus = article.articlestatus;         //文章状态 目前分：publish(发布)和draft(草稿)两种
    this.remarkcount = article.remarkcount;             //评述数量
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
        attasURL:this.attasURL,
        articlestatus:this.articlestatus,
        remarkcount:0
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
Article.optsSearch = function(query,opts,callback){
    var querys = query || {};
    db.collection('article').find(querys).skip(opts.startRow).limit(opts.rows).sort({createDate:-1}).toArray(function(err,articles){
        if(err){
            return callback(err,null);
        }
        return callback(err,articles);
    });
};

Article.findById = function(id,callback){
    db.collection('article').findById(id,function(err,article){
        if(err){
            return callback(err,null);
        }
        return callback(err,article);
    });
};

Article.rows = function(query,callback){
    var querys = query || {};
    db.collection('article').count(querys,function(err,rows){
        if(err){
            callback(err,0);
        }
        callback(err,rows);
    });
};
Article.deleteyId = function(id,callback){
    db.collection('article').removeById(id,function(err){
        if(err){
            return callback(err);
        }
        return callback(null);
    });
};