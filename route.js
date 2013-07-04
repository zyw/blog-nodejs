/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-6
 * Time: 上午11:42
 * To change this template use File | Settings | File Templates.
 */

var afterManager = require('./routes/afterManager')
    , routes = require('./routes/')
    , user = require('./routes/user')
    , pagesRender = require('./routes/pagesRender');

module.exports =function(app){
    app.get('/', routes.index);

    app.get('/reg',user.reg);
    app.get('/login',user.login);
    app.get('/logout',user.logout);

    app.post('/postreg',user.postreg);
    app.post('/postlogin',user.postlogin);


    //包含admin的访问目录
    app.all('/admin/*',afterManager.checking);

    app.get('/admin/login',afterManager.login);
    app.post('/admin/postlogin',afterManager.postlogin);

    app.get('/admin/index',afterManager.index);

    app.get('/admin/warticle',afterManager.warticle);
    app.post('/admin/uploadImage',afterManager.uploadImage);
    app.post('/admin/imgManager',afterManager.imgManager);
    app.post('/admin/attachment',afterManager.attachment);
    app.post('/admin/saveWarticle',afterManager.saveWarticle);


    app.get('/admin/article',afterManager.article);

    app.get('/admin/aclassify',afterManager.aclassify);
    app.get("/admin/delclassify",afterManager.delclassify);
    app.post('/admin/addclassify',afterManager.addclassify);
    app.post('/admin/updateclassify',afterManager.updateclassify);

    app.get('/admin/label',afterManager.label);
    app.get('/admin/remark',afterManager.remark);
    app.get('/admin/nav',afterManager.nav);
    app.get('/admin/moldboard',afterManager.moldboard);
    app.get('/admin/links',afterManager.links);
    app.get('/admin/umanager',afterManager.umanager);
};