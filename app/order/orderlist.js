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
	}
})
lf.ready(function() {
	vm.currentRole = window.Role.userrole;

	vm.cancelRole = window.Role.hasAuth('cancel') // 取消按钮的key
	vm.operatorRole = window.Role.hasAuth('handle') // 计调key
	vm.allotRole = window.Role.hasAuth('allotPhoto') // 分配按钮的key
	vm.assignRole = window.Role.hasAuth('assign') // 指派按钮的key

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
		index: 2
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

mui('.order-ul').on('tap', '.assign', function() { //点击指派
	var orderid = this.getAttribute('data-id');
	lf.window.openWindow('common/chooseuser.html', '../common/chooseuser.html', {}, {
		orderNo: orderid,
		type: 1
	})
})
mui('.order-ul').on('tap', '.allot', function() { //点击分配
	var orderid = this.getAttribute('data-id');
	lf.window.openWindow('common/plancamera.html', '../common/plancamera.html', {}, {
		orderNo: orderid
	})
})
mui('.order-ul').on('tap', '.operator', function() { //点击计调
	var orderid = this.getAttribute('data-no');
	console.log('id:' + orderid)
	lf.window.openWindow('order/trackinfo.html', '../order/trackinfo.html', {}, {
		orderNo: orderid
	})
})

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
								vm.orderHeader[0].number = res.data.result[0].doCount;//处理中
								vm.orderHeader[1].number = res.data.result[0].completeCount;//已完成
								vm.orderHeader[2].number = res.data.result[0].cancelCount;//已取消
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
								vm.orderHeader[0].number = res.data.result[0].doCount;//处理中
								vm.orderHeader[1].number = res.data.result[0].completeCount;//已完成
								vm.orderHeader[2].number = res.data.result[0].cancelCount;//已取消
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