
/*
 * GET users listing.
 */

var User = require("../module/user")
    , Toolkit = require('../module/util')
    , settings = require('../settings');

/*------------------页面渲染---------------------------*/
//渲染注册页面
exports.reg = function(req,res){
    res.render('skin_views/' +settings.template + '/reg');
};
//渲染登录页面
exports.login = function(req,res){
    res.render('skin_views/' +settings.template + '/login');
};
//退出
exports.logout = function(req,res){
    req.session.user = null;
    res.render('skin_views/' +settings.template + '/suclogout');
}

/*---------------------逻辑处理------------------------------------*/
//注册
exports.postreg = function(req,res){
    var p1 = req.body['inputPassword'],
        p2 = req.body['qrPassword'];
    if(p1 !== p2){
        req.flash('error','两次输入密码不一致！');
        return res.redirect('/reg');
    }

    var user = new User({name:req.body['inputName'],password:Toolkit.md5(p1),email:req.body['email']});
    user.save(function(err,users){
        if(err){
            req.flash('error','注册失败请稍后重试！');
            res.redirect('/reg');
        }
        //console.log(users[0]._id + "==" + users[0].name);
        req.session.user = users[0];
        req.flash('success','注册成功！');
        res.redirect('/');
    });
};

//登录
exports.postlogin = function(req,res){
    Toolkit.login(req,res,{failPage:'/login',successPage:'/'});
};