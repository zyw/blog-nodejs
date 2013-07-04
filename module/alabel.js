/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-7-4
 * Time: 下午5:20
 * To change this template use File | Settings | File Templates.
 */

var db = require("./db");

function Alabel(alabel){
    this.id = alabel.id;
    this.alname = alabel.alname;
}
module.exports = Alabel;