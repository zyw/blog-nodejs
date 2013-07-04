/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-4
 * Time: 下午11:13
 * To change this template use File | Settings | File Templates.
 */
var settings = require("../settings"),
    mongo = require('mongoskin');

module.exports = mongo.db(settings.dbUrl);