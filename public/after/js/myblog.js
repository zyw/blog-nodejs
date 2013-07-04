/**
 * Created with JetBrains WebStorm.
 * User: ZYW
 * Date: 13-6-6
 * Time: 下午5:27
 * To change this template use File | Settings | File Templates.
 */

blogModule = {
    urlAndData:null
};

(function( $ , undefined){
    $.myblog = {
        confirmation:function(urlAndData){
            blogModule.urlAndData = urlAndData;
            if(!$("#myModal").length > 0){
                var alertHTML = $("<div id='myModal' class='modal hide fade' tabindex='-1' role='dialog' aria-labelledby='myModalLabel' aria-hidden='true'>" +
                    "<div class='modal-header'>" +
                    "<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>×</button>" +
                    "<h3 id='myModalLabel'>温馨提示</h3> " +
                    "</div>" +
                    "<div class='modal-body'>" +
                    "<p>确定要删除数据吗？</p>" +
                    "</div>" +
                    "<div class='modal-footer'>" +
                    "<button class='btn btn-primary' data-dismiss='modal' aria-hidden='true' onclick='$.myblog.realDelete(blogModule.urlAndData)'>是</button>" +
                    "<button class='btn' data-dismiss='modal' aria-hidden='true'>否</button>" +
                    "</div>" +
                    "</div>");
                $('body').append(alertHTML);
            }
            $('#myModal').modal('show');
        },
        realDelete:function(urlAndData){
            location.href=urlAndData;
        }
    };
})(jQuery);

$(function(){
    $(".nava li a[name]").on('click',function(){
        window.location.href = "/admin/" + $(this).attr('name');
    });
});
