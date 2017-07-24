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
		orderInfo: {
			/*"orderId": 1,
			"orderNo": "1234",
			"tourId": 2,
			"tourNo": "435",
			"status": 1,
			"totalPrice": 100,
			"createTime": 2017 - 07 - 02,
			"productName": "测试产品",
			"lineName": "测试线路",
			"purchaser": "采购方名称",
			"tourGuide": "导游名字",
			"tourGuidePhone": "13170459349"*/
		},
		orderTrackInfo: {
			/*"personCount": 10,
			"groupType": "团性质",
			"groupDays": 2,
			"groupRoute": "行程描述",
			"busCardNo": "A0111",
			"preReservedSeats": 10,
			"fetchPhotoTime": "312321321",
			"fetchPhotoScene": "取片地点"*/
		},
		orderResult: {
			/*"selectsNum": 10,
			"printsNum": 10,
			"givesPicSize": 1,
			"givesNum": 1,
			"salesAmt": 10,
			"salesNum": 10,
			"buyers": 20,
			"leavesNum": 0,
			"orderXms": [{
				"id": 1,
				"orderId": 1,
				"picSizeName": 1,
				"price": 100,
				"picNum": 10
			}]*/
		},
		photographerInfos: [{
			/*"photographerId": 1,
			"photographerName": "张三"*/
		}],
		currentTourId:'',
		photographerId:'',
		currentOrderNo:'',
		currentOrderStatus:''
	}
})

lf.ready(function() {
	
	var orderId = lf.window.currentWebview().orderNo;
	console.log('orderId:'+orderId)
	var params = {
		orderId: orderId
	};
	vm.photographerId = window.Role.usercode;
	lf.net.getJSON('order/orderDetail', params, function(data) {
		if(data.code == 200) {
			vm.orderInfo = data.data.orderInfo;	
			vm.orderTrackInfo = data.data.orderTrackInfo;	
			vm.photographerInfos = data.data.photographerInfos;
			vm.timeConsume = new Date() - new Date(vm.orderInfo.createTime);
			if(data.data.orderResult){
				vm.orderResult = data.data.orderResult;
				// 客单价 = 销售总额/购买人数 (前端计算)
				vm.unitPrice = (vm.orderResult.salesAmt / vm.orderResult.buyers).toFixed(2)
				// 照片转化率 = 销售总数/打印张数 (前端计算)
				vm.photoPecent = (vm.orderResult.salesNum / vm.orderResult.printsNum).toFixed(2)
				// 用户转化率  = 购买人数/团人数 (前端计算)
				vm.userPecent = (vm.orderResult.buyers / vm.orderTrackInfo.personCount).toFixed(2)
			
				vm.orderResult.orderXms.forEach(function(v, i) {
					v.total = lf.util.multNum(v.picNum, v.price).toFixed(2)
					lf.nativeUI.toast(v.total);
				})
			}		
			vm.currentOrderId = vm.orderInfo.orderId;//记录当前订单id
			vm.currentTourId = data.data.orderInfo.tourId;//记录tourId					
		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	});
	
	mui('.mind').on('tap', '.photpgrapher-name', function() { //点击摄影师名字
		var id = this.getAttribute('data-id');
		lf.event.fire(lf.window.currentWebview().opener(), 'addPhotographer', {
			id: id
		})
	});
	mui('.operate').on('tap', '.button', function() {
		vm.maskShow = true;
		vm.popupShow = true;
	});
	mui('body').on('tap', '.mask', function() { //点击遮罩层隐藏弹窗
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.assign', function() { //点击指派
		var orderid = this.getAttribute('data-orderid');
		console.log(orderid)
		lf.window.openWindow('common/chooseuser.html','../common/chooseuser.html',{},{
			orderNo: orderid
		})
	})
	mui('.popup-mod').on('tap', '.allot', function() { //点击分配
		var orderid = this.getAttribute('data-orderid');
		console.log(orderid)
		lf.window.openWindow('common/plancamera.html','../common/plancamera.html',{},{
			orderNo: orderid
		})
	})
	mui('.popup-mod').on('tap', '.trackinfo', function() { //点击跟踪信息
		var orderid = this.getAttribute('data-orderid');
		console.log(orderid)
		lf.window.openWindow('trackinfo.html','trackinfo.html',{},{
			orderNo: orderid
		})
	})
	mui('.popup-mod').on('tap', '.cancled', function() { //点击取消
		lf.nativeUI.confirm("操作提示", "确定要取消该订单吗?",  ["确定","取消"] ,function(e){
		 		console.log( (e.index==0)?"Yes!":"No!" );
		 		if(e.index==0){
		 			var params = {
						orderId: vm.currentOrderId,
						orderState:vm.currentOrderStatus,
						orderNo:vm.currentOrderNo
					};
		 			lf.net.getJSON('order/updateOrderState', params, function(data) {
						if(data.code == 200) {
							lf.nativeUI.toast("订单取消成功！");
							lf.window.openWindow('order/orderlist.html','../order/orderlist.html',{},{
							})
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
		console.log(orderid)
		lf.window.openWindow('order-entering/result.html','../order-entering/result.html',{},{
			orderNo: orderid
		})
	})
	mui('.popup-mod').on('tap', '.mind', function() { //点击心得,进入录入心得页面
		var orderid = this.getAttribute('data-orderid');
		console.log(vm.currentTourId)
		console.log(orderid)
		console.log(vm.photographerId)
		lf.window.openWindow('summary/summary.html','../summary/summary.html',{},{
            tourId: vm.currentTourId,
            orderId: orderid,
            photographerId: vm.photographerId
		})
	})
	mui('.mind').on('tap', '.photpgrapher-name', function() { //点击摄影师名字,进入查看心得页面
		var orderid = this.getAttribute('data-orderid');
		var photographerId = this.getAttribute('data-photographerId');
		lf.window.openWindow('summary/details.html','../summary/details.html',{},{
            orderId: orderid,
            photographerId: vm.photographerId
		})
	})
})

lf.event.listener('orderdetails',function(e){
	console.log(JSON.stringify(e.detail))
	var list = e.detail.list;
	var index = e.detail.index;
	var temp = null;
})