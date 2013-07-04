
/*
 * GET home page.
 */

var settings = require('../settings')

exports.index = function(req, res){
    res.render('skin_views/' +settings.template + '/index');
};
