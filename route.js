/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-6
 * Time: 上午11:42
 * To change this template use File | Settings | File Templates.
 */

var common = require('./routes/common')
    , routes = require('./routes/')
    , user = require('./routes/user');

module.exports =function(app){
    app.get('/', routes.index);

    //app.get('/users', user.list);
    app.get('/reg',user.reg);
    app.get('/login',user.login);
    app.get('/logout',user.logout);
    app.post('/reg',user.reg);
    app.post('/login',user.login);


    //包含admin的访问目录
    app.all('/admin/*',common.checking);

    app.get('/admin/login',common.login);

    app.get('/admin/index',common.index);

    app.get('/admin/warticle',common.warticle);
    app.post('/admin/uploadImage',common.uploadImage);
    app.post('/admin/imgManager',common.imgManager);
    app.post('/admin/attachment',common.attachment);


    app.get('/admin/article',common.article);

    app.get('/admin/aclassify',common.aclassify);
    app.get("/admin/delclassify",common.delclassify);
    app.post('/admin/addclassify',common.addclassify);
    app.post('/admin/updateclassify',common.updateclassify);

    app.get('/admin/label',common.label);
    app.get('/admin/remark',common.remark);
    app.get('/admin/nav',common.nav);
    app.get('/admin/moldboard',common.moldboard);
    app.get('/admin/links',common.links);
    app.get('/admin/umanager',common.umanager);
};