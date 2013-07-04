/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-6
 * Time: 上午11:48
 * To change this template use File | Settings | File Templates.
 */

var Aclassify = require('../module/aclassify'),
    util = require('../module/util'),
    fs = require('fs'),
    settings = require('../settings');

/*---------------------渲染页面----------------------------------*/

exports.login = function(req,res){
    res.render('admin_views/login');
};

exports.index = function(req,res){
    res.render('admin_views/index');
};

exports.warticle = function(req,res){
    res.render('admin_views/warticle')
};

exports.article = function(req,res){
    res.render('admin_views/article')
};

exports.label = function(req,res){
    res.render('admin_views/label')
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
        res.render('admin_views/aclassify',{acs:acs});
    });
};

/*---------------------逻辑处理----------------------------------*/
exports.checking = function(req,res,next){
    var reqPath = req.path;
    if('/admin/login' != reqPath){
        var user = req.session.user;
        if(!user){
            req.flash('error','您还没有登录！');
            return res.redirect('/admin/login');
        }
    }
    next();
};

exports.uploadImage = function(req,res){
    // 获得文件的临时路径
    var tmp_path = req.files.imagefile.path;
    // 文件名
    var fileName = req.files.imagefile.name;
    // 扩展名
    var extName = fileName.substring(fileName.lastIndexOf('.'));
    // 获得日期并创建日期文件夹保存不同日期的文件
    var date = new Date();
    var dateFolder = date.getFullYear() + "" + util.plusZore(date.getMonth()+1) + "" + util.plusZore(date.getDate());
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
exports.imgManager = function(req,res){
    util.filesPath(settings.commonPath + settings.imgaffix);
    res.send(util.pathURL);
    util.pathURL = "";
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
    var dateFolder = date.getFullYear() + "" + util.plusZore(date.getMonth()+1) + "" + util.plusZore(date.getDate());

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

exports.addclassify = function(req,res){
    var acname = req.body.acname;
    if(acname.trim() == ""){
        req.flash('error','你为输入有效的分类名称！');
        return res.redirect('/admin/aclassify');
    }
    var aclassify = new Aclassify({acname:req.body.acname});
    aclassify.save(function(err,docs){
        if(err){
            req.flash('error','添加错误，请稍后再试！');
            return res.redirect('/admin/aclassify');
        }
        return res.redirect('/admin/aclassify');
    });
};
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
exports.updateclassify = function(req,res){
    var _id = req.body._id;
    var acname = req.body.acname;
    console.log("id: " + _id + "--name: " + acname);
    Aclassify.update(_id,acname,function(err){
        if(err){
            req.flash('error','修改失败，请稍后再试！');
            return res.redirect('/admin/aclassify');
        }
        req.flash('success','修改成功！');
        return res.redirect('/admin/aclassify');
    });
}
