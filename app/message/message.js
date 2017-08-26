var vm = new Vue({
	el: '#app',
	data: {
		messageList:[]
	}
})
lf.ready(function(){
	readMessage()
	console.log(window.Role.userroleId) // 岗位id
	
})

function readMessage () {
	var params
	lf.net.getJSON('information/queryLoginUserPushMsgList', params, function (res) {
		if (res.code == 200) {
			vm.messageList = res.data
			
			vm.messageList.forEach(function(v){
//				console.log(v.createdTime)
				v.createdTime = new Date(v.createdTime).format('hh:mm:ss')
				v.data = JSON.parse(v.data)
			})
			console.log(JSON.stringify(vm.messageList))
			
		}
	})
}
//跳转
lf.event.listener('orderdetails', function(e) {
	readMessage();
	lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
})
mui('body').on('tap','.footer-order-btn',function() {
	lf.window.openWindow('../order/orderlist.html','../order/orderlist.html',{},{},lf.window.currentWebview())
})

mui('body').on('tap','.footer-personage-btn',function(){
	lf.window.openWindow('../personal/personal.html','../personal/personal.html',{},{},lf.window.currentWebview())
})
//查看消息详情
mui('body').on('tap','.message-list',function(){
	var id = this.getAttribute('data-id')
	var orderId = this.getAttribute('data-orderId')
	var descption = this.getAttribute('data-msg')
	var orderNo = this.getAttribute('data-orderNo')
	lf.window.openWindow('message-detail.html','message-detail.html',{},{
		orderId: orderId,
		Id: id,
		descption: descption,
		orderNo: orderNo
	})
console.log(id )
console.log(orderId)
console.log(descption)
})
//取消订单

mui('#topPopover').on('tap', '.cancle', function() { //取消订单
//	var mask = mui.createMask()

		lf.nativeUI.confirm("操作提示", "是否确认清空消息?", ["确认清空", "不清空"], function(e) {
			if(e.index == 0) {
				var params 
				lf.nativeUI.showWaiting();
				
				lf.net.getJSON('/information/deleteAll', params, function(data) {
					if(data.code == 200) {
						lf.nativeUI.closeWaiting();
						lf.nativeUI.toast("已清空所有消息！");
						lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
//						lf.window.closeCurrentWebview();
						readMessage()
					} else {
						lf.nativeUI.toast(data.msg);
						lf.nativeUI.closeWaiting();
					}
				}, function(erro) {
					lf.nativeUI.toast(erro.msg);
					lf.nativeUI.closeWaiting();
				});
			}
		});
	})
lf.event.listener('orderdetails', function(e) {
	readMessage();
	lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
})
mui('body').on('tap', '#search-order', function() {
	lf.window.openWindow('../order/search.html', '../order/search.html', {})
})