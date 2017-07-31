var vm = new Vue({
	el: '#app',
	data: {
		maskShow: false, //遮罩
		popupShow: false, //弹窗
		resultInfo: [],
		orderStatus: 0, //订单状态
		currentRole: 0, //当前角色
		timeConsume: 0, //耗时
		unitPrice: 0,
		photoPecent: 0,
		userPecent: 0,
		currentOrderId:'',
		orderInfo: {},
		orderTrackInfo: {},
		orderResult: {},
		photographerInfos: [{}],
		currentTourId:'',
		photographerId:'',
		currentOrderNo:'',
		currentOrderStatus:'',
		allotRole: false,
		assignRole:false,
		confirmRole:false,
		cancelRole:false,
		summaryRole:false,
		feedbackRole:false,
		handleRole:false,
		photographerExperienceFlage:'',
		actionStatus:0, // 
	}
})

lf.ready(function() {
	vm.allotRole = window.Role.hasAuth('allotPhoto')// 分配按钮的key
	vm.assignRole = window.Role.hasAuth('assign')// 指派按钮的key
	vm.cancelRole = window.Role.hasAuth('cancel')// 取消按钮的key
	vm.confirmRole = window.Role.hasAuth('confirm')// 取消按钮的key
	vm.summaryRole = window.Role.hasAuth('summary')// 录入心得按钮的key
	vm.feedbackRole = window.Role.hasAuth('feedback')// 录入执行结果按钮的key
	vm.handleRole = window.Role.hasAuth('handle')// 录入跟踪信息按钮的key
	
	renderOrderDetails();
	vm.currentRole=window.Role.userrole;
	mui('.mind').on('tap', '.photpgrapher-name', function() { //点击摄影师名字
		var id = this.getAttribute('data-id');
		lf.event.fire(lf.window.currentWebview().opener(), 'addPhotographer', {
			id: id
		})
	});
	mui('.operate').on('tap', '.button', function() {
		if(vm.currentOrderStatus == 3){
			lf.nativeUI.toast('该订单已取消！');
		}
		else{
			vm.maskShow = true;
			vm.popupShow = true;
		}	
	});
	mui('body').on('tap', '.mask', function(event) { //点击遮罩层隐藏弹窗
		event.stopPropagation();
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.assign', function() { //点击指派
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('common/chooseuser.html','../common/chooseuser.html',{},{
			orderNo: orderid,
			type:1
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.allot', function() { //点击分配
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('common/plancamera.html','../common/plancamera.html',{},{
			orderNo: orderid
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.trackinfo', function() { //点击跟踪信息
		var orderNo = this.getAttribute('data-orderNo');
		lf.window.openWindow('trackinfo.html','trackinfo.html',{},{
			orderNo: orderNo
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.cancled', function() { //点击取消
		if(vm.currentOrderStatus == 7){
			lf.nativeUI.toast('订单已完成，无法取消！');
		}
		else{
			lf.nativeUI.confirm("操作提示", "确定要取消该订单吗?",  ["确定","取消"] ,function(e){
		 		if(e.index==0){
		 			var params = {
						orderId: vm.currentOrderId,
						orderState:3,
						orderNo:vm.currentOrderNo
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
	mui('.popup-mod').on('tap', '.confirm', function() { //点击确认
	
			lf.nativeUI.confirm("操作提示", "你确认要执行订单?",  ["确定","取消"] ,function(e){
		 		if(e.index==0){
		 			var params = {
						orderId: vm.currentOrderId,
						orderState:2,
						orderNo:vm.currentOrderNo
					};
		 			lf.net.getJSON('order/updateOrderState', params, function(data) {
						if(data.code == 200) {
							lf.nativeUI.toast("操作成功！");
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
		
		
	})
	
	mui('.popup-mod').on('tap', '.excuteresult', function() { //点击执行结果
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('order-entering/result.html','../order-entering/result.html',{},{
			orderNo: orderid
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.mind', function() { //点击心得,进入录入心得页面
		var orderid = this.getAttribute('data-orderid');
		if(vm.photographerExperienceFlage==0){//1进入查看页面，0进入修改页面
			lf.window.openWindow('summary/summary.html','../summary/summary.html',{},{
            orderId: orderid,
            tourId: vm.orderInfo.tourId
			})
		}
		else{
			lf.window.openWindow('summary/details.html','../summary/details.html',{},{
            orderId: orderid
			})
		}
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.mind').on('tap', '.photpgrapher-name', function() { //点击摄影师名字,进入查看心得页面
		var orderid = this.getAttribute('data-orderid');
		var photographerId = this.getAttribute('data-photographerId');
		lf.window.openWindow('summary/details.html','../summary/details.html',{},{
            orderId: orderid,
            photographerId: photographerId
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
})

lf.event.listener('orderdetails',function(e){
	renderOrderDetails();
	lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
})

function renderOrderDetails(){
	var orderId = lf.window.currentWebview().orderNo;
	var params = {
		orderId: orderId
	};
	vm.photographerId = window.Role.usercode;
	
	lf.net.getJSON('order/orderDetail', params, function(data) {
		if(data.code == 200) {
			vm.orderInfo = data.data.orderInfo;	
			vm.orderTrackInfo = data.data.orderTrackInfo;	
			vm.photographerInfos = data.data.photographerInfos;
			var time = new Date() - new Date(vm.orderInfo.createTime);
			var total = time/1000; 
			var day = parseInt(total / (24*60*60));//计算整数天数
			var afterDay = total - day*24*60*60;//取得算出天数后剩余的秒数
			var hour = parseInt(afterDay/(60*60));//计算整数小时数
			var afterHour = total - day*24*60*60 - hour*60*60;//取得算出小时数后剩余的秒数
			var min = parseInt(afterHour/60);//计算整数分
			var afterMin = total - day*24*60*60 - hour*60*60 - min*60;//取得算出分后剩余的秒数
			vm.timeConsume='  '+day+'天'+hour+'小时'+min+'分';
			vm.orderTrackInfo.groupRoute=outLineBreak(vm.orderTrackInfo.groupRoute);	
			vm.orderInfo.createTime = lf.util.timeStampToDate(vm.orderInfo.createTime)
			if (data.data.orderTrackInfo.fetchPhotoTime) {
            	vm.orderTrackInfo.fetchPhotoTime = lf.util.timeStampToDate2(vm.orderTrackInfo.fetchPhotoTime)
            }
            else{
            	vm.orderTrackInfo.fetchPhotoTime = ''
            }	
            vm.orderTrackInfo.lineSight.forEach(function(v, i) {
					v.shootTime = lf.util.timeStampToDate2(v.shootTime)
			})
			if(data.data.orderResult){
				vm.orderResult = data.data.orderResult;
				if(vm.orderResult.buyers == 0){
					vm.unitPrice=0
				}
				else{
					// 客单价 = 销售总额/购买人数 (前端计算)
					vm.unitPrice = (vm.orderResult.salesAmt / vm.orderResult.buyers).toFixed(2)
				}
				if(vm.orderResult.printsNum==0){
					vm.photoPecent=0
				}
				else{
					// 照片转化率 = 销售总数/打印张数 (前端计算)
					vm.photoPecent = ((vm.orderResult.salesNum / vm.orderResult.printsNum) * 100).toFixed(2)
				}
				if(vm.orderTrackInfo.personCount==0){
					vm.userPecent=0
				}
				else{
					// 用户转化率  = 购买人数/团人数 (前端计算)
					vm.userPecent = ((vm.orderResult.buyers / vm.orderTrackInfo.personCount) * 100).toFixed(2)
				}	
				vm.orderResult.orderXms.forEach(function(v, i) {
					v.total = lf.util.multNum(v.picNum, v.price).toFixed(2)
				})
				if(data.data.orderResult.saleDate){
					vm.orderResult.saleDate = lf.util.timeStampToDate2(data.data.orderResult.saleDate)
				}
				else{
					vm.orderResult.saleDate = ''
				}
				
			}	
			vm.orderInfo.totalPrice = (vm.orderInfo.totalPrice/100).toFixed(2);
			vm.currentOrderId = vm.orderInfo.orderId;//记录当前订单id
			vm.currentTourId = data.data.orderInfo.tourId;//记录tourId		
			vm.currentOrderStatus =  data.data.orderInfo.status;//记录订单状态
			vm.currentOrderNo =  data.data.orderInfo.orderNo;//记录订单No
			vm.photographerExperienceFlage= data.data.photographerExperienceFlage;
		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	});
	
}
function outLineBreak (str) {
    return (str || '').replace(/\n/g, '<br>')
}