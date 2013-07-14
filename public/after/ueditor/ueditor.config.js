(function () {
    var URL = window.UEDITOR_HOME_URL || (function(){

        function PathStack() {

            this.documentURL = self.document.URL || self.location.href;

            this.separator = '/';
            this.separatorPattern = /\\|\//g;
            this.currentDir = './';
            this.currentDirPattern = /^[.]\/]/;

            this.path = this.documentURL;
            this.stack = [];

            this.push( this.documentURL );

        }

        PathStack.isParentPath = function( path ){
            return path === '..';
        };

        PathStack.hasProtocol = function( path ){
            return !!PathStack.getProtocol( path );
        };

        PathStack.getProtocol = function( path ){

            var protocol = /^[^:]*:\/*/.exec( path );

            return protocol ? protocol[0] : null;

        };

        PathStack.prototype = {
            push: function( path ){

                this.path = path;

                update.call( this );
                parse.call( this );

                return this;

            },
            getPath: function(){
                return this + "";
            },
            toString: function(){
                return this.protocol + ( this.stack.concat( [''] ) ).join( this.separator );
            }
        };

        function update() {

            var protocol = PathStack.getProtocol( this.path || '' );

            if( protocol ) {

                //根协议
                this.protocol = protocol;

                //local
                this.localSeparator = /\\|\//.exec( this.path.replace( protocol, '' ) )[0];

                this.stack = [];
            } else {
                protocol = /\\|\//.exec( this.path );
                protocol && (this.localSeparator = protocol[0]);
            }

        }

        function parse(){

            var parsedStack = this.path.replace( this.currentDirPattern, '' );

            if( PathStack.hasProtocol( this.path ) ) {
                parsedStack = parsedStack.replace( this.protocol , '');
            }

            parsedStack = parsedStack.split( this.localSeparator );
            parsedStack.length = parsedStack.length - 1;

            for( var i= 0, tempPath, root = this.stack; tempPath = parsedStack[ i ]; i++ ) {

                if( PathStack.isParentPath( tempPath ) ) {
                    root.pop();
                } else {
                    root.push( tempPath );
                }

            }

        }

        var currentPath = document.getElementsByTagName('script');

        currentPath = currentPath[ currentPath.length -1 ].src;

        return new PathStack().push( currentPath ) + "";


    })();

    /**
     * 配置项主体。注意，此处所有涉及到路径的配置别遗漏URL变量。
     */
    window.UEDITOR_CONFIG = {

        //为编辑器实例添加一个路径，这个不能被注释
        UEDITOR_HOME_URL : URL

        //图片上传配置区
        ,imageUrl:"/admin/uploadImage"             //图片上传提交地址
        ,imagePath:""                     //图片修正地址，引用了fixedImagePath,如有特殊需求，可自行配置

        //附件上传配置区
        ,fileUrl:"/admin/attachment"               //附件上传提交地址
        ,filePath:""                   //附件修正地址，同imagePath
        //,fileFieldName:"upfile"                    //附件提交的表单名，若此处修改，需要在后台对应文件修改对应参数

        //图片在线管理配置区
        ,imageManagerUrl:"/admin/imgManager"       //图片在线管理的处理地址
        ,imageManagerPath:""                                    //图片修正地址，同imagePath

        //上传图片写入数据库使用的隐藏input的id
        ,updateImgInputId:"imageName"
        //上传附件写入数据库要使用的隐藏input的id
        ,updateAttaInputId:"attachName"

        //工具栏上的所有的功能按钮和下拉框，可以在new编辑器的实例时选择自己需要的从新定义
        , toolbars:[
            ['fullscreen', 'source', '|', 'undo', 'redo', '|',
                'bold', 'italic', 'underline', 'removeformat', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'cleardoc', '|',
                'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                'paragraph', 'fontfamily', 'fontsize', '|',
                'indent', '|',
                'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
                'link', 'unlink', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
                'insertimage', 'emotion', 'insertvideo', 'attachment', 'insertframe','insertcode', 'pagebreak', 'template', '|',
                'horizontal', 'date', 'time', 'spechars', '|',
                'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright',
                'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                'preview', 'searchreplace']
        ]
        ,initialFrameWidth:'82.90598290598291%'     //初始化编辑器宽度,默认1000
        ,initialFrameHeight:350  //初始化编辑器高度,默认320
        //autoHeightEnabled
        // 是否自动长高,默认true
        ,autoHeightEnabled:true
        //浮动时工具栏距离浏览器顶部的高度，用于某些具有固定头部的页面
        ,topOffset:40
    };
})();
