/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-4
 * Time: 下午11:11
 * To change this template use File | Settings | File Templates.
 */
module.exports = {
    siteTitle:"MyBlog",             //应用标题
    cookieSecret:'myblog',          //Cookie加密串
    dbUrl:'localhost:27017/blog',   //数据库URL
    db:'blog',                      //数据库名称
    template: 'default',            //使用的模板
    commonPath:'./public',          //基本路径供上传时使用
    imgaffix:'/ulfs/acimgs/',       //文章上传图片的路径
    attach:'/ulfs/attachs/',        //文章上传附件的路径
    navimgs:'/ulfs/navimgs/',        //导航图标上传路径
    uploadtemp:'./temp',            //上传文件的临时目录
    afterPage:10,                   //后台每页显示的条数
    beforePage:15,                  //前台首页每一页显示的条数
    truncation:200                  //首页显示文章内容的字符数，也就是显示多少字符
};