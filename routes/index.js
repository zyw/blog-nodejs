
/*
 * GET home page.
 */

var EventProxy = require('eventproxy');
var settings = require('../settings');
var Article = require('../module/article');
var Toolkit = require('../module/util');

/*首页获得文章*/
exports.index = function(req, res){
    //获得当前页
    var currentPage = req.query.cp || 1;
    var ispQuery = req.query.isp ? {articlestatus:req.query.isp} : {};
    var queryConent = req.query.queryContent || {};
    if(queryConent){
        ispQuery['$or'] = [{ "title" : new RegExp("^.*"+queryConent+".*$")}, { "content" : new RegExp("^.*"+queryConent+".*$")}];
    }
    queryConent.articlestatus = 'publish';
    var proxy = new EventProxy();
    proxy.assign('rows','articles',function(rows,articles){
        if(articles){
            articles.forEach(function(article){
                article.content = Toolkit.truncation(Toolkit.revmoeTag(article.content));
            });
        }
        res.render('skin_views/' +settings.template + '/index',{
            articles:articles,
            baseurl:Toolkit.revmoecp(req.originalUrl),
            pageInfo:rows,
            queryConent:(queryConent ? queryConent : '')
        });
    });

    proxy.fail(function(err){
        req.flash('error','加载文章异常！');
    });

    Article.rows(queryConent,proxy.done(function(rows){
        if(!rows){
            proxy.emit('rows',0);
            proxy.emit('articles',null);
        }
        var pageInfo = Toolkit.page(rows,currentPage,settings.beforePage);
        proxy.emit('rows',pageInfo);
        Article.optsSearch(queryConent,pageInfo,proxy.done('articles'));
    }));
};
exports.showart = function(req,res){
    var artid = req.params.artid;
    var messages = {messages:{alert:'查看的文章不存在或者已被删除！'}};
    if(artid.length != 24){
       return res.render('skin_views/' +settings.template + '/caution',messages);
    }
    Article.findById(artid,function(err,article){
        if(err){
            return res.render('skin_views/' +settings.template + '/caution',
                {messages:{error:'查询文章异常，请稍后再试！'}});
        }
        if(article)
            return res.render('skin_views/' +settings.template + '/showarticle',{article:article})
        return res.render('skin_views/' +settings.template + '/caution',messages);
    });
};