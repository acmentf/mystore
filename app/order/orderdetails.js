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
			"orderId": 1,
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
			"tourGuidePhone": "13170459349"
		},
		orderTrackInfo: {
			"personCount": 10,
			"groupType": "团性质",
			"groupDays": 2,
			"groupRoute": "行程描述",
			"busCardNo": "A0111",
			"preReservedSeats": 10,
			"fetchPhotoTime": "312321321",
			"fetchPhotoScene": "取片地点"
		},
		orderResult: {
			"selectsNum": 10,
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
			}]
		},
		photographerInfos: [{
			"photographerId": 1,
			"photographerName": "张三"
		}]
	}
})

lf.ready(function() {
	vm.timeConsume = new Date() - new Date(vm.orderInfo.createTime);
	// 客单价 = 销售总额/购买人数 (前端计算)
	vm.unitPrice = (vm.orderResult.salesAmt / vm.orderResult.buyers).toFixed(2)
	// 照片转化率 = 销售总数/打印张数 (前端计算)
	vm.photoPecent = (vm.orderResult.salesNum / vm.orderResult.printsNum).toFixed(2)
	// 用户转化率  = 购买人数/团人数 (前端计算)
	vm.userPecent = (vm.orderResult.buyers / vm.orderTrackInfo.personCount).toFixed(2)

	vm.orderResult.orderXms.forEach(function(v, i) {
		v.total = lf.util.multNum(v.picNum, v.price).toFixed(2)
	})
	vm.currentOrderId = vm.orderInfo.orderId;//记录当前订单id
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
		
	})
	mui('.popup-mod').on('tap', '.excuteresult', function() { //点击执行结果
		var orderid = this.getAttribute('data-orderid');
		console.log(orderid)
		lf.window.openWindow('order-entering/result.html','../order-entering/result.html',{},{
			orderNo: orderid
		})
	})
	mui('.popup-mod').on('tap', '.mind', function() { //点击心得
		var orderid = this.getAttribute('data-orderid');
		console.log(orderid)
		lf.window.openWindow('summary/summary.html','../summary/summary.html',{},{
            tourId: '',
            orderId: orderid,
            photographerId: ''
		})
	})
	
})

lf.event.listener('orderdetails',function(e){
	console.log(JSON.stringify(e.detail))
	var list = e.detail.list;
	var index = e.detail.index;
	var temp = null;
})