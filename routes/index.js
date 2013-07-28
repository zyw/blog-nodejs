
/*
 * GET home page.
 */

var EventProxy = require('eventproxy');
var settings = require('../settings');
var Article = require('../module/article');
var Toolkit = require('../module/util');
var Nav = require('../module/nav');
var Remark = require('../module/remark');
var util = require('util');

/*首页获得文章*/
exports.index = function(req, res){
    //获得当前页
    var currentPage = req.query.cp || 1;
    var ispQuery = req.query.isp ? { articlestatus:req.query.isp } : {};
    var queryConent = req.query.queryContent || {};
    if(queryConent){
        ispQuery['$or'] = [{ "title" : new RegExp("^.*"+queryConent+".*$")}, { "content" : new RegExp("^.*"+queryConent+".*$")}];
    }
    queryConent.articlestatus = 'publish';
    var proxy = new EventProxy();
    proxy.assign('rows','articles','navs',function(rows,articles,navs){
        if(articles){
            articles.forEach(function(article){
                article.content = Toolkit.truncation(Toolkit.revmoeTag(article.content));
            });
        }
        proxy.after('navchildren',navs.length,function(navchildren){
            for(var i = 0; i < navs.length; i++){
                navs[i].children = navchildren[i];
            }
            res.locals.navs = req.session.navs = navs;
            res.render('skin_views/' +settings.template + '/index',{
                articles:articles,
                baseurl:Toolkit.revmoecp(req.originalUrl),
                pageInfo:rows,
                queryConent:(queryConent ? queryConent : '')
            });
        });
        navs.forEach(function(nav){
            var id = nav._id;
            Nav.findByParentId(id + '',null,proxy.done('navchildren'));
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
    Nav.findByParentId('0',null,proxy.done('navs'));
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
            return res.render('skin_views/' +settings.template + '/showarticle',{rstates:null,article:article})
        return res.render('skin_views/' +settings.template + '/caution',messages);
    });
};
exports.addRemark = function(req,res){
    var remark = {
        articleId:req.body.articleId,
        name:req.body.rname,
        email:req.body.email,
        site:req.body.site,
        rcontent:req.body.remark,
        rdt:new Date(),
        pid:req.body.pid || '0'
    };
    var remark = new Remark(remark);
    remark.save(function(err,remark){
        if(err){
            res.json({rstates:5,message:'发布评语失败！'});
        }
        res.json({rstates:4,message:'发布评语成功！'});
    });
};
exports.findRemark = function(req,res){
    var artId = req.body.artId;
    var proxy = new EventProxy();
    Remark.findByPid(artId,'0',function(err,remarks){
        proxy.after('rlist',remarks.length,function(rlist){
            console.log(util.inspect(rlist,true));
            res.json(rlist);
        });
        remarks.forEach(function(remark){
            Remark.findByPid(artId,remark._id + "",function(err,remarks){
                remark.children = remarks;
                proxy.emit('rlist',remark);
            });
        });
    });
};