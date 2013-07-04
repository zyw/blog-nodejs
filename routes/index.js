
/*
 * GET home page.
 */

var settings = require('../settings')

/*---------------------逻辑处理----------------------------------*/
exports.index = function(req, res){
    res.render('skin_views/' +settings.template + '/index');
};