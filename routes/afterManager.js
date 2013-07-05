/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-6
 * Time: 上午11:48
 * To change this template use File | Settings | File Templates.
 */

var Aclassify = require('../module/aclassify')
    , Alabel = require('../module/alabel')
    , Article = require('../module/article')
    , Toolkit = require('../module/util')
    , fs = require('fs')
    , settings = require('../settings');

/*---------------------渲染页面----------------------------------*/

exports.login = function(req,res){
    res.render('admin_views/login');
};

exports.index = function(req,res){
    res.render('admin_views/index');
};

exports.article = function(req,res){
    res.render('admin_views/article')
};

exports.remark = function(req,res){
    res.render('admin_views/remark')
};

exports.nav = function(req,res){
    res.render('admin_views/nav')
};

exports.moldboard = function(req,res){
    res.render('admin_views/moldboard')
};

exports.links = function(req,res){
    res.render('admin_views/links')
};

exports.umanager = function(req,res){
    res.render('admin_views/umanager')
};

/*---------------------填充数据加渲染页面-------------------------------*/

exports.aclassify = function(req,res){
    Aclassify.aclasifyAll(function(err,acs){
        if(err){
            req.flash('error',"查询文章分类出错！");
            return res.redirect('/admin/index');
        }
        res.render('admin_views/aclassify',{acs:acs});
    });
};

exports.warticle = function(req,res){
    Aclassify.aclasifyAll(function(err,acs){
        Alabel.alabelAll(function(err,als){
            res.render('admin_views/warticle',{acs:acs,als:Toolkit.inspect(als,['_id','alname'])});
        });
    });
};

exports.label = function(req,res){
    Alabel.alabelAll(function(err,als){
        if(err){
            req.flash('error',"查询文章标签出错！");
            return res.redirect('/admin/index');
        }
        res.render('admin_views/label',{als:als});
    });
};

/*---------------------逻辑处理----------------------------------*/

//用户登录
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

exports.saveWarticle = function(req,res){

};

/*+++++++++++++++++++文章分类操作+++++++++++++++++++++++++*/
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

/*+++++++++++++++++++文章操作+++++++++++++++++++++++++*/

//添加文章
exports.addarticle = function(req,res){
    var article = {
        title:req.body.articleTitle,
        content:req.body.content,
        userId:req.session.user._id,
        classifyId:req.body.aclassifyId,
        labelId:req.body.alabelId,
        createDate:new Date(),
        imgURL:req.body.imageName,
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
    var article = new Article(article)
    article.save(function(err,docs){
        if(err){
            req.flash('error','添加出错，请稍后重试！');
            return res.redirect('/admin/warticle');
        }
        return res.redirect('/admin/article');
    });
}

