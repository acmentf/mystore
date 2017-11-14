var vm = new Vue({
	el: '#app',
	data: {
		index: 0,
		orderHeader: [{ name: '未关联', number: '' }, { name: '已关联', number: '' }],
		orderList: [
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
})	

mui('body').on('tap', '#logout', function() {
	lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
		if(e.index == 0) {
			window.Role.logout();
			GLOBAL_SHOOT.restart();
		}
	});
})



/**
 * 搜索订单
 */
mui('body').on('tap', '#search-order', function() {
	lf.window._openWindow('search.html', 'search.html', {})
})
mui('body').on('tap', '.footer-message-btn', function() {
	lf.window._openWindow('../message/message.html','../message/message.html',{},{},lf.window.currentWebview())
})
mui('body').on('tap', '.footer-order-btn', function() {
	lf.window._openWindow('../order/orderlist.html','../order/orderlist.html',{},{},lf.window.currentWebview())
})
mui("body").on("tap", ".correlate", function() {
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
	var actionStatus = this.getAttribute('data-actionStatus');
	var summary = this.getAttribute('data-summary');
	var saleOrderId = this.getAttribute('data-saleId');
	lf.window.openWindow('../order-pay/order-pay-detail.html', '../order-pay/order-pay-detail.html', {}, {
		orderId: orderid,
		saleOrderId: saleOrderId,
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
mui("body").on("tap", ".no-correlate", function() {
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
	var actionStatus = this.getAttribute('data-actionStatus');
	var summary = this.getAttribute('data-summary');
	var saleOrderId = this.getAttribute('data-saleId');
	lf.window.openWindow('editSaleOrder.html','editSaleOrder.html',{},{
		orderId: orderid,
		saleOrderId: saleOrderId,
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
		} else if(roleId != 9) {
			GLOBAL_SHOOT.switchPositionOpenWindow('order-list','../order/orderlist.html',{},{},lf.window.currentWebview())
		}

		// if (window.Role.currentPositions[0].roleId==12) {
		//     lf.window.openWindow('daily-manage','../daily-manage/daily-manage.html',{},{})
		// } else if(window.Role.currentPositions[0].roleId!=9){
		//     lf.window.openWindow('order-list','../order/orderlist.html',{},{})
		// }

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
							isAssociation: getType(index),
							curPage: vm.pageNos[index],
							pageSize: vm.pageNum,
							searchSource: 'list',
							optype: vm.opType
						};
						console.log(JSON.stringify(params));
						lf.net.getJSON('/pay/getSaleOrdersList1', params, function(res) {
							self.endPullDownToRefresh();
							console.log(JSON.stringify(res));
							if(res.code == 200) {
								self.refresh(true);
								res.data.forEach(function(v, i) {
									v.startTime = lf.util.timeStampToDate2(v.startTime)
									if(v.orderTime){
										v.orderTime = lf.util.timeStampToDate2(v.orderTime)
									}
									if(v.orderSaleDate){
										v.orderSaleDate = lf.util.timeStampToDate2(v.orderSaleDate)
									}
									if(v.saleDate){
										v.saleDate = lf.util.timeStampToDate2(v.saleDate)
									}
									if(v.createTime){
										v.createTime = lf.util.timeStampToDate(v.createTime)
									}
									if(v.tourGuidePhone) {
										v.tourGuidePhone = v.tourGuidePhone.split(',')
									}

									console.log(JSON.stringify(v.tourGuidePhone));
								})
								dodata('down', index, res.data)
								console.log("*******************");
								console.log(res.data.length);
								if(res.data.length > 0) {
									vm.orderHeader[0].number = res.data[0].doCount; //待处理
									vm.orderHeader[1].number = res.data[0].completeCount; //已处理
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
							isAssociation: getType(index),
							curPage: vm.pageNos[index],
							pageSize: vm.pageNum,
							searchSource: 'list',
							opType: vm.opType
						};
						console.log(JSON.stringify(params));
						lf.net.getJSON('/pay/getSaleOrdersList1', params, function(res) {
							console.log(JSON.stringify(res));
							if(res.code == 200) {
								if(res.data.length>0){
									self.endPullUpToRefresh(false)
								} else {
									self.endPullUpToRefresh(true)
								}
								res.data.forEach(function(v, i) {
									v.startTime = lf.util.timeStampToDate2(v.startTime)
									if(v.orderSaleDate){
										v.orderSaleDate = lf.util.timeStampToDate2(v.orderSaleDate)
									}
									if(v.orderTime){
										v.orderTime = lf.util.timeStampToDate2(v.orderTime)
									}
									if(v.createTime){
										v.createTime = lf.util.timeStampToDate(v.createTime)
									}
									if(v.tourGuidePhone) {
										v.tourGuidePhone = v.tourGuidePhone.split(',')
									}
									console.log(JSON.stringify(v.tourGuidePhone));
								})
								dodata('up', index, res.data)
								console.log("##############");
								console.log(res.data.length);
								if(res.data.length > 0) {
									vm.orderHeader[0].number = res.data[0].doCount; //处理中
									vm.orderHeader[1].number = res.data[0].completeCount; //已完成
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
		isAssociation: getType(index),
		curPage: vm.pageNos[index],
		pageSize: vm.pageNum,
		searchSource: 'list'
	};
	lf.net.getJSON('/pay/getSaleOrdersList1', params, function(res) {
		console.log(JSON.stringify(res));

		console.log("%%%%%%%%%%%%%%%%%%%%");
		if(res.code == 200) {
			dodata('up', index, res.data)

			res.data.forEach(function(v, i) {
				v.startTime = lf.util.timeStampToDate2(v.startTime)
				if(v.orderSaleDate){
					v.orderSaleDate = lf.util.timeStampToDate2(v.orderSaleDate)
				}
				if(v.orderTime){
					v.orderTime = lf.util.timeStampToDate2(v.orderTime)
				}
				if(v.createTime){
					v.createTime = lf.util.timeStampToDate(v.createTime)
				}
				if(v.tourGuidePhone) {
					v.tourGuidePhone = v.tourGuidePhone.split(',')
				}
				console.log(JSON.stringify(v.tourGuidePhone));
			})

			if(res.data.length > 0) {
				vm.orderHeader[0].number = res.data[0].doCount; //处理中
				vm.orderHeader[1].number = res.data[0].completeCount; //已完成
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
window.addEventListener('orderdetails', function(e) {
	console.log(2222)
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

function getVersion() {
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
        vm.wgtVer = inf.version;
        console.log("当前应用版本：" + vm.wgtVer);
    });
}