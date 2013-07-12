
/*
 * GET home page.
 */

var EventProxy = require('eventproxy')
    , settings = require('../settings')
    , Article = require('../module/article')
    , Toolkit = require('../module/util');

/*首页获得文章*/
exports.index = function(req, res){
    //获得当前页
    var currentPage = req.query.cp || 1;
    var ispQuery = req.query.isp ? {articlestatus:req.query.isp} : {};
    var queryConent = req.query.queryContent;
    if(queryConent){
        ispQuery['$or'] = [{ "title" : new RegExp("^.*"+queryConent+".*$")}, { "content" : new RegExp("^.*"+queryConent+".*$")}];
    }
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