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
		currentOrderId: '',
		orderInfo: {},
		orderTrackInfo: {},
		orderResult: {},
		photographerInfos: [],
		currentTourId: '',
		photographerId: '',
		currentOrderNo: '',
		currentOrderStatus: '',
		allotRole: false,
		assignRole: false,
		// confirmRole:false,
		cancelRole: false,
		summaryRole: false,
		feedbackRole: false, // 销售输出
		handleRole: false,
		shootFeedbackRole: false, // 拍摄输出
		photographerExperienceFlage: '',
		actionStatus: '', //
		outPutStatus: '',
		shotOrderOutput: [], //订单拍摄输出
		orderdetailShow: false,
		currentTabIndex: 1,
		shotOrderOutput: [],
		assignedPhotographers: [],
		temp: [],
		assignedPhotographersString: '',
		assignOrder: false, //计调、指派
		allotPhotoOrder: false, // 分配
		outOrder: false, // 填写输出信息
		saleOutOrder: false, // 销售输出
		genSale: false, // 生成销售
		summary: false, // 录入心得
		photographerId: '', //当前登录用户的摄影师id
		currentRoleId: '', //当前用户的角色id
		photographerData: [],
		summaryFlag: '',
		tourGuidePhoneList: []
	}
})

lf.ready(function() {
	//assignOrder 计调、指派
	//allotPhotoOrder 分配
	//outOrder 填写输出信息
	//saleOutOrder 销售输出
	//genSale 生成销售
	//summary 录入心得
	vm.currentTabIndex = lf.window.currentWebview().index;
	vm.summaryFlag = lf.window.currentWebview().summary;
	vm.photograherId = window.Role.photograherId,
		console.log("当前photograherId" + vm.photograherId)
	vm.assignOrder = window.Role.hasAuth('assignOrder'), //计调、指派
		vm.allotPhotoOrder = window.Role.hasAuth('allotPhotoOrder'), // 分配
		vm.outOrder = window.Role.hasAuth('outOrder'), // 填写输出信息
		vm.saleOutOrder = window.Role.hasAuth('saleOutOrder'), // 销售输出
		vm.genSale = window.Role.hasAuth('genSale'), // 生成销售
		vm.summary = window.Role.hasAuth('summary'), // 录入心得
		vm.currentOrderId = lf.window.currentWebview().orderNo;
	vm.allotRole = window.Role.hasAuth('allotPhoto') // 分配按钮的key
	vm.assignRole = window.Role.hasAuth('assign') // 指派按钮的key
	vm.cancelRole = window.Role.hasAuth('cancel') // 取消按钮的key
	// vm.confirmRole = window.Role.hasAuth('confirm')// 取消按钮的key
	vm.summaryRole = window.Role.hasAuth('summary') // 录入心得按钮的key
	vm.feedbackRole = window.Role.hasAuth('feedback') // 录入执行结果按钮的key
	vm.handleRole = window.Role.hasAuth('handle') // 录入跟踪信息按钮的key
	vm.shootFeedbackRole = window.Role.hasAuth('shootFeedback') // 拍摄输出按钮的key
	renderOrderDetails();
	vm.currentRole = window.Role.userrole;
	if(window.Role.currentPositions.length > 0) {
		vm.currentRoleId = window.Role.currentPositions[0].roleId;
		console.log("当前用户的角色id" + vm.currentRoleId)
	}
	mui('.mind').on('tap', '.photpgrapher-name', function() { //点击摄影师名字
		var id = this.getAttribute('data-id');
		lf.event.fire(lf.window.currentWebview().opener(), 'addPhotographer', {
			id: id
		})
	});
	mui('.operate').on('tap', '.button', function() {
		if(vm.currentOrderStatus == 3) {
			lf.nativeUI.toast('该订单已取消！');
		} else {
			vm.maskShow = true;
			vm.popupShow = true;
		}
	});
	mui('body').on('tap', '.mask', function(event) { //点击遮罩层隐藏弹窗
		event.stopPropagation();
		vm.maskShow = false;
		vm.popupShow = false;
		vm.orderdetailShow = false;
	})
	mui('.popup-mod').on('tap', '.assign', function() { //点击指派
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('common/chooseuser.html', '../common/chooseuser.html', {}, {
			orderNo: orderid,
			type: 1
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.allot', function() { //点击分配
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('common/plancamera.html', '../common/plancamera.html', {}, {
			orderNo: orderid
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.trackinfo', function() { //点击跟踪信息
		var orderNo = this.getAttribute('data-orderNo');
		lf.window.openWindow('order/trackinfo.html', '../order/trackinfo.html', {}, {
			orderNo: orderNo
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.cancled', function() { //点击取消
		if(vm.currentOrderStatus == 7) {
			lf.nativeUI.toast('订单已完成，无法取消！');
		} else {
			lf.nativeUI.confirm("操作提示", "确定要取消该订单吗?", ["确定", "取消"], function(e) {
				if(e.index == 0) {
					var params = {
						orderId: vm.currentOrderId,
						orderState: 3,
						orderNo: vm.currentOrderNo
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

	mui('.popup-mod').on('tap', '.excuteresult', function() { //点击执行结果
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('order-entering/result.html', '../order-entering/result.html', {}, {
			orderNo: orderid
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.saleout', function() { //点击销售输出
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('result/order-result.html', '../result/order-result.html', {}, {
			orderNo: orderid
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.shootout', function() { //点击拍摄输出
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('order-entering/photo-output.html', '../order-entering/photo-output.html', {}, {
			orderNo: orderid
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.popup-mod').on('tap', '.mind', function() { //点击心得,进入录入心得页面
		var orderid = this.getAttribute('data-orderid');
		if(vm.photographerExperienceFlage == 0) { //1进入查看页面，0进入修改页面
			lf.window.openWindow('summary/summary.html', '../summary/summary.html', {}, {
				orderId: orderid,
				tourId: vm.orderInfo.tourId
			})
		} else {
			lf.window.openWindow('summary/details.html', '../summary/details.html', {}, {
				orderId: orderid
			})
		}
		vm.maskShow = false;
		vm.popupShow = false;
	})
	mui('.mind').on('tap', '.photpgrapher-name', function() { //点击摄影师名字,进入查看心得页面
		var orderid = this.getAttribute('data-orderid');
		var photographerId = this.getAttribute('data-photographerId');
		lf.window.openWindow('summary/details.html', '../summary/details.html', {}, {
			orderId: orderid,
			photographerId: photographerId
		})
		vm.maskShow = false;
		vm.popupShow = false;
	})

	mui('.detail').on('tap', '.view-detail', function() { //查看详情，打开弹窗
		vm.maskShow = true;
		vm.orderdetailShow = true;
	})
	mui('.dialog-detail').on('tap', '.close', function() { //查看详情弹窗确定按钮，关闭弹窗
		vm.maskShow = false;
		vm.orderdetailShow = false;
	})
	mui('#topPopover').on('tap', '.cancle', function() { //取消订单
		lf.nativeUI.confirm("操作提示", "是否确认取消订单?", ["确认取消", "不取消"], function(e) {
			if(e.index == 0) {
				var params = {
					orderId: vm.currentOrderId,
					orderState: 3,
					orderNo: vm.currentOrderNo
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
	})
	/*mui('.topbar').on('tap', '.mod', function() { //点击顶部，跳转状态日志页面
		console.log('状态日志订单id，，，。'+vm.currentOrderId)
		lf.window.openWindow('order/statuslog.html','../order/statuslog.html',{},{
			orderid: vm.currentOrderId
		})
	})*/
	/*mui('.buttons').on('tap', '#allot', function() { //点击拍摄输出
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('operator/operator.html', '../operator/operator.html', {}, {
			orderNo: orderid
		})
	})*/

	/**
	 * 查看销售订单
	 */
	mui('.mui-card').on('tap', '#order-pay-list-btn', function() {
		if(!(vm.currentRoleId==9 && (vm.orderInfo.actionStatus==44||vm.orderInfo.actionStatus==33))) {
			return
		}
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('order-pay/order-pay-list.html', '../order-pay/order-pay-list.html', {}, {
			orderId: orderid,
			areaCode: vm.orderInfo.areaCode,
			tourGuide: vm.orderInfo.tourGuide,
			purchaser: vm.orderInfo.purchaser,
			aliasName: vm.orderInfo.aliasName,
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
		lf.nativeUI.confirm("操作提示", "是否已完成所有销售?", ["确定", "取消"], function(e) {
			if(e.index == 0) {
				saleFn()
			}
		});

		function saleFn() {
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
		}
	})
})

mui('body').on('tap', '.assignOrder', function() { //点击指派
	console.log("指派")
	if(vm.currentRoleId !== 4) {
		return
	} else {
		if(vm.currentOrderStatus != 3) {
			lf.window.openWindow('designate/designate.html ', '../designate/designate.html', {}, {
				orderId: vm.currentOrderId
			})
		}
	}

})
mui('body').on('tap', '.allotPhotoOrder', function() { //点击分配
	if(vm.currentRoleId !== 5) {
		return
	}
	console.log('分配' + vm.currentOrderNo)
	if(vm.currentOrderStatus != 3) {
		lf.window.openWindow('operator/operator.html', '../operator/operator.html', {}, {
			orderNo: vm.currentOrderNo,
			type: 2,
			status: 'edit'
		})
	}
})
mui('body').on('tap', '.jidiao', function() { //点击计调
	var type = this.getAttribute('data-type')
	if(type == 0) {
		if(!((vm.currentRoleId ==4||vm.currentRoleId==2) && vm.orderInfo.actionStatus!=55)) {
			return
		}
	}
	if(type == 1) {
		if(!((vm.currentRoleId ==4||vm.currentRoleId==2) && vm.orderInfo.actionStatus!=55)) {
			return
		}
	}
	if(type == 2) {
		if(!((vm.currentRoleId ==4||vm.currentRoleId==2||vm.currentRoleId==5) && vm.orderInfo.actionStatus!=55)) {
			return
		}
	}
	var status = this.getAttribute('data-status') == 1 ? 'check' : 'edit'
	console.log('orderNO............' + vm.currentOrderNo)
	console.log('type.........:' + type)
	console.log('status.........:' + status)
	if(vm.currentOrderStatus != 3) {
		lf.window.openWindow('operator/operator.html', '../operator/operator.html', {}, {
			orderNo: vm.currentOrderNo,
			type: type,
			status: status
		})
	}
})

mui('body').on('tap', '.summary', function() { //点击心得
	if(!(vm.currentRoleId==3&&(vm.orderInfo.actionStatus!=0&&vm.orderInfo.actionStatus!=11))) {
		return
	}
	var orderid = this.getAttribute('data-no');
	var tourId = this.getAttribute('data-tourId');
	console.log('点击心得摄影师' + vm.currentOrderId + ',' + vm.currentTourId + ',' + window.Role.usercode + ',' + window.Role.photograherId+','+vm.summaryFlag)
	console.log("是否已录入心得", vm.summaryFlag)
	if(vm.currentOrderStatus != 3) {
		if(!vm.summaryFlag){
			lf.window.openWindow('schedule/summary.html', '../schedule/summary.html', {}, {
				orderId: vm.currentOrderId,
				tourId: vm.currentTourId,
				userId: window.Role.usercode,
				photographerId: window.Role.photograherId
			})
		}
		else{
			lf.window.openWindow('schedule/details.html', '../schedule/details.html', {}, {
				orderId: vm.currentOrderId,
				tourId: vm.currentTourId,
				userId: window.Role.usercode,
				photographerId: window.Role.photograherId
			})
		}
		
	}
})
mui('.mind').on('tap', '.summary-item', function() { //点击拍摄信息第一个item跳心得
	var photographerId = this.getAttribute('data-photographerId');
	var userId = this.getAttribute('data-userId');
	console.log('id:1111111111111' + ',' + vm.currentOrderId + ',' + photographerId + ',' + userId)
	if(vm.currentOrderStatus != 3) {
		lf.window.openWindow('schedule/details.html', '../schedule/details.html', {}, {
			orderId: vm.currentOrderId,
			photographerId: photographerId,
			userId: userId
		})
	}
})

mui('body').on('tap', '.outOrder', function() { //点击填写输出信息
	if(!(((vm.currentRoleId==5||vm.currentRoleId==4)&&(vm.orderInfo.actionStatus==33||vm.orderInfo.actionStatus==44)) || (vm.currentRoleId==8 &&(vm.orderInfo.actionStatus==33||vm.orderInfo.actionStatus==44||vm.orderInfo.actionStatus==22)))) {
		return
	}
	var orderid = this.getAttribute('data-no');
	console.log('点击输出信息currentOrderId' + vm.currentOrderId)
	if(vm.currentOrderStatus != 3) {
		lf.window.openWindow('result/order-result.html', '../result/order-result.html', {}, {
			orderId: vm.currentOrderId,
		})
	}
})

mui('body').on('tap', '.saleOutOrder', function() { //点击销售输出
	if(!((vm.currentRoleId==9 && (vm.orderInfo.actionStatus==44||vm.orderInfo.actionStatus==33)) || (vm.currentRoleId==4 && vm.orderInfo.actionStatus==44))) {
		return
	}
	var orderid = this.getAttribute('data-id');
	console.log('点击销售输出' + vm.currentOrderId + '，' + window.Role.usercode)
	if(vm.currentOrderStatus != 3) {
		lf.window.openWindow('result/sales-export.html', '../result/sales-export.html', {}, {
			orderId: vm.currentOrderId,
			userId: window.Role.usercode,
		})
	}
})

mui('.buttons').on('tap', '.genSale', function() { //点击生成销售
	var orderid = this.getAttribute('data-no');
	console.log('id:' + orderid)
	if(vm.currentOrderStatus != 3) {
		lf.window.openWindow('order-pay/order-pay.html', '../order-pay/order-pay.html', {}, {
			orderId: orderid,
			areaCode: vm.orderInfo.areaCode,
			tourGuide: vm.orderInfo.tourGuide,
			purchaser: vm.orderInfo.purchaser,
			aliasName: vm.orderInfo.aliasName,
		})
	}
})

mui('body').on('tap', '.loadmore', function() { //摄影心得点击加载更多，每次加载三条
	var length = vm.photographerData.length; // 当前显示的条数
	var totalLength = vm.photographerInfos.length; // 接口返回的总条数
	vm.photographerData = []
	if(totalLength - length > 3) {
		for(var i = 0; i < length + 3; i++) {
			vm.photographerData.push(vm.photographerInfos[i])
		}
	} else {
		for(var i = 0; i < totalLength; i++) {
			vm.photographerData.push(vm.photographerInfos[i])
		}
	}
})

lf.event.listener('orderdetails', function(e) {
	renderOrderDetails();
	lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
})

function renderOrderDetails() {
	var orderId = lf.window.currentWebview().orderNo;
	var params = {
		orderId: orderId
	};
	lf.net.getJSON('order/orderDetail', params, function(data) {
		if(data.code == 200) {
			vm.orderInfo = data.data.orderInfo;
			vm.tourGuidePhoneList = vm.orderInfo.tourGuidePhone.split(',')
			vm.orderTrackInfo = data.data.orderTrackInfo;
			vm.photographerInfos = data.data.photographerInfos;
			var totalLength = vm.photographerInfos.length > 3 ? 3 : vm.photographerInfos.length
			for(i = 0; i < totalLength; i++) {
				vm.photographerData.push(vm.photographerInfos[i])
			}
			vm.shotOrderOutput = data.data.shotOrderOutput;
			var time = new Date() - new Date(vm.orderInfo.createTime);
			var total = time / 1000;
			var day = parseInt(total / (24 * 60 * 60)); //计算整数天数
			var afterDay = total - day * 24 * 60 * 60; //取得算出天数后剩余的秒数
			var hour = parseInt(afterDay / (60 * 60)); //计算整数小时数
			var afterHour = total - day * 24 * 60 * 60 - hour * 60 * 60; //取得算出小时数后剩余的秒数
			var min = parseInt(afterHour / 60); //计算整数分
			var afterMin = total - day * 24 * 60 * 60 - hour * 60 * 60 - min * 60; //取得算出分后剩余的秒数
			vm.timeConsume = '  ' + day + '天' + hour + '小时' + min + '分';
			vm.orderTrackInfo.groupRoute = outLineBreak(vm.orderTrackInfo.groupRoute);
			vm.orderInfo.createTime = lf.util.timeStampToDate(vm.orderInfo.createTime)
			if(data.data.orderTrackInfo.fetchPhotoTime) {
				vm.orderTrackInfo.fetchPhotoTime = lf.util.timeStampToDate2(vm.orderTrackInfo.fetchPhotoTime)
			} else {
				vm.orderTrackInfo.fetchPhotoTime = ''
			}
			vm.shotOrderOutput.forEach(function(v, i) {
				vm.orderTrackInfo.lineSight[i].photographer = v.photographerNames
				vm.temp.push(v.photographerNames)
			})

			for(var i = 0; i < vm.temp.length; i++) {
				if(vm.assignedPhotographers.indexOf(vm.temp[i]) == -1) {
					vm.assignedPhotographers.push(vm.temp[i])
				}
			}
			vm.assignedPhotographersString = vm.assignedPhotographers.toString()

			vm.orderTrackInfo.lineSight.forEach(function(v, i) { // 拍摄信息数据
				v.index = i + 1
				v.shootTime = lf.util.timeStampToDate2(v.shootTime)
			})

			if(data.data.orderResult) {
				vm.orderResult = data.data.orderResult;
				if(vm.orderResult.buyers == 0) {
					vm.unitPrice = 0
				} else {
					// 客单价 = 销售总额/购买人数 (前端计算)
					vm.unitPrice = (vm.orderResult.salesAmt / vm.orderResult.buyers).toFixed(2)
				}
				if(vm.orderResult.printsNum == 0) {
					vm.photoPecent = 0
				} else {
					// 照片转化率 = 销售总数/打印张数 (前端计算)
					vm.photoPecent = ((vm.orderResult.salesNum / vm.orderResult.printsNum) * 100).toFixed(2)
				}
				if(vm.orderTrackInfo.personCount == 0) {
					vm.userPecent = 0
				} else {
					// 用户转化率  = 购买人数/团人数 (前端计算)
					vm.userPecent = ((vm.orderResult.buyers / vm.orderTrackInfo.personCount) * 100).toFixed(2)
				}
				if(vm.orderResult.orderXms) {
					vm.orderResult.orderXms.forEach(function(v, i) {
						v.total = lf.util.multNum(v.picNum, v.price).toFixed(2)
					})
				}
				if(data.data.orderResult.saleDate) {
					vm.orderResult.saleDate = lf.util.timeStampToDate2(data.data.orderResult.saleDate)
				} else {
					vm.orderResult.saleDate = ''
				}

			}
			console.log("orderInfo" + JSON.stringify(data.data.orderInfo.orderId))
			vm.orderInfo.totalPrice = (vm.orderInfo.totalPrice / 100).toFixed(2);
			vm.currentOrderId = data.data.orderInfo.orderId; //记录当前订单id
			console.log("-------------" + vm.currentOrderId)
			vm.currentTourId = data.data.orderInfo.tourId; //记录tourId
			vm.currentOrderStatus = data.data.orderInfo.status; //记录订单状态
			vm.currentOrderNo = data.data.orderInfo.orderNo; //记录订单No
			vm.photographerExperienceFlage = data.data.photographerExperienceFlage;
			if(data.data.orderResult) {
				if(data.data.orderResult.isOut) {
					vm.outPutStatus = data.data.orderResult.isOut;
				}
			}
			vm.actionStatus = data.data.orderInfo.actionStatus; //订单执行状态
			if(data.data.shotOrderOutput) {
				vm.shotOrderOutput = data.data.shotOrderOutput
			}
		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	});

}

function outLineBreak(str) {
	return(str || '').replace(/\n/g, '<br>')
}