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
    imgaffix:'/ulfs/acimgs/',       //上传图片的路径
    attach:'/ulfs/attachs/',        //上传附件的路径
    uploadtemp:'./temp'             //上传文件的临时目录
};