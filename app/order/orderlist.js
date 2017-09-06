var vm = new Vue({
	el: '#app',
	data: {
		index: 0,
		orderHeader: [{ name: '待处理', number: '' }, { name: '进行中', number: '' }],
		orderList: [
			[],
			[],
			[]
		],
		pageNos: [

		],
		opType: 'list',//搜索类型
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
		currentRoleId:'',//当前用户角色id,
		wgtVer: ''//版本号
	},
	watch: {
		rolePositionId: function(val, oldVal) {
			if (oldVal == '') return
			switchRolePostion(val)
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
		vm.confirmOrder = window.Role.hasAuth('confirmOrder'), // 确认完成
		vm.currentRole = window.Role.userrole;
		if(window.Role.currentPositions.length>0){
			vm.currentRoleId = window.Role.currentPositions[0].roleId;
			console.log("当前用户的角色id"+vm.currentRoleId)
		}
	vm.cancelRole = window.Role.hasAuth('cancel') // 取消按钮的key
	vm.operatorRole = window.Role.hasAuth('handle') // 计调key
	// vm.allotPhotoOrder = window.Role.hasAuth('allotPhotoOrder') // 分配按钮的key
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
	update() 

	getVersion()
})
/*document.getElementById('searchDiv').addEventListener('tap',function(){
	lf.window.openWindow('ordersearch.html', 'ordersearch.html')
})*/

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
	console.log('actionStatus....'+actionStatus+','+summary)
	lf.window.openWindow('orderdetails.html', 'orderdetails.html', {}, {
		orderNo: id,
		index: index,
		photographerId: window.Role.photograherId,
		summary: summary
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
	var summary = this.getAttribute('data-summary');
	console.log('列表页点击心得' + orderid + '，' + tourId + ',' + window.Role.usercode + ',' + window.Role.photograherId+','+summary)
	if(!summary){ // summary= false 进入录入页面，summary= true 进入查看页面，
		lf.window.openWindow('schedule/summary.html', '../schedule/summary.html', {}, {
			orderId: orderid,
			tourId: tourId,
			userId: window.Role.usercode,
			photographerId: window.Role.photograherId
		})
	}
	else{
		lf.window.openWindow('schedule/details.html', '../schedule/details.html', {}, {
			orderId: orderid,
			tourId: tourId,
			userId: window.Role.usercode,
			photographerId: window.Role.photograherId
		})
	}
	
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
	console.log('id:' + orderid)
	lf.window.openWindow('order-pay/order-pay.html', '../order-pay/order-pay.html', {}, {
		orderId: orderid,
		areaCode: areaCode,
		tourGuide: tourGuide,
		purchaser: purchaser,
		aliasName: aliasName,
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
 * 快速支付
 */
mui('body').on('tap', '.quick-sale-pay', function() {
	lf.window.openWindow('quickOrderPay', '../quick-order-pay/quick-order-pay.html', {}, {})
})

mui('body').on('tap', '#confirmComplete', function() { //确认完成
	var id = this.getAttribute('data-id')
	var no = this.getAttribute('data-no')
	lf.nativeUI.confirm("操作提示", "确认后订单无法修改，是否确认订单完成?", ["确定", "取消"], function(e) {
		if(e.index == 0) {
			completeFn()
		}
	});


	function completeFn() {
		var params = {
			orderId: id,
			orderState: 2,
			orderNo: no
		};
		lf.net.getJSON('order/updateOrderState', params, function(data) {
			if(data.code == 200) {
				lf.nativeUI.toast("确认成功！");
			} else {
				lf.nativeUI.toast(data.msg);
			}
		}, function(erro) {
			lf.nativeUI.toast(erro.msg);
		});
	}
})


// 快速下单
mui('body').on('tap', '#quickOrder', function() {
	lf.window.openWindow('quick-order/quick-order.html', '../quick-order/quick-order.html', {})
})
/**
 * 搜索订单
 */
mui('body').on('tap', '#search-order', function() {
	lf.window.openWindow('search.html', 'search.html', {})
})
mui('body').on('tap', '.footer-message-btn', function() {
	lf.window.openWindow('../message/message.html','../message/message.html',{},{},lf.window.currentWebview())
})
mui('body').on('tap','.footer-personage-btn',function(){
	lf.window.openWindow('../personal/personal.html','../personal/personal.html',{},{},lf.window.currentWebview())
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
				currentPositions: data.data.positions,
				photograherId: data.data.photograherId
			}
			window.Role.save(obj)
			lf.nativeUI.toast('切换岗位成功');

			if(window.Role.currentPositions.length>0){
				vm.currentRoleId = window.Role.currentPositions[0].roleId;
				console.log("当前用户的角色id"+vm.currentRoleId)
			}

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
			r = 0;
			break;
		case 1:
			r = 1;
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
							pageSize: vm.pageNum,
							searchSource: 'list',
							optype: vm.opType
						};
						console.log(JSON.stringify(params));
						lf.net.getJSON('/order/search', params, function(res) {
							self.endPullDownToRefresh();
							console.log(JSON.stringify(res));
							if(res.code == 200) {
								self.refresh(true);
								dodata('down', index, res.data.result)
								res.data.result.forEach(function(v, i) {
									v.startTime = lf.util.timeStampToDate2(v.startTime)
									v.tourGuidePhone = v.tourGuidePhone.split(',')

									console.log(JSON.stringify(v.tourGuidePhone));
								})
								console.log("*******************");
								console.log(res.data.result.length);
								if(res.data.result.length > 0) {
									vm.orderHeader[0].number = res.data.result[0].doCount; //待处理
									vm.orderHeader[1].number = res.data.result[0].completeCount; //已处理
									// vm.orderHeader[2].number = res.data.result[0].cancelCount; //已取消
								}
								else{
									vm.orderHeader[0].number = ''; //处理中
									vm.orderHeader[1].number = ''; //已完成
									// vm.orderHeader[2].number = ''; //已取消
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
							pageSize: vm.pageNum,
							searchSource: 'list',
							opType: vm.opType
						};
						console.log(JSON.stringify(params));
						lf.net.getJSON('/order/search', params, function(res) {
							console.log(JSON.stringify(res));
							if(res.code == 200) {
								self.endPullUpToRefresh(vm.pageNos[index] >= res.data.totalPages);
								dodata('up', index, res.data.result)
								res.data.result.forEach(function(v, i) {
									v.startTime = lf.util.timeStampToDate2(v.startTime)
									v.tourGuidePhone = v.tourGuidePhone.split(',')
									console.log(JSON.stringify(v.tourGuidePhone));
								})
								console.log("##############");
								console.log(res.data.result.length);
								if(res.data.result.length > 0) {
									vm.orderHeader[0].number = res.data.result[0].doCount; //处理中
									vm.orderHeader[1].number = res.data.result[0].completeCount; //已完成
									// vm.orderHeader[2].number = res.data.result[0].cancelCount; //已取消
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
		pageSize: vm.pageNum,
		searchSource: 'list'
	};
	lf.net.getJSON('/order/search', params, function(res) {
		console.log(JSON.stringify(res));

		console.log("%%%%%%%%%%%%%%%%%%%%");
		if(res.code == 200) {
			dodata('up', index, res.data.result)

			res.data.result.forEach(function(v, i) {
				v.startTime = lf.util.timeStampToDate2(v.startTime)
				v.tourGuidePhone = v.tourGuidePhone.split(',')
				console.log(JSON.stringify(v.tourGuidePhone));
			})

			if(res.data.result.length > 0) {
				vm.orderHeader[0].number = res.data.result[0].doCount; //处理中
				vm.orderHeader[1].number = res.data.result[0].completeCount; //已完成
				// vm.orderHeader[2].number = res.data.result[0].cancelCount; //已取消
			}
			else{
				vm.orderHeader[0].number = ''; //处理中
				vm.orderHeader[1].number = ''; //已完成
				// vm.orderHeader[2].number = ''; //已取消
			}
		} else {
			vm.pageNos[index]--;
			lf.nativeUI.toast(res.msg)
		}
	}, function(res) {
		vm.pageNos[index]--;
		lf.nativeUI.toast(res.msg)
	})
}
function update() {
	var params = {
		"app_id": plus.runtime.appid,
		"version": plus.runtime.version,
		"imei": plus.device.imei,
		"platform": plus.os.name
	};
	lf.net.getJSON("/app/validationversion", params, function(data) {
		var update_desc = "发现新的版本，是否需要立即更新";
		if(data.code == 200) {
			var btns = null;
			console.log(data.data.releaseUrl)
			if(data.data.isMandatory == 1) {
				update_desc = "发现新的版本，请立即更新";
				btns = ["立即更新"];
			} else {
				btns = ["立即更新", "取　　消"];
			}
			if(data.data.upgrade_desc) {
				update_desc = update_desc + "\n" + data.data.releaseRemark;
			}
			lf.nativeUI.confirm("", update_desc, btns, function(e) {
				if(btns.length == 1) {
					if(0 == e.index) {
						plus.runtime.openURL(data.data.releaseUrl);
						lf.window.closeCurrentWebview();
					} else {
						plus.runtime.quit();
					}
				} else {
					if(0 == e.index) {
						plus.runtime.openURL(data.data.releaseUrl);
						lf.window.closeCurrentWebview();
					} else {}
				}
			});
		}
	}, function(res) {});
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

function getVersion() {
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
        vm.wgtVer = inf.version;
        console.log("当前应用版本：" + vm.wgtVer);
    });
}