lf.ready(function(){
	//清楚角标
	plus.runtime.setBadgeNumber(0);
})

document.addEventListener( "plusready", function(){
	if(mui.os.plus) {
		return;
	}
    // 监听点击消息事件
    plus.push.addEventListener( "click", function( msg ) {
        // 判断是从本地创建还是离线推送的消息
        switch( msg.payload ) {
            case "LocalMSG"://本地消息走这个地方
            break;
            default://苹果离线走这个地方
            break;
        }
        lf.window.openWindow('message/message.html','message/message.html')
        // 处理其它数据
    }, false );
    // 监听在线消息事件
    plus.push.addEventListener( "receive", function( msg ) {//苹果在线走这个地方
    	if(msg.aps) {// 苹果离线消息，需要创建本地消息
    	} else {// 苹果在线透传以及本地消息会走这个地方
    		switch(msg.payload) {// 本地消息
				case "LocalMSG":
					break;
				default:// 在线透传消息，需要创建本地消息
					logoutPushMsg(msg)
					break;
			}
		}
    }, false );
}, false );

/**
 * 日志输入推送消息内容
 */
function logoutPushMsg( msg ) {
	var msgObj = {
		title: msg.title,
		content: msg.content
	}
	createLocalPushMsg(msgObj)
}

function createLocalPushMsg(msg) {
	var options = {
		title: msg.title,
		cover: false
	};
	var str = msg.content;
	plus.push.createMessage(str, "LocalMSG", options);
}