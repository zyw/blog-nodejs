/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-6
 * Time: 上午11:42
 * To change this template use File | Settings | File Templates.
 */

var afterManager = require('./routes/afterManager')
    , routes = require('./routes/')
    , user = require('./routes/user');

module.exports =function(app){
    app.get('/', routes.index);

    app.get('/reg',user.reg);
    app.get('/login',user.login);
    app.get('/logout',user.logout);

    app.post('/postreg',user.postreg);
    app.post('/postlogin',user.postlogin);

    app.get('/showart/:artid',routes.showart);

    app.post('/addRemark',routes.addRemark);
    app.post('/findRemark',routes.findRemark);




    //包含admin的访问目录
    app.all('/admin/*',afterManager.checking);

    app.get('/admin',function(req,res){
        res.redirect('/admin/index');
    });

    app.get('/admin/login',afterManager.login);
    app.get('/admin/logout',afterManager.logout);
    app.post('/admin/postlogin',afterManager.postlogin);

    app.get('/admin/index',afterManager.index);

    app.get('/admin/warticle',afterManager.warticle);
    app.post('/admin/addarticle',afterManager.addarticle);
    app.post('/admin/updatearticle',afterManager.updateArticleById);
    app.post('/admin/uploadImage',afterManager.uploadImage);
    app.post('/admin/imgManager',afterManager.imgManager);
    app.post('/admin/attachment',afterManager.attachment);

    app.get('/admin/article',afterManager.article);
    app.get('/admin/delarticle',afterManager.delArticleById);

    app.get('/admin/aclassify',afterManager.aclassify);
    app.get("/admin/delclassify",afterManager.delclassify);
    app.post('/admin/addclassify',afterManager.addclassify);
    app.post('/admin/updateclassify',afterManager.updateclassify);

    app.get('/admin/label',afterManager.label);
    app.get('/admin/dellabel',afterManager.dellabel);
    app.post('/admin/addlabel',afterManager.addlabel);
    app.post('/admin/updatelabel',afterManager.updatelabel);

    app.get('/admin/remark',afterManager.remark);
    /*导航*/
    app.get('/admin/nav',afterManager.nav);
    app.get('/admin/addupdatenav',afterManager.addupdatenav);   //跳转至添加修改导航的页面
    app.get('/admin/navlist',afterManager.navlist);
    app.get('/admin/delnav',afterManager.delnav);
    app.post('/admin/addnav',afterManager.addnav);
    app.post('/admin/navtree',afterManager.navtree);

    app.get('/admin/moldboard',afterManager.moldboard);

    app.get('/admin/links',afterManager.links);
    app.get('/admin/addlinkpage',afterManager.addlinkpage);
    app.get('/admin/dellink',afterManager.delLinkById);
    app.post('/admin/addlink',afterManager.addlink);
    app.post('/admin/updatelink',afterManager.updateLinkById);

    app.get('/admin/umanager',afterManager.umanager);
};