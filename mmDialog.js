void function($){
    var winWidth = $(window).width();
    var winHeight = $(window).height();

    $(window).bind("resize", function(){
        setTimeout(function(){
            winWidth = $(window).width();
            winHeight = $(window).height();
        }, 0)
    })
    // 全局堆叠值,不能超过最大值(2147483647) From: http://softwareas.com/whats-the-maximum-z-index
    var Z  = (new Date().getTime() + "").slice(0,6) >> 0
    var W3C = window.dispatchEvent
    //为性能起见,不使用jQuery高度封装的事件系统
    var addEvent =  W3C ? function( el, type, fn, phase ){
        el.addEventListener( type, fn, !!phase );
    } : function( el, type, fn ){
        el.attachEvent && el.attachEvent( "on"+type, fn );
    }
    var removeEvent =  W3C ? function( el, type, fn, phase ){
        el.removeEventListener( type, fn || $.noop, !!phase );
    } : function( el, type, fn ){
        if ( el.detachEvent ) {
            el.detachEvent( "on" + type, fn || $.noop );
        }
    }
    var defautls = {
        skin          : 'default', // 主题样式
        title         : '标题', // 标题
        width         : 'auto', // 宽度
        height        : 'auto', // 高度
        minWidth      : 'auto', // 最小宽度
        minHeight     : 'auto', // 最小高度
        padding       : '15px', // 内填充
        closeTime     : 0,   // 关闭延迟时间
        isMax         : false,  // 是否最大化
        isMask        : true,   // 是否遮罩
        top           : 0,      // top 值
        left          : 0,      // left 值
        open      : null,   // 打开后执行函数
        close     : null,   // 关闭后执行函数
        isDrag        : true,   // 是否拖动
        content       : '',     // 内容
        isFull        : false,   // 是否全屏弹出
        tmpl          : ''
    +'<table width="100%" class="ui-tpl-tab">'
    +'    <thead>'
    +'        <tr><td class="ui-tpl-tl"></td><td class="ui-tpl-tc"><h1></h1></td><td class="ui-tpl-tr"></td></tr'
    +'    </thead>'
    +'    <tbody>'
    +'       <tr><td class="ui-tpl-ml"></td><td class="ui-tpl-mc"><div class="ui-content"></div></td><td class="ui-tpl-mr"></td></tr>'
    +'    </tbody>'
    +'    <tfoot>'
    +'       <tr><td class="ui-tpl-bl"></td><td class="ui-tpl-bc"><div></div></td><td class="ui-tpl-br"></td></tr>'
    +'     </tfoot>'
    +'</table>'
    };

    $.mmDialog  = function(opts){
        $.extend(this, defautls, opts || {});
        if( this.top == null && this.left == null){
            this.isVerticalCenter = true;
        }
        this.render()
        if($.isFunction( this.open )){
            this.open()
        }
    }

    $.mmDialog.prototype = {
        constructor: $.mmDialog ,
        render: function(){

            var target = this.el  = $('<div class="ui-wrap" />').css({
                width: this.isFull ? winWidth : this.width,
                height: this.isFull ? winHeight: this.height
            }).appendTo("body").html(this.tmpl)
           
            //处理标题
            var head = this.head = target.find("h1");
            var body = this.body = target.find("div").first()
            this.foot = target.find("div").last()
            if(this.title == false){
                head.hide()
            }
            if(typeof this.title == "string"){
                head.html(this.title);
                var self = this;
                $('<a class="ui-close" href="javascript:void(0)" title="关闭" >关闭</a> ').appendTo(head).click( function(){
                    self.teardown()
                } )
            }
            //处理内容
            body.html(this.content).height(245);
            if(this.isFull){
                var h = winHeight -
                this.head.outerHeight() -
                this.foot.outerHeight() -
                parseInt( this.body.css("marginTop"),10) -
                parseInt( this.body.css("marginTop"),10) -
                parseInt( this.body.css("marginBottom"),10) -
                parseInt( this.body.css("borderTopWidth"),10) -
                parseInt( this.body.css("borderBottomWidth"),10) -
                parseInt( this.body.css("paddingTop"),10) -
                parseInt( this.body.css("paddingBottom"),10) - 4
                this.body.height( h)
            }
            if(typeof this.content == "object" && this.content.nodeType === 1){
                $(this.content).show()
            }
            target.css("display",'block')
            if(!"1"[0]){
                target.css("position",'absolute')
            }
      
            if(this.skin){
                target.addClass(this.skin)
            }
            //处理遮罩
            this.mask = $("<div />")
            this.isMask && this.createMask();
            this.setAlign();
            // 处理拖动
            this.isDrag && this.setDrag(head[0]);
            this.setZIndex();
        },
        // 创建遮罩
        createMask: function(){
            this.mask =  $('<div class="ui-mask" style="width:100%;height:100%;position:fixed;">').appendTo("body")
            if(!"1"[0]){
                this.mask[0].innerHTML = '<iframe src="about:blank" style="width:100%;height:100%;position:absolute;top:0;left:0;z-index:-1;filter:alpha(opacity=0)"></iframe>';
            }
            return this;
        },
        // 居中
        setAlign: function(){
            var target  = this.el
            if(this.isVerticalCenter){
                target.css({
                    top:(winHeight -  target.innerHeight()) / 2 ,
                    left:(winWidth - target.innerWidth()) / 2
                })
            }else{
                target.css({
                    top: this.top | 0,
                    left: this.left | 0
                })
            }
            return this;
        },
        // 设置全局堆叠值，防止z-index穿透
        setZIndex: function(){
            var i = Z ++
            this.el.css("z-index", i)
            this.mask.css("z-index", i - 1);
            return this;
        },
        teardown:  function(){
            var self = this;
            if(this.closeTime > 0){
                setTimeout(function(){
                    self._teardown()
                },this.closeTime)
            }else{
                self._teardown()
            }
        },
        _teardown: function(){//销毁实例
            var content = this.content;
            if(typeof content == "object" && content.nodeType === 1){
                document.body.appendChild(content);
                content.style.display = 'none';
            }
            if($.isFunction(this.close)){
                this.close();
            }
            this.el.remove();
            this.mask.remove();
        },
        setDrag: function(handler){
            var
            startX  = 0,
            startY  = 0,
            lastX   = 0,
            lastY   = 0,
            box     = this.el[0],
            width   = $(document).width(),
            height  =  $(document).height(),
            drag    = {
                down: function(e){
                    handler.style.cursor = 'move';
                    startX               = e.clientX - parseInt(box.style.left);
                    startY               = e.clientY - parseInt(box.style.top);
                    handler.setCapture && handler.setCapture(); // IE 下防止拖动过快丢失对象
                    addEvent(document, 'mousemove', drag.move);
                    addEvent(document, 'mouseup', drag.up);
                    return false; // 防止在 chrome 下滚屏，并丢失 cursor:move 样式
                },
                move: function(e){
                    lastX             = e.clientX - startX;
                    lastY             = e.clientY - startY;
                    lastX             = Math.max(0, Math.min(width - box.clientWidth - 19, lastX));
                    lastY             = Math.max(0, Math.min(height - box.clientHeight - 2, lastY));
                    box.style.top     = lastY + 'px';
                    box.style.left    = lastX + 'px';
                    window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty(); // 取消选择文本
                },
                up: function(){
                    handler.style.cursor = 'auto';
                    removeEvent(document, 'mousemove', drag.move);
                    removeEvent(document, 'mouseup', drag.up);
                    handler.releaseCapture && handler.releaseCapture(); // 防止拖动过快丢失对象
                }
            };
            addEvent(handler, 'mousedown', drag.down);
        }
    }
}(jQuery)