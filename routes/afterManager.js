/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-6
 * Time: 上午11:48
 * To change this template use File | Settings | File Templates.
 */

var Aclassify = require('../module/aclassify');
var Alabel = require('../module/alabel');
var Link = require('../module/link');
var Article = require('../module/article');
var User = require('../module/user');
var Nav = require('../module/nav');
var Remark = require('../module/remark');
var Toolkit = require('../module/util');
var fs = require('fs');
var Eventproxy = require('eventproxy');
var util = require('util');
var settings = require('../settings');

exports.index = function(req,res){
    res.render('admin_views/index');
};
/*===================评语操作===============================*/
exports.remark = function(req,res){
    //获得当前页
    var currentPage = req.query.cp || 1;
    /*var ispQuery = req.query.isp ? {articlestatus:req.query.isp} : {};
    var queryConent = req.query.queryContent;
    if(queryConent){
        ispQuery['$or'] = [{ "title" : new RegExp("^.*"+queryConent+".*$")}, { "content" : new RegExp("^.*"+queryConent+".*$")}];
    }*/

    var proxy = new Eventproxy();

    proxy.assign('counts','remarks',function(counts,remarks){

    });

    proxy.fail(function(err){
        req.flash('error','查询评语失败！');
        res.render('admin_views/remark')
    });

    Remark.count({},proxy.done(function(rows){
        if(!rows){
            proxy.emit('counts',0);
            proxy.emit('remarks',null);
        }
        var pageInfo = Toolkit.page(rows,currentPage);
        proxy.emit('counts',pageInfo);

        Remark.optsSearch({},pageInfo,proxy.done(function(remarks){
            proxy.emit('remarks',remarks);
        }));
    }));

    res.render('admin_views/remark')
};
/*============================导航操作======================*/
exports.nav = function(req,res){
    res.render('admin_views/nav');
};

exports.navlist = function(req,res){
    var pid = req.query.pid || '0';
    Nav.findByParentId(pid,null,function(err,navs){
        if(!navs || !navs.length){
            return res.render('admin_views/nav_list',{navs:null});
        }
        var icids = [];
        navs.forEach(function(nav){
            var icid = nav.icid;
            if(icid){
                if(icid.indexOf(',') != -1){
                    icid.split(',').forEach(function(id){
                        icids.push(Toolkit.toId(id));
                    });
                }else{
                    icids.push(Toolkit.toId(icid));
                }
            }
        });

        Aclassify.aclassifysByIds(icids,function(err,acls){
            var aclMap = {};
            acls.forEach(function(acl){
                aclMap[acl._id] = acl.acname;
            });
            var result = [];
            navs.forEach(function(nav){
                var icid = nav.icid;
                if(!icid){
                    nav.icid = "无";
                }else{
                    if(icid.indexOf(',') != -1){
                        var acnames = [];
                        icid.split(',').forEach(function(id){
                            acnames.push(aclMap[id]);
                        });
                        nav.icid = acnames.join(',');
                    }else{
                        nav.icid = aclMap[nav.icid];
                    }
                }
                result.push(nav);
            });
            res.render('admin_views/nav_list',{navs:result});
        });
    });
};

//添加修改导航页面
exports.addupdatenav = function(req,res){
    var id = req.query._id;
    if(id){

    }else{
        var pid = req.query.pid || '0';
        var pname = req.query.pname || '主导航';
        Aclassify.aclasifyAll(function(err,acls){
            res.render('admin_views/addupdatenav',{acls:Toolkit.inspect(acls,['_id','acname']),pid:pid,pname:pname});
        });
    }
};
exports.addnav = function(req,res){
    var iconPath = "";
    if(req.files.icon.size){
        // 获得文件的临时路径
        var tmp_path = req.files.icon.path;
        // 文件名
        var fileName = req.files.icon.name;
        // 扩展名
        var extName = fileName.substring(fileName.lastIndexOf('.'));
        // 获得日期并创建日期文件夹保存不同日期的文件
        var date = new Date();
        var basePath = settings.commonPath + settings.navimgs;
        if(!fs.existsSync(basePath)){
            fs.mkdirSync(basePath);
        }
        //新文件名
        var newFileName = date.getTime() + extName;
        //移动路径
        var target_path = basePath + newFileName;
        // 移动文件
        fs.renameSync(tmp_path, target_path);
        iconPath = settings.navimgs + newFileName;
    }
    var nav = {
        number:req.body.number,
        title:req.body.title,
        icid:req.body.clssifyId,
        url:req.body.url,
        opentype:req.body.opentype,
        parentId:req.body.parentId || '0',
        icon:iconPath,
        des:req.body.des
    };

    if(nav.number == null || nav.number.trim() == ""){
        req.flash('error','请输入序号！');
        return res.redirect('/admin/addupdatenav')
    }
    if(!nav.title || !nav.title.trim()){
        req.flash('error','请输入导航标题！');
        return res.redirect('/admin/addupdatenav');
    }
    var navvo = new Nav(nav);
    navvo.save(function(err,inav){
        if(err){
            req.flash('error','插入导航异常！');
            return res.redirect('/admin/addupdatenav');
        }
        return res.redirect('/admin/nav');
    });
}

exports.navtree = function(req,res){
    var pid = req.body._id || '0';
    Nav.findByParentId(pid,{_id:1,title:1,parentId:1},function(err,navs){
        if(err){
            return res.json(null);
        }
        var proxy = new Eventproxy();
        proxy.after('count',navs.length,function(list){
            for(var i = 0; i < navs.length; i++){
                var isp = Boolean(list[i]);
                if(isp){
                    navs[i].isParent = isp;
                    navs[i].click = '$.myblog.nav_list(\''+navs[i]._id+'\')';
                }
            }
            if(pid == '0'){
                var result = {};
                //result._id = '0';
                result.title = "主导航";
                //result.parentId = '0';
                result.children = navs;
                result.click = '$.myblog.nav_list(\'0\')';
                result.open = true;
                return res.json(result);
            }
            return res.json(navs);
        });
        navs.forEach(function(nav){
            Nav.countByParentId(nav._id + "",proxy.done('count'));
        });
    });
};

exports.delnav = function(req,res){
    var id = req.query.id;
    Nav.delById(id,function(err){
        if(err){
            req.flash('error','删除失败，请稍后再试！');
            return res.redirect('/admin/nav');
        }
        req.flash('success','删除成功！');
        return res.redirect('/admin/nav');
    });
};

exports.moldboard = function(req,res){
    res.render('admin_views/moldboard')
};

exports.umanager = function(req,res){
    res.render('admin_views/umanager')
};

/*+++++++++++++++++++++用户登录操作++++++++++++++++++++++++++++++++++++++*/
//跳至登录页面
exports.login = function(req,res){
    res.render('admin_views/login');
};
//退出
exports.logout = function(req,res){
    req.session.user = null;
    res.redirect('/admin/login');
}
//完成用户登录操作
exports.postlogin = function(req,res){
    Toolkit.login(req,res,{failPage:'/admin/login',successPage:'/admin/index'});
};

//检查用户是否登录的中间件
exports.checking = function(req,res,next){
    var reqPath = req.path;
    if('/admin/login' != reqPath && '/admin/postlogin' != reqPath){
        var user = req.session.user;
        if(!user){
            req.flash('error','您还没有登录！');
            return res.redirect('/admin/login');
        }
    }
    next();
};

/*+++++++++++++++++++文章分类操作+++++++++++++++++++++++++*/
//查询文章分类信息
exports.aclassify = function(req,res){
    Aclassify.aclasifyAll(function(err,acs){
        if(err){
            req.flash('error',"查询文章分类出错！");
            return res.redirect('/admin/index');
        }
        res.render('admin_views/aclassify',{acs:acs});
    });
};
//添加文章分类
exports.addclassify = function(req,res){
    var acname = req.body.acname;
    if(acname.trim() == ""){
        req.flash('error','你为输入有效的分类名称！');
        return res.redirect('/admin/aclassify');
    }
    var aclassify = new Aclassify({acname:acname});
    aclassify.save(function(err,docs){
        if(err){
            req.flash('error','添加错误，请稍后再试！');
            return res.redirect('/admin/aclassify');
        }
        return res.redirect('/admin/aclassify');
    });
};
//删除文章分类
exports.delclassify = function(req,res){
    Aclassify.deleById(req.query.id,function(err){
        if(err){
            req.flash('error','删除失败，请稍后再试！');
            return res.redirect('/admin/aclassify');
        }
        req.flash('success','删除成功！');
        return res.redirect('/admin/aclassify');
    });
};
//修改文章分类
exports.updateclassify = function(req,res){
    var _id = req.body._id;
    var acname = req.body.updateName;
    Aclassify.update(_id,acname,function(err){
        if(err){
            req.flash('error','修改失败，请稍后再试！');
            return res.redirect('/admin/aclassify');
        }
        req.flash('success','修改成功！');
        return res.redirect('/admin/aclassify');
    });
}

/*+++++++++++++++++++文章标签操作+++++++++++++++++++++++++*/
//查询标签信息
exports.label = function(req,res){
    Alabel.alabelAll(function(err,als){
        if(err){
            req.flash('error',"查询文章标签出错！");
            return res.redirect('/admin/index');
        }
        res.render('admin_views/label',{als:als});
    });
};

//添加标签
exports.addlabel = function(req,res){
    var alname = req.body.alname;
    if(alname.trim() == ""){
        req.flash('error','你为输入有效的分类名称！');
        return res.redirect('/admin/label');
    }
    var alabel = new Alabel({alname:alname});
    alabel.save(function(err,docs){
        if(err){
            req.flash('error','添加错误，请稍后再试！');
            return res.redirect('/admin/label');
        }
        return res.redirect('/admin/label');
    });
};
//删除文章分类
exports.dellabel = function(req,res){
    Alabel.deleById(req.query.id,function(err){
        if(err){
            req.flash('error','删除失败，请稍后再试！');
            return res.redirect('/admin/label');
        }
        req.flash('success','删除成功！');
        return res.redirect('/admin/label');
    });
};
//修改文章分类
exports.updatelabel = function(req,res){
    var _id = req.body._id;
    var alname = req.body.updateName;
    Alabel.update(_id,alname,function(err){
        if(err){
            req.flash('error','修改失败，请稍后再试！');
            return res.redirect('/admin/label');
        }
        req.flash('success','修改成功！');
        return res.redirect('/admin/label');
    });
}

/*+++++++++++++++++++文章操作++++++++++++++++++++++++++++++++*/
//跳至文章列表页
exports.article = function(req,res){
    //获得当前页
    var currentPage = req.query.cp || 1;
    var ispQuery = req.query.isp ? {articlestatus:req.query.isp} : {};
    var queryConent = req.query.queryContent;
    if(queryConent){
        ispQuery['$or'] = [{ "title" : new RegExp("^.*"+queryConent+".*$")}, { "content" : new RegExp("^.*"+queryConent+".*$")}];
    }

    var proxy = new Eventproxy();
    var events = ['rows','articles','users','aclassifys','labels','allrows','publish','draft'];
    proxy.assign(events,function(rows,articles,users,aclassifys,labels,allrows,publish,draft){
        if(!articles){
            req.flash('error','没有文章信息，可能数据库没有数据！');
            return res.render('admin_views/article',
                {articles:null
                 ,pageInfo:null
                 ,baseurl:null
                 ,rows:{allrows:allrows,publish:publish,draft:draft}
                 ,queryConent:(queryConent ? queryConent : '')});
        }

        var userInfo = {};
        var aclassifyInfo = {'0':"未分类"};
        var labelInfo = {};
        users.forEach(function(user){
            userInfo[user._id] = user.name;
        });

        aclassifys.forEach(function(aclassify){
            aclassifyInfo[aclassify._id] = aclassify.acname;
        });

        labels.forEach(function(label){
            labelInfo[label._id] = label.alname;
        });
        var result = [];
        articles.forEach(function(article){
            //更改时间显示字段
            article.createDate = Toolkit.dateFormat(article.createDate);
            //更改显示用户名
            article.userId = userInfo[article.userId];
            //更改显示分类
            article.classifyId = aclassifyInfo[article.classifyId];
            //更改显示标签
            var lids = article.labelId;
            if(lids){
                if(lids.indexOf(',') != -1){
                    var labels = [];
                    var tempLabelIds = lids.split(',');
                    tempLabelIds.forEach(function(labelId){
                        labels.push(labelInfo[labelId]);
                    });
                    article.labelId = labels.join(',');
                }else{
                    article.labelId = labelInfo[article.labelId];
                }
            }else{
                article.labelId = "无";
            }
            result.push(article);
        });
        res.render('admin_views/article',
            {articles:result
                ,pageInfo:rows
                ,baseurl:Toolkit.revmoecp(req.originalUrl)
                ,rows:{allrows:allrows,publish:publish,draft:draft}
                ,queryConent:(queryConent ? queryConent : '')
            });
    });
    proxy.fail(function(err){
        req.flash('error','查询文章列表异常，请查找原因！');
        return res.render('admin_views/article',
            {articles:null
                ,pageInfo:null
                ,baseurl:null
                ,rows:null
                ,queryConent:(queryConent ? queryConent : '')});
    });

    Article.rows(ispQuery,proxy.done(function(rows){
        if(!rows){
            proxy.emit('rows',0);
            proxy.emit('articles',null);
            proxy.emit('users',[]);
            proxy.emit('aclassifys',[]);
            proxy.emit('labels',[]);
        }
        //获取分页信息
        var pageInfo = Toolkit.page(rows,currentPage);
        proxy.emit('rows',pageInfo);
        Article.optsSearch(ispQuery,pageInfo,proxy.done(function(articles){
            if(!articles){
                proxy.emit('articles',null);
                proxy.emit('users',[]);
                proxy.emit('aclassifys',[]);
                proxy.emit('labels',[]);
            }
            proxy.emit('articles',articles);

            var userIds = [];           //用户ID集合
            var aclassifyIds = [];      //文章分类ID集合
            var labelIds = [];          //文章标签ID集合
            articles.forEach(function(article){
                userIds.push(Toolkit.toId(article.userId));
                var aid = article.classifyId;
                if(aid.length == 24){
                    aclassifyIds.push(Toolkit.toId(aid));
                }
                var lid = article.labelId;
                if(lid){
                    if(lid.indexOf(',') != -1){
                        lid.split(',').forEach(function(item){
                            labelIds.push(Toolkit.toId(item));
                        });
                    }else{
                        labelIds.push(Toolkit.toId(lid));
                    }
                }
            });

            User.usersByIds(userIds,proxy.done('users'));

            Aclassify.aclassifysByIds(aclassifyIds,proxy.done('aclassifys'));

            Alabel.labelsByIds(labelIds,proxy.done('labels'));
        }));
    }));
    Article.rows({},proxy.done('allrows'));
    Article.rows({articlestatus:'publish'},proxy.done('publish'));
    Article.rows({articlestatus:'draft'},proxy.done('draft'));

//    Article.rows({},function(err,rows){
//        var pageInfo = Toolkit.page(rows,currentPage);
//        Article.optsSearch({},pageInfo,function(err,articles){
//
//            if(!articles){
//                req.flash('error','没有文章信息，可能数据库没有数据！');
//                return res.render('admin_views/article',{articles:null,pageInfo:null});
//            }
//
//            var userIds = [];           //用户ID集合
//            var aclassifyIds = [];      //文章分类ID集合
//            var labelIds = [];          //文章标签ID集合
//            articles.forEach(function(article){
//                userIds.push(Toolkit.toId(article.userId));
//                var aid = article.classifyId;
//                if(aid.length == 24){
//                    aclassifyIds.push(Toolkit.toId(aid));
//                }
//                var lid = article.labelId;
//                if(lid){
//                    if(lid.indexOf(',')){
//                        lid.split(',').forEach(function(item){
//                            labelIds.push(Toolkit.toId(item));
//                        });
//                    }else{
//                        labelIds.push(Toolkit.toId(lid));
//                    }
//                }
//            });
//            User.usersByIds(userIds,function(err,users){
//                var userInfo = {};
//                users.forEach(function(user){
//                    userInfo[user._id] = user.name;
//                });
//                Aclassify.aclassifysByIds(aclassifyIds,function(err,aclassifys){
//                    var aclassifyInfo = {};
//                    aclassifyInfo['0'] = "未分类";
//
//                    aclassifys.forEach(function(aclassify){
//                        aclassifyInfo[aclassify._id] = aclassify.acname;
//                    });
//                    Alabel.labelsByIds(labelIds,function(err,labels){
//                        //console.log(util.inspect(labelIds) + "/////////" + util.inspect(labels));
//                        var labelInfo = {};
//                        labels.forEach(function(label){
//                            labelInfo[label._id] = label.alname;
//                        });
//                        var result = [];
//                        articles.forEach(function(article){
//                            //更改时间显示字段
//                            article.createDate = Toolkit.dateFormat(article.createDate);
//                            //更改显示用户名
//                            article.userId = userInfo[article.userId];
//                            //更改显示分类
//                            article.classifyId = aclassifyInfo[article.classifyId];
//                            //更改显示标签
//                            var lids = article.labelId;
//                            if(lids){
//                                if(lids.indexOf(',')){
//                                    var labels = [];
//                                    var tempLabelIds = lids.split(',');
//                                    tempLabelIds.forEach(function(labelId){
//                                        labels.push(labelInfo[labelId]);
//                                    });
//                                    article.labelId = labels.join(',');
//                                }else{
//                                    article.labelId = labelInfo[article.labelId];
//                                }
//                            }else{
//                                article.labelId = "无";
//                            }
//                            result.push(article);
//                        });
//                        res.render('admin_views/article',{articles:result,pageInfo:pageInfo});
//                    });
//                });
//            });
//        });
//    });
};
//查询文章分类和标签跳转至写文章页面
exports.warticle = function(req,res){

    var id = req.query.id;
    var eventProxy = new Eventproxy();
    if(id){
        eventProxy.assign('article','acs','als',function(article,acs,als){
            res.render('admin_views/warticle',{
                common:{label:'修改文章',action:'/admin/updatearticle'}
                ,article:article
                ,acs:acs
                ,als:Toolkit.inspect(als,['_id','alname'])
            });
        });
        Article.findById(id,eventProxy.done('article'));
    }else{
        eventProxy.assign('acs','als',function(acs,als){
            res.render('admin_views/warticle',{
                common:{label:'写文章',action:'/admin/addarticle'}
                ,article:null
                ,acs:acs
                ,als:Toolkit.inspect(als,['_id','alname'])});
        });
    }

    eventProxy.fail(function(err){
        req.flash('error','查询文章分类或标签异常，请查找原因！');
        return res.redirect('/admin/index');
    });

    Aclassify.aclasifyAll(eventProxy.done('acs'));
    Alabel.alabelAll(eventProxy.done('als'));
};
//添加文章
exports.addarticle = function(req,res){
    _addUpdateArticle(req,res);
};
//修改文章
exports.updateArticleById = function(req,res){
    _addUpdateArticle(req,res);
};

function _addUpdateArticle(req,res){
    var id = req.body.articleId;
    var article = {
        title:req.body.articleTitle,
        content:req.body.content,
        userId:req.session.user._id,
        classifyId:req.body.aclassifyId,
        labelId:req.body.alabelId,
        createDate:new Date(),
        imgURL:req.body.imageName,
        articlestatus:req.body.articlestatus,
        attasURL:req.body.attachName
    };
    if(article.title == null || article.title.trim() == ""){
        req.flash('error','请输入文章标题！');
        return res.redirect('/admin/warticle');
    }
    if(article.content == null || article.content.trim() == ""){
        req.flash('error','请输入文章内容再发表！');
        return res.redirect('/admin/warticle');
    }
    var articlevo = new Article(article)

    if(id){
        articlevo.updateArticleById(id,function(err,article){
            if(err){
                req.flash('error','修改出错，请稍后重试！');
                return res.redirect('/admin/warticle?id=' + id);
            }
            req.flash('success','修改成功！');
            return res.redirect('/admin/article');
        });
    }else{
        articlevo.save(function(err,docs){
            if(err){
                req.flash('error','添加出错，请稍后重试！');
                return res.redirect('/admin/warticle');
            }
            req.flash('success','添加成功！');
            return res.redirect('/admin/article');
        });
    }
};

exports.delArticleById = function(req,res){
    var id = req.query.id;
    Article.deleteyId(id,function(err){
        if(err){
            req.flash('error','删除文章错误！');
            return res.redirect('/admin/article')
        }
        req.flash('success','文章删除成功！');
        return res.redirect('/admin/article');
    });
};

//上传图片
exports.uploadImage = function(req,res){
    // 获得文件的临时路径
    var tmp_path = req.files.imagefile.path;
    // 文件名
    var fileName = req.files.imagefile.name;
    // 扩展名
    var extName = fileName.substring(fileName.lastIndexOf('.'));
    // 获得日期并创建日期文件夹保存不同日期的文件
    var date = new Date();
    var dateFolder = date.getFullYear() + "" + Toolkit.plusZore(date.getMonth()+1) + "" + Toolkit.plusZore(date.getDate());
    var basePath = settings.commonPath + settings.imgaffix + dateFolder + "/";
    if(!fs.existsSync(basePath)){
        fs.mkdirSync(basePath);
    }
    //新文件名
    var newFileName = date.getTime() + extName;
    //移动路径
    var target_path = basePath + newFileName;
    // 移动文件
    fs.rename(tmp_path, target_path, function(err) {
        if (err) throw err;
        res.json({url:settings.imgaffix + dateFolder + "/" + newFileName,title:fileName,original:fileName,state:'SUCCESS'});
    });
};
//上传图片管理
exports.imgManager = function(req,res){
    Toolkit.filesPath(settings.commonPath + settings.imgaffix);
    res.send(Toolkit.pathURL);
    Toolkit.pathURL = "";
};
//上传附件
exports.attachment = function(req,res){
    //获取临时路径
    var temp_path = req.files.upfile.path;
    //文件名称
    var file_name = req.files.upfile.name;
    //文件扩展名
    var extName = file_name.substring(file_name.lastIndexOf('.'));
    var date = new Date();
    var dateFolder = date.getFullYear() + "" + Toolkit.plusZore(date.getMonth()+1) + "" + Toolkit.plusZore(date.getDate());

    var basePath = settings.commonPath + settings.attach + dateFolder + "/";

    if(!fs.existsSync(basePath)){
        fs.mkdirSync(basePath);
    }
    //新文件名
    var newFileName = date.getTime() + extName;
    //移动路径
    var target_path = basePath + newFileName;
    fs.rename(temp_path, target_path, function(err) {
        if (err) throw err;
        res.json({url:settings.attach + dateFolder + "/" + newFileName,fileType:extName,original:file_name,state:'SUCCESS'});
    });
};

/*++++++++++++++++++++++连接操作+++++++++++++++++++++++++++++++*/
//跳至添加连接页面
exports.addlinkpage = function(req,res){
    var id = req.query.id;
    if(id){
        Link.linkById(id,function(err,link){
            res.render('admin_views/addupdatelink',{common:{label:'修改连接',action:'/admin/updatelink'},link:link});
        });
    }else{
        res.render('admin_views/addupdatelink',{common:{label:'添加连接',action:'/admin/addlink'},link:null});
    }
};
//查询连接信息跳至连接列表页
exports.links = function(req,res){
    Link.linkAll(function(err,links){
        if(err){
            req.flash('error',"查询连接信息出错！");
            return res.redirect('/admin/index');
        }
        res.render('admin_views/links',{links:links});
    });
};
//添加连接
exports.addlink = function(req,res){
    _addUpdateLink(req,res);
};

exports.updateLinkById = function(req,res){
    _addUpdateLink(req,res);
};

exports.delLinkById = function(req,res){
    var id = req.query.id;
    Link.delLinkById(id,function(err){
        if(err){
            req.flash('error','删除连接出差！');
            return res.redirect('/admin/links');
        }
        req.flash('success','删除连接成功！');
        return res.redirect('/admin/links');
    });
};

function _addUpdateLink(req,res){
    var id = req.body._id;
    var link = {
        number:req.body.number,
        linkname:req.body.linkname,
        linkaddress:req.body.linkaddress,
        opentype:req.body.opentype,
        isvisible:req.body.isvisible,
        describe:req.body.describe
    };
    if(!link.number || !link.number.trim()){
        req.flash('error','请输入序号！');
        return res.redirect('/admin/addlinkpage');
    }
    if(!link.linkname || !link.linkname.trim()){
        req.flash('error','请输入连接名称！');
        return res.redirect('/admin/addlinkpage');
    }
    if(!link.linkaddress || !link.linkaddress.trim()){
        req.flash('error','请输入连接地址！');
        return res.redirect('/admin/addlinkpage');
    }
    var linkvo = new Link(link);
    if(id){
        linkvo.updateLinkById(id,function(err,link){
            if(err){
                req.flash('error','修改连接出错！');
                return res.redirect('/admin/addlinkpage?id='+id);
            }
            req.flash('success','修改连接成功！');
            return res.redirect('/admin/links');
        });
    }else{
        linkvo.save(function(err,link){
            if(err){
                req.flash('error','添加连接出错，请稍后再试！');
                return res.redirect('/admin/addlinkpage')
            }
            req.flash('success','添加连接成功！');
            return res.redirect('/admin/links');
        });
    }
}
