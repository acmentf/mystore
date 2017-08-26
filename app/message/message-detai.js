var vm = new Vue({
	el:"#app",
	data: {
		currentRoleId:'',
		orderNo:'',
		orderId:'',
		id: '',
		descption: '',
		orderMessage:null
	}
})
lf.ready(function(){
	if(window.Role.currentPositions.length > 0) {
		vm.currentRoleId = window.Role.currentPositions[0].roleId;
		console.log("当前用户的角色id" + vm.currentRoleId)
	}
	var wv = lf.window.currentWebview()
	vm.orderNo = wv.orderNo
	vm.orderId = wv.orderId
	vm.id = wv.Id
	vm.descption = wv.descption
	console.log(JSON.stringify(window.Role))
	getOrder()
	updeteStatu()
})
//删除消息
mui('body').on('tap', '.cancel-order',function(){
	var params = {
		id:vm.id
	}
	lf.net.getJSON('/information/delete',params,function(res){
		if(res.code == 200){
			lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
			lf.window.closeCurrentWebview();
			lf.nativeUI.toast('删除成功');
		}
	})
})

//确认完成
mui('body').on('tap','.order-btn-affirm', function(){
		lf.nativeUI.confirm("操作提示", "确认后订单无法修改，是否确认订单完成?", ["确定", "取消"], function(e) {
			if(e.index == 0) {
				completeFn()
			}
		});
		function completeFn() {
			var params = {
				orderId: vm.orderId,
				orderState: 2,
				orderNo: vm.orderNo
			};
			lf.net.getJSON('order/updateOrderState', params, function(data) {
				if(data.code == 200) {
					lf.nativeUI.toast("确认成功！");
					lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
					lf.window.closeCurrentWebview();
				} else {
					lf.nativeUI.toast(data.msg);
				}
			}, function(erro) {
				lf.nativeUI.toast(erro.msg);
			});
		}
})

//生成销售
mui('body').on('tap','.order-btn-sales', function(){
	lf.window.openWindow('order-pay/order-pay.html', '../order-pay/order-pay.html', {}, {
		orderId: vm.orderId,
		areaCode: vm.orderMessage.orderInfo.areaCode,
		tourGuide: vm.orderMessage.orderInfo.tourGuide,
		purchaser: vm.orderMessage.orderInfo.purchaser,
		aliasName: vm.orderMessage.orderInfo.aliasName,
	})
})

//输出
mui('body').on('tap','.order-btn-output', function(){
	lf.window.openWindow('result/order-result.html', '../result/order-result.html', {}, {
		orderId: vm.orderId,
	})
})

//计调
mui('body').on('tap','.order-btn-operator', function(){
	lf.window.openWindow('operator/operator.html', '../operator/operator.html', {}, {
		orderNo: vm.orderNo,
		type: 0,
		status: 'edit'
	})
})

//指派
mui('body').on('tap','.order-btn-designate', function(){
	lf.window.openWindow('designate/designate.html ', '../designate/designate.html', {}, {
		orderId: vm.orderId
	})
})

//分配
mui('body').on('tap','.order-btn-allocation', function(){
	lf.window.openWindow('operator/operator.html', '../operator/operator.html', {}, {
		orderNo: vm.orderNo,
		type: 2,
		status: 'edit'
	})
})
mui('body').on('tap','#message-goback', function(){
	lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
	lf.window.closeCurrentWebview();
})
//取消订单
mui('body').on('tap','.order-btn-cancel', function(){
	if(vm.orderMessage.orderInfo.status == 7) {
			lf.nativeUI.toast('订单已完成，无法取消！');
		} else {
			lf.nativeUI.confirm("操作提示", "确定要取消该订单吗?", ["确定", "取消"], function(e) {
				if(e.index == 0) {
					var params = {
						orderId: vm.orderId,
						orderState: 3,
						orderNo: vm.orderNo
					};
					lf.net.getJSON('order/updateOrderState', params, function(data) {
						if(data.code == 200) {
							lf.nativeUI.toast("订单取消成功！");
							lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
							lf.window.closeCurrentWebview();
						} else {
							lf.nativeUI.toast(data.msg);
						}
					}, function(erro) {
						lf.nativeUI.toast(erro.msg);
					});
				}
			});
		}
})

//查看
mui('body').on('tap','.examine', function(){
	var actionStatus = vm.orderMessage.orderInfo.actionStatus;
	var summary ;
	if(vm.orderMessage.photographerInfos.length!==0){
		summary = vm.orderMessage.photographerInfos[0].summary
	}
	var index = 1;
	
	//待处理0 已完成计调1 已分配摄影师2 状态，跳到详情页默认展示计调信息tab
	//正在拍摄中 3  已完成输出4 跳到详情页默认展示输出信息tab
	if(actionStatus == 0 ||actionStatus == 1 ||actionStatus == 2){
		index = 2
	}
	if(actionStatus==3 || actionStatus ==4){
		index = 3
	}
	console.log('actionStatus....'+actionStatus+','+summary)
	lf.window.openWindow('../order/orderdetails.html', '../order/orderdetails.html', {}, {
		orderNo: vm.orderId,
		index: index,
		photographerId: window.Role.photograherId,
		summary: summary
	})
})
function getOrder(){
	var params = {
		orderId: vm.orderId
	}
	lf.net.getJSON('order/orderDetail',params, function(res){
		if(res.code == 200){		
			vm.orderMessage = res.data
			console.log(JSON.stringify(vm.orderMessage))
			vm.orderMessage.orderTrackInfo.startTime = lf.util.timeStampToDate2(vm.orderMessage.orderTrackInfo.startTime)
		}
	})
	
}
function updeteStatu(){
	var params = {
		id: vm.id,
		status: 1
	}
	lf.net.getJSON('information/updateStatus', params, function(res){
		if(res.code == 200){
			console.log('成功')
		}
	})
}
