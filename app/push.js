document.addEventListener( "plusready", function(){
    // 监听点击消息事件
    plus.push.addEventListener( "click", function( msg ) {
        // 判断是从本地创建还是离线推送的消息
        switch( msg.payload ) {
            case "LocalMSG":
            break;
            default:
            break;
        }
        lf.window.openWindow('message/message.html','message/message.html')
        // 处理其它数据
    }, false );
    // 监听在线消息事件
    plus.push.addEventListener( "receive", function( msg ) {
    	
    }, false );
}, false );

