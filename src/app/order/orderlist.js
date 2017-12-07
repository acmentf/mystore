var vm = new Vue({
	el: '#app',
	data: {
		index: 0,
		orderHeader: [{ name: '待处理', number: '' }, { name: '进行中', number: '' }],
		orderList: [
			[],
			[]
		],
		pageNos: [

		],
		checkIcon:{
			type: false,
			url: '../../assets/images/order/switch.png'
		},
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
/**
 * 检出用户的操作权限，关系到 每个订单下方的按钮显示
 */
function checkAuth() {
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
	if (vm.currentRoleId == 9) {
		vm.orderHeader[0].name = vm.$t('active_status.servicing')
		vm.orderHeader[1].name = vm.$t('active_status.service_complete')
	} else {
		vm.orderHeader[0].name = vm.$t('active_status.pending')
		vm.orderHeader[1].name = vm.$t('active_status.processing')
	}
	vm.cancelRole = window.Role.hasAuth('cancel') // 取消按钮的key
	vm.operatorRole = window.Role.hasAuth('handle') // 计调key
	// vm.allotPhotoOrder = window.Role.hasAuth('allotPhotoOrder') // 分配按钮的key
	vm.assignRole = window.Role.hasAuth('assign') // 指派按钮的key
}
lf.ready(function() {
	// 检查版本更新
    GLOBAL_SHOOT.update()
    // 设置版本号
    GLOBAL_SHOOT.setVersion(vm)
	//assignOrder 计调、指派
	//allotPhotoOrder 分配
	//outOrder 填写输出信息
	//saleOutOrder 销售输出
	//genSale 生成销售
	//summary 录入心得
	vm.photograherId = window.Role.photograherId,
		// console.log("当前photograherId" + JSON.stringify(window.Role))
	checkAuth();

	vm.rolePositionId = window.Role.userroleId // 岗位id
	vm.username = window.Role.username // 用户昵称
	vm.rolePositionList = window.Role.positions // 岗位列表

	// console.log(JSON.stringify(vm.rolePositionList))
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
mui(".order-ul").on('tap', ".guideinfo a", function(){
	var tel = this.getAttribute('data-tel')
	window.location.href= "tel:"+tel
})
mui('.order-ul').on('tap', '.link', function() {
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
	if (vm.currentRoleId!=9) {
		lf.window.openWindow('orderdetails.html', 'orderdetails.html', {}, {
			orderNo: id,
			index: index,
			photographerId: window.Role.photograherId,
			summary: summary,
			lineName: this.getAttribute('data-aliasName')
		})
	} else {
		var orderid = this.getAttribute('data-id');
		var tourNo = this.getAttribute('data-tourNo');
		var productName = this.getAttribute('data-productName');
		var areaCode = this.getAttribute('data-areaCode');
		var tourGuide = this.getAttribute('data-tourGuide');
		var tourGuidePhone = this.getAttribute('data-tourGuidePhone');
		var purchaser = this.getAttribute('data-purchaser');
		var aliasName = this.getAttribute('data-aliasName');
		var province = this.getAttribute('data-province');
		var city = this.getAttribute('data-city');
		var actionStatus = this.getAttribute('data-actionStatus')
		if(vm.checkIcon.type&&actionStatus<=33) {
			lf.window.openWindow('order-pay/order-pay.html', '../order-pay/order-pay.html', {}, {
				orderId: orderid,
				tourNo: tourNo,
				productName: productName,
				tourGuidePhone: tourGuidePhone,
				areaCode: areaCode,
				tourGuide: tourGuide,
				purchaser: purchaser,
				aliasName: aliasName,
				province: province,
				city: city
			})
		}else {
			lf.window.openWindow('quicksaledetails.html', 'quicksaledetails.html', {}, {
				orderId: orderid,
				tourNo: tourNo,
				productName: productName,
				tourGuidePhone: tourGuidePhone,
				areaCode: areaCode,
				tourGuide: tourGuide,
				purchaser: purchaser,
				aliasName: aliasName,
				actionStatus:actionStatus,
				province: province,
				city: city
			})
		}
	}
})

mui('.order-ul').on('tap', '.qdbtn', function() {
	var id = this.getAttribute('data-id')
	var no = this.getAttribute('data-no')
	//确认，取消
	lf.nativeUI.confirm(vm.$t('tips'), vm.$t('confirm_operate_order'), [vm.$t('ok'), vm.$t('cancel')], function(e) {
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
	lf.nativeUI.confirm(vm.$t('tips'), vm.$t('confirm_cancel_order'), [vm.$t('ok'), vm.$t('cancel')], function(e) {
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
					lf.nativeUI.toast(vm.$t('success'))
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
		status: 'edit',
		lineName: this.getAttribute('data-aliasName')
	})
})
mui('.order-ul').on('tap', '.jidiao', function() { //点击计调
	var orderid = this.getAttribute('data-no');
	console.log('id:' + orderid)
	lf.window.openWindow('operator/operator.html', '../operator/operator.html', {}, {
		orderNo: orderid,
		type: 0,
		status: 'edit',
		lineName: this.getAttribute('data-aliasName'),
		actionStatus: this.getAttribute('data-actionStatus'),
		orderStatus: this.getAttribute('data-orderStatus')
	})
})

mui('.order-ul').on('tap', '.summary', function() { //点击心得
	lf.nativeUI.toast('请使用「摄影师APP」操作');
	return;
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
	var tourNo = this.getAttribute('data-tourNo');
	var productName = this.getAttribute('data-productName');
	var tourGuidePhone = this.getAttribute('data-tourGuidePhone');
	var areaCode = this.getAttribute('data-areaCode');
	var tourGuide = this.getAttribute('data-tourGuide');
	var purchaser = this.getAttribute('data-purchaser');
	var aliasName = this.getAttribute('data-aliasName');
	var province = this.getAttribute('data-province');
	var city = this.getAttribute('data-city');
	console.log('id:' + orderid)
	lf.window.openWindow('order-pay/order-pay.html', '../order-pay/order-pay.html', {}, {
		orderId: orderid,
		tourNo: tourNo,
		productName: productName,
		tourGuidePhone: tourGuidePhone,
		areaCode: areaCode,
		tourGuide: tourGuide,
		purchaser: purchaser,
		aliasName: aliasName,
		province: province,
		city: city
	})
})

mui('body').on('tap', '#logout', function() {
	lf.nativeUI.confirm(vm.$t('tips'), vm.$t('sign_out_tips'), [vm.$t('ok'), vm.$t('cancel')], function(e) {
		if(e.index == 0) {
			window.Role.logout();
			GLOBAL_SHOOT.restart();
		}
	});
})


mui('body').on('tap', '.quick-sale-pay', function() {
	if (!vm.checkIcon.type){
		vm.checkIcon.url = '../../assets/images/order/switch_back.png'
	} else {
		vm.checkIcon.url = '../../assets/images/order/switch.png'
	}
	vm.checkIcon.type = !vm.checkIcon.type
})

mui('body').on('tap', '#confirmComplete', function() { //确认完成
	var id = this.getAttribute('data-id')
	var no = this.getAttribute('data-no')
	lf.nativeUI.confirm(vm.$t('tips'), vm.$t('confirm_service_complete'), [vm.$t('ok'), vm.$t('cancel')], function(e) {
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
				lf.nativeUI.toast(vm.$t('success'));
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
	lf.window.openWindow('quick-order/quick-order.html', '../quick-order/quick-order.html', {}, {})
})
/**
 * 搜索订单
 */
mui('body').on('tap', '#search-order', function() {
	lf.window.openWindow('search.html', 'search.html', {})
})
mui('body').on('tap', '.footer-message-btn', function() {
	try {
		ANDROID_JSB.message()
	} catch (error) {
		lf.nativeUI.showWaiting();
		var redirect = '../../assets/webim/index.html#/contact?username=' + window.Role.usercode;
		lf.window._openWindow(redirect, redirect,{},{},"",function() {
			lf.nativeUI.closeWaiting();
		});
	}
})
mui('body').on('tap', '.footer-order-contact-btn', function() {
	lf.window._openWindow('../correlate-order/correlate-order.html','../correlate-order/correlate-order.html',{},{},lf.window.currentWebview())
})
mui('body').on('tap', '.footer-addressbook-btn', function() {
	try {
		ANDROID_JSB.contact()
	} catch (error) {
		lf.nativeUI.showWaiting();
		var redirect = '../../assets/webim/index.html#/group?username=' + window.Role.usercode;
		lf.window._openWindow(redirect, redirect,{},{},"",function() {
			lf.nativeUI.closeWaiting();
		});
	}
})
mui('body').on('tap','.footer-personage-btn',function(){
	lf.window._openWindow('../personal/personal.html','../personal/personal.html',{},{},lf.window.currentWebview())
})

// 岗位切换
function switchRolePostion(val) {
    GLOBAL_SHOOT.switchPosition(val, function() {
        if(window.Role.currentPositions.length>0){
			vm.currentRoleId = window.Role.currentPositions[0].roleId;
			console.log("当前用户的角色id"+vm.currentRoleId)
		}

		var roleId = window.Role.currentPositions[0].roleId;
		var windowParams = GLOBAL_SHOOT.getPageUrlWithPosition(roleId, 1);
		if(windowParams) {
			GLOBAL_SHOOT.switchPositionOpenWindow(windowParams.windowId,windowParams.pageUrl,{},{},lf.window.currentWebview())
		} else {
			// lf.window.openWindow('order','../order/orderlist.html',{},{})
		}

		// if (window.Role.currentPositions[0].roleId==12) {
		//     lf.window.openWindow('daily-manage','../daily-manage/daily-manage.html',{},{})
		// }
		checkAuth();
	
		if (vm.currentRoleId == 9) {
			vm.orderHeader[0].name = vm.$t('active_status.servicing')
			vm.orderHeader[1].name = vm.$t('active_status.service_complete')
		} else {
			vm.orderHeader[0].name = vm.$t('active_status.pending')
			vm.orderHeader[1].name = vm.$t('active_status.processing')
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
	// console.log(index);
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
						// console.log(JSON.stringify(params));
						lf.net.getJSON('/order/search', params, function(res) {
							self.endPullDownToRefresh();
							// console.log(JSON.stringify(res));
							if(res.code == 200) {
								self.refresh(true);
								res.data.result.forEach(function(v, i) {
									v.startTime = lf.util.timeStampToDate2(v.startTime)
									if(v.saleDate){
										v.saleDate = lf.util.timeStampToDate2(v.saleDate)
									}
									v.tourGuidePhone = v.tourGuidePhone.split(',')

									// console.log(JSON.stringify(v.tourGuidePhone));
								})
								dodata('down', index, res.data.result)
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
					contentnomore: vm.$t('no_more_data'),
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
						// console.log(JSON.stringify(params));
						lf.net.getJSON('/order/search', params, function(res) {
							// console.log(JSON.stringify(res));
							if(res.code == 200) {
								self.endPullUpToRefresh(vm.pageNos[index] >= res.data.totalPages);
								res.data.result.forEach(function(v, i) {
									v.startTime = lf.util.timeStampToDate2(v.startTime)
									if(v.saleDate){
										v.saleDate = lf.util.timeStampToDate2(v.saleDate)
									}
									v.tourGuidePhone = v.tourGuidePhone.split(',')
									// console.log(JSON.stringify(v.tourGuidePhone));
								})
								dodata('up', index, res.data.result)
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
		// console.log(JSON.stringify(res));

		console.log("%%%%%%%%%%%%%%%%%%%%");
		if(res.code == 200) {
			dodata('up', index, res.data.result)

			res.data.result.forEach(function(v, i) {
				v.startTime = lf.util.timeStampToDate2(v.startTime)
				if(v.saleDate){
					v.saleDate = lf.util.timeStampToDate2(v.saleDate)
				}
				v.tourGuidePhone = v.tourGuidePhone.split(',')
				// console.log(JSON.stringify(v.tourGuidePhone));
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
lf.event.listener('orderPay', function(e) {
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