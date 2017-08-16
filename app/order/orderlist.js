var vm = new Vue({
	el: '#app',
	data: {
		index: 0,
		orderHeader: [{ name: '处理中', number: '' }, { name: '已完成', number: '' }, { name: '已取消', number: '' }],
		orderList: [
			[],
			[],
			[]
		],
		pageNos: [

		],
		pageNum: 10,
		pullObjects: [],
		cancelRole: false,
		allotRole: false,
		assignRole: false,
		operatorRole: false,
		currentRole: '',
		assignOrder: false, //计调、指派 
		allotPhotoOrder: false, // 分配
		outOrder: false, // 填写输出信息
		saleOutOrder: false, // 销售输出
		genSale: false, // 生成销售
		summary: false, // 录入心得
		photograherId: '',
		username: '',
		rolePositionList: [],
		rolePositionId: '',
	},
	methods: {
		switchPosition: function() {
			switchRolePostion(this.rolePositionId)
		}
	}
})
lf.ready(function() {
	//assignOrder 计调、指派
	//allotPhotoOrder 分配
	//outOrder 填写输出信息
	//saleOutOrder 销售输出
	//genSale 生成销售
	//summary 录入心得
	vm.photograherId = window.Role.photograherId,
		console.log("当前photograherId" + JSON.stringify(window.Role))
	vm.assignOrder = window.Role.hasAuth('assignOrder'), //计调、指派 
		vm.allotPhotoOrder = window.Role.hasAuth('allotPhotoOrder'), // 分配
		vm.outOrder = window.Role.hasAuth('outOrder'), // 填写输出信息
		vm.saleOutOrder = window.Role.hasAuth('saleOutOrder'), // 销售输出
		vm.genSale = window.Role.hasAuth('genSale'), // 生成销售
		vm.summary = window.Role.hasAuth('summary'), // 录入心得
		vm.currentRole = window.Role.userrole;

	vm.cancelRole = window.Role.hasAuth('cancel') // 取消按钮的key
	vm.operatorRole = window.Role.hasAuth('handle') // 计调key
	vm.allotRole = window.Role.hasAuth('allotPhoto') // 分配按钮的key
	vm.assignRole = window.Role.hasAuth('assign') // 指派按钮的key

	vm.rolePositionId = window.Role.userroleId // 岗位id
	vm.username = window.Role.username // 用户昵称
	vm.rolePositionList = window.Role.positions // 岗位列表

	console.log(JSON.stringify(vm.rolePositionList))
	/*if(vm.currentRole == 2){
		vm.orderHeader = ['全部','待处理','已完成','已取消']
		vm.orderList.splice(3,1);
	}*/
	Vue.nextTick(function() {
		initPull();
	})

	document.querySelector('.mui-slider').addEventListener('slide', function(event) {
		vm.index = event.detail.slideNumber;
	});

	var status = lf.window.currentWebview().status;
	var gallery = mui('.mui-slider');
	switch(status) {
		case '1':
			gallery.slider().gotoItem(1, 0);
			break;
		case '2':
			gallery.slider().gotoItem(2, 0);
			break;
		case '3':
			gallery.slider().gotoItem(4, 0);
			break;
		case '4':
			gallery.slider().gotoItem(3, 0);
			break;
		default:
			break;
	}

})
/*document.getElementById('searchDiv').addEventListener('tap',function(){
	lf.window.openWindow('ordersearch.html', 'ordersearch.html')
})*/

mui('.order-ul').on('tap', '.tourinfo', function() {
	console.log('gotoorderdetails')
	var id = this.getAttribute('data-id');
	lf.window.openWindow('orderdetails.html', 'orderdetails.html', {}, {
		orderNo: id,
		index: 1,
		photographerId: window.Role.photograherId
	})
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
	var orderid = this.getAttribute('data-no');
	console.log('id:' + orderid)
	lf.window.openWindow('order-pay/order-pay.html', '../order-pay/order-pay.html', {}, {
		orderId: orderid,
	})
})

mui('body').on('tap', '#logout', function() {
	lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
		if(e.index == 0) {
			window.Role.logout();
			plus.runtime.restart();
		}
	});
})

/**
 * 搜索订单
 */
mui('body').on('tap', '#search-order', function() {
	lf.window.openWindow('search.html', 'search.html', {})
})

function switchRolePostion(val) {
	var params = {
		positionId: val
	};
	lf.nativeUI.showWaiting();
	lf.net.getJSON('user/switchPosition', params, function(data) {
		console.log(JSON.stringify(data));
		if(data.code == 200) {
			lf.nativeUI.closeWaiting();
			var obj = {
				usercode: data.data.id,
				username: data.data.name,
				phone: data.data.phone,
				companyId: data.data.companyId,
				userrole: data.data.positions[0].type,
				userroleName: data.data.positions[0].name,
				userroleId: data.data.positions[0].id,
				tonken: data.data.token,
				loginsign: '1',
				auths: data.data.auths,
				positions: data.data.userPositionList,
				photograherId: data.data.photograherId
			}
			window.Role.save(obj)
			lf.nativeUI.toast('切换岗位成功');

			vm.orderList.forEach(function(v, i) { // 将数据制空
				dodata('down', i, [])
				vm.pageNos[i] = 0;
				find(i);
			})
		
			vm.pullObjects.forEach(function(v) { // 将数据全部重新加载一次
				mui(v).pullToRefresh().refresh(true);
			})

			lf.event.fire(lf.window.currentWebview().opener(), 'indexdata', {})
		} else {
			lf.nativeUI.closeWaiting();
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.closeWaiting();
		lf.nativeUI.toast(erro.msg);
	})
}

function dodata(type, index, data) {
	if(type == 'up') {
		Vue.set(vm.orderList, index, vm.orderList[index].concat(data))
	} else {
		Vue.set(vm.orderList, index, data)
	}
}

function getType(index) {
	var r = "";
	console.log(index);
	switch(index) {
		case 0:
			r = 1;
			break;
		case 1:
			r = 7;
			break;
		case 2:
			r = 3;
			break;
		default:
			break;
	}
	console.log('r:' + r);
	return r;
}
//阻尼系数
function initPull() {
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	mui.ready(function() {
		//循环初始化所有下拉刷新，上拉加载。
		mui.each(document.querySelectorAll('.mui-slider .mui-scroll'), function(index, pullRefreshEl) {
			vm.pageNos[index] = 0;
			vm.pullObjects[index] = pullRefreshEl;
			mui(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						vm.pageNos[index] = 1;
						var params = {
							status: getType(index),
							currPage: vm.pageNos[index],
							pageSize: vm.pageNum
						};
						lf.net.getJSON('/order/search', params, function(res) {
							self.endPullDownToRefresh();
							if(res.code == 200) {
								self.refresh(true);
								dodata('down', index, res.data.result)
								res.data.result.forEach(function(v, i) {
									v.startTime = lf.util.timeStampToDate2(v.startTime)
								})
								if(res.data.result.length > 0) {
									vm.orderHeader[0].number = res.data.result[0].doCount; //处理中
									vm.orderHeader[1].number = res.data.result[0].completeCount; //已完成
									vm.orderHeader[2].number = res.data.result[0].cancelCount; //已取消
								}

							} else {
								vm.pageNos[index]--;
								lf.nativeUI.toast(res.msg)
							}
						}, function(res) {
							vm.pageNos[index]--;
							self.endPullDownToRefresh();
							lf.nativeUI.toast(res.msg)
						})
					}
				},
				up: {
					auto: true,
					callback: function() {
						var self = this;
						vm.pageNos[index]++;
						var params = {
							status: getType(index),
							currPage: vm.pageNos[index],
							pageSize: vm.pageNum
						};
						lf.net.getJSON('/order/search', params, function(res) {
							if(res.code == 200) {
								self.endPullUpToRefresh(vm.pageNos[index] >= res.data.totalPages);
								dodata('up', index, res.data.result)
								res.data.result.forEach(function(v, i) {
									v.startTime = lf.util.timeStampToDate2(v.startTime)
								})
								if(res.data.result.length > 0) {
									vm.orderHeader[0].number = res.data.result[0].doCount; //处理中
									vm.orderHeader[1].number = res.data.result[0].completeCount; //已完成
									vm.orderHeader[2].number = res.data.result[0].cancelCount; //已取消
								}
							} else {
								self.endPullUpToRefresh();
								vm.pageNos[index]--;
								lf.nativeUI.toast(res.msg)
							}
						}, function(res) {
							vm.pageNos[index]--;
							self.endPullUpToRefresh();
							lf.nativeUI.toast(res.msg)
						})
					}
				}
			});
		});
	});
}

function find(index) {
	vm.pageNos[index]++;
	var params = {
		status: getType(index),
		currPage: vm.pageNos[index],
		pageSize: vm.pageNum
	};
	lf.net.getJSON('/order/search', params, function(res) {
		if(res.code == 200) {
			dodata('up', index, res.data.result)
		} else {
			vm.pageNos[index]--;
			lf.nativeUI.toast(res.msg)
		}
	}, function(res) {
		vm.pageNos[index]--;
		lf.nativeUI.toast(res.msg)
	})
}
lf.event.listener('orderdetails', function(e) {
	vm.orderList.forEach(function(v, i) { // 将数据制空
		dodata('down', i, [])
		vm.pageNos[i] = 0;
		find(i);
	})

	vm.pullObjects.forEach(function(v) { // 将数据全部重新加载一次
		mui(v).pullToRefresh().refresh(true);
	})
	lf.event.fire(lf.window.currentWebview().opener(), 'indexdata', {})
	//mui(vm.pullObjects[vm.index]).pullToRefresh().pullDownLoading();
})
lf.event.listener('selectAssignUser', function(e) {
	console.log(JSON.stringify(e.detail, null, 2))
})