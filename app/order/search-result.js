var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		status: '',
		orderTimeBegin: '',
		orderTimeEnd: '',
		startBeginTime: '',
		startEndTime: '',
		currPage: '',
		pageSize: '',
		actionStatus: '',
		orderList: [],
		isEmpty: false,
		opType: 'search', //搜索类型
		cancelRole: false,
		allotRole: false,
		assignRole: false,
		operatorRole: false,
		currentRole: '',
		assignOrder:false, //计调、指派 
		allotPhotoOrder:false, // 分配
		outOrder:false, // 填写输出信息
		saleOutOrder:false, // 销售输出
		genSale:false, // 生成销售
		summary:false, // 录入心得
		photograherId: '',
		currentRoleId: ''
	}
})

lf.ready(function() {
	vm.searchText = lf.window.currentWebview().searchText
	vm.status = lf.window.currentWebview().status
	vm.orderTimeBegin = lf.window.currentWebview().orderTimeBegin
	vm.orderTimeEnd = lf.window.currentWebview().orderTimeEnd
	vm.startBeginTime = lf.window.currentWebview().startBeginTime
	vm.startEndTime = lf.window.currentWebview().startEndTime
	vm.currPage = lf.window.currentWebview().currPage
	vm.pageSize = lf.window.currentWebview().pageSize
	vm.actionStatus = lf.window.currentWebview().actionStatus

	vm.photograherId = window.Role.photograherId
	vm.assignOrder=window.Role.hasAuth('assignOrder'), //计调、指派 
	vm.allotPhotoOrder=window.Role.hasAuth('allotPhotoOrder'), // 分配
	vm.outOrder=window.Role.hasAuth('outOrder'), // 填写输出信息
	vm.saleOutOrder=window.Role.hasAuth('saleOutOrder'), // 销售输出
	vm.genSale=window.Role.hasAuth('genSale'), // 生成销售
	vm.summary=window.Role.hasAuth('summary'), // 录入心得
	vm.confirmOrder = window.Role.hasAuth('confirmOrder'), // 确认完成
	vm.currentRole = window.Role.userrole;

	vm.currentRoleId = window.Role.currentPositions[0].roleId;
	
	vm.cancelRole = window.Role.hasAuth('cancel') // 取消按钮的key
	vm.operatorRole = window.Role.hasAuth('handle') // 计调key
	// vm.allotPhotoOrder = window.Role.hasAuth('allotPhotoOrder') // 分配按钮的key
	vm.assignRole = window.Role.hasAuth('assign') // 指派按钮的key

	function findData() {
		vm.currPage++ 

		var self = this

		//处理搜索
		var params = {
			searchText: vm.searchText,
			status: vm.status,
			orderTimeBegin: vm.orderTimeBegin,
			orderTimeEnd: vm.orderTimeEnd,
			startBeginTime: vm.startBeginTime,
			startEndTime: vm.startEndTime,
			currPage: vm.currPage,
			pageSize: vm.pageSize,
			actionStatus: vm.actionStatus,
			opType: vm.opType
		}

		console.log(JSON.stringify(params))

		lf.net.getJSON('/order/search', params, function (data) {
			
			console.log(JSON.stringify(data))

			if (data.code == "200") {
				
				if (data.data.result.length > 0) {
					data.data.result.forEach(function(item) {
						item.startTime = lf.util.timeStampToDate2(item.startTime)
						item.tourGuidePhone = item.tourGuidePhone.split(',')
						vm.orderList.push(item)
					})
					self.endPullupToRefresh(false)
				} else {
					vm.isEmpty = true
					self.endPullupToRefresh(true)
				}

			} else {
				lf.nativeUI.toast(data.msg);
			}
		}, function (error) {
			lf.nativeUI.toast(error.msg);
		})
	}

	mui.init({
		pullRefresh : {
			container: '.search-result',//待刷新区域标识，querySelector能定位的css选择器均可，比如：id、.class等
			up : {
				height:50,//可选.默认50.触发上拉加载拖动距离
				auto:true,//可选,默认false.自动上拉加载一次
				contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
				contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
				callback : findData //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
			}
		}
	});

	mui('.order-ul').on('tap', '.tourinfo', function() {
		var id = this.getAttribute('data-id');
		var actionStatus = this.getAttribute('data-actionStatus');
		var summary = this.getAttribute('data-summary');
		var index = 1;
		//待处理0 已完成计调1 已分配摄影师2 状态，跳到详情页默认展示计调信息tab
		//正在拍摄中 3  已完成输出4 跳到详情页默认展示输出信息tab
		if(actionStatus == 0 ||actionStatus == 1 ||actionStatus == 2){
			index = 2
		}
		if(actionStatus==3 || actionStatus ==4){
			index = 3
		}
		console.log('actionStatus....'+actionStatus)
		if (vm.currentRoleId!=9) {
			lf.window.openWindow('orderdetails.html', 'orderdetails.html', {}, {
				orderNo: id,
				index: index,
				photographerId: window.Role.photograherId,
				summary: summary
			})
		} else {
			var province = this.getAttribute('data-province');
			var city = this.getAttribute('data-city');
			var actionStatus = this.getAttribute('data-actionStatus')
			lf.window.openWindow('quicksaledetails.html', 'quicksaledetails.html', {}, {
				orderNo: id,
				index: index,
				photographerId: window.Role.photograherId,
				summary: summary,
				actionStatus: actionStatus,
				province: province,
				city: city
			})
		}
	})
	mui('.order-ul').on('tap', '.qdbtn', function() {
		var id = this.getAttribute('data-id')
		var no = this.getAttribute('data-no')
		//确认，取消
		lf.nativeUI.confirm("", "你确认要执行订单", ["确定", "取消"], function(e) {
			if(e.index == 0) {
				var params = {
					"orderId": id,
					"orderState": 2,
					"orderNo": no
				};
				lf.nativeUI.showWaiting()
				lf.net.getJSON('/order/updateOrderState', params, function(res) {
					lf.nativeUI.closeWaiting()
					if(res.code == 200) {
						mui(vm.pullObjects[1]).pullToRefresh().pullDownLoading();
						lf.nativeUI.toast('操作成功')
					} else {
						lf.nativeUI.toast(res.msg)
					}
				}, function(res) {
					lf.nativeUI.closeWaiting()
					lf.nativeUI.toast(res.msg)
				})
			}
		});
	})
	mui('.order-ul').on('tap', '.qxbtn', function() {
		var id = this.getAttribute('data-id')
		var no = this.getAttribute('data-no')
		//确认，取消
		lf.nativeUI.confirm("", "你确认要取消订单", ["确定", "取消"], function(e) {
			if(e.index == 0) {
				var params = {
					"orderId": id,
					"orderState": 3,
					"orderNo": no
				};
				lf.nativeUI.showWaiting()
				lf.net.getJSON('/order/updateOrderState', params, function(res) {
					lf.nativeUI.closeWaiting()
					if(res.code == 200) {
						lf.event.fire(lf.window.currentWebview().opener(), 'indexdata', {})
						mui(vm.pullObjects[1]).pullToRefresh().pullDownLoading();
						lf.nativeUI.toast('操作成功')
					} else {
						lf.nativeUI.toast(res.msg)
					}
				}, function(res) {
					lf.nativeUI.closeWaiting()
					lf.nativeUI.toast(res.msg)
				})
			}
		});
	})

mui('.order-ul').on('tap', '.assignOrder', function() { //点击指派
	var orderid = this.getAttribute('data-id');
	console.log('id:' + orderid)
	lf.window.openWindow('designate/designate.html ', '../designate/designate.html', {}, {
		orderId: orderid
	})
})
mui('.order-ul').on('tap', '.allotPhotoOrder', function() { //点击分配
	var orderNo = this.getAttribute('data-no');
	console.log('id:' + orderNo)
	lf.window.openWindow('operator/operator.html', '../operator/operator.html', {}, {
		orderNo: orderNo,
		type: 2,
		status: 'edit'
	})
})
mui('.order-ul').on('tap', '.jidiao', function() { //点击计调
	var orderid = this.getAttribute('data-no');
	console.log('id:' + orderid)
	lf.window.openWindow('operator/operator.html', '../operator/operator.html', {}, {
		orderNo: orderid,
		type: 0,
		status: 'edit'
	})
})

mui('.order-ul').on('tap', '.summary', function() { //点击心得
	var orderid = this.getAttribute('data-id');
	var tourId = this.getAttribute('data-tourId');
	console.log('列表页点击心得' + orderid + '，' + tourId + ',' + window.Role.usercode + ',' + window.Role.photograherId)
	lf.window.openWindow('schedule/summary.html', '../schedule/summary.html', {}, {
		orderId: orderid,
		tourId: tourId,
		userId: window.Role.usercode,
		photographerId: window.Role.photograherId
	})
})

mui('.order-ul').on('tap', '.outOrder', function() { //点击填写输出信息
	var orderid = this.getAttribute('data-id');
	console.log('id:' + orderid)
	lf.window.openWindow('result/order-result.html', '../result/order-result.html', {}, {
		orderId: orderid,
	})
})

mui('.order-ul').on('tap', '.saleOutOrder', function() { //点击销售输出
	var orderid = this.getAttribute('data-no');
	console.log('id:' + orderid)
	lf.window.openWindow('result/sales-export.html', '../result/sales-export.html', {}, {
		orderId: orderid,
	})
})

mui('.order-ul').on('tap', '.genSale', function() { //点击生成销售
	var orderid = this.getAttribute('data-id');
	var areaCode = this.getAttribute('data-areaCode');
	var tourGuide = this.getAttribute('data-tourGuide');
	var purchaser = this.getAttribute('data-purchaser');
	var aliasName = this.getAttribute('data-aliasName');
	var province = this.getAttribute('data-province');
	var city = this.getAttribute('data-city');
	console.log('id:' + orderid)
	lf.window.openWindow('order-pay/order-pay.html', '../order-pay/order-pay.html', {}, {
		orderId: orderid,
		areaCode: areaCode,
		tourGuide: tourGuide,
		purchaser: purchaser,
		aliasName: aliasName,
		province: province,
		city: city
	})
})

mui('body').on('tap', '#confirmComplete', function() { //确认完成
	lf.nativeUI.confirm("操作提示", "确认后订单无法修改，是否确认订单完成?", ["确定", "取消"], function(e) {
		if(e.index == 0) {
			completeFn()
		}
	});


	function completeFn() {
		var params = {
			orderId: vm.currentOrderId,
			orderState: 2,
			orderNo: vm.currentOrderNo
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

mui('body').on('tap', '#saleComplete', function() { //销售完成
	var params = {
		orderId: vm.currentOrderId,
		orderState: 1,
		orderNo: vm.currentOrderNo
	};
	lf.net.getJSON('order/updateOrderState', params, function(data) {
		if(data.code == 200) {
			lf.nativeUI.toast("已完成所有销售！");
			lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
			lf.window.closeCurrentWebview();
		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	});
})
mui(".order-ul").on('tap', ".guideinfo a", function(){
	var tel = this.getAttribute('data-tel')
	window.location.href= "tel://"+tel+"#mp.weixin.qq.com"
})
})