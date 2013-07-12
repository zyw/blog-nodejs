/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-7-12
 * Time: 下午3:21
 * To change this template use File | Settings | File Templates.
 */

$(function() {
    $("body").append('<div id="backtotop"><div class="bttbg"></div></div>');
    initGoToTop()
});
function initGoToTop() {
    jQuery(function() {
        jQuery(window).scroll(function() {
            if (jQuery(this).scrollTop() > 100) {
                jQuery("#backtotop").addClass("showme")
            } else {
                jQuery("#backtotop").removeClass("showme")
            }
        });
        jQuery("#backtotop").click(function() {
            jQuery("body,html").animate({scrollTop: 0}, 400);
            return false
        })
    });
    if (jQuery(window).scrollTop() == 0) {
        jQuery("#backtotop").removeClass("showme")
    } else {
        jQuery("#backtotop").addClass("showme")
    }
}