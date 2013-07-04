
/*
 * GET home page.
 */

var settings = require('../settings')

/*---------------------渲染页面-------------------------------*/

exports.index = function(req, res){
    res.render('skin_views/' +settings.template + '/index');
};

/*---------------------逻辑处理----------------------------------*/
