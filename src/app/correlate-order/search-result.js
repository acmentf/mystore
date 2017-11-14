var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		status: '',
		orderTimeBegin: '',
		orderTimeEnd: '',
		orderTime: '',
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
	var query = Utils.getPageParams("search");
	
	vm.searchText = query.searchText
	vm.status = query.status
	vm.startTime  = query.startTime 
	vm.endTime  = query.endTime 
	vm.orderTimeEnd = query.orderTimeEnd
	vm.startBeginTime = query.startBeginTime
	vm.startEndTime = query.startEndTime
	vm.currPage = query.currPage
	vm.pageSize = query.pageSize
	vm.actionStatus = query.actionStatus

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
			startTime: vm.startTime,
			endTime: vm.endTime,
			curPage: vm.currPage,
			pageSize: vm.pageSize
		}

		console.log(JSON.stringify(params))

		lf.net.getJSON('/pay/getSaleOrdersList1', params, function (res) {
			
			console.log(JSON.stringify(res))

			if (res.code == "200") {
				if(res.data.length>0){
					self.endPullupToRefresh(false)
				} else {
					self.endPullupToRefresh(true)
				}
				res.data.forEach(function(v, i) {
					v.startTime = lf.util.timeStampToDate2(v.startTime)
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
				vm.orderList = vm.orderList.concat(res.data)
				console.log(JSON.stringify(vm.orderList))
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
mui(".order-ul").on('tap', ".guideinfo a", function(){
	var tel = this.getAttribute('data-tel')
	window.location.href= "tel:"+tel
})
function dodata(type, index, data) {
	if(type == 'up') {
		Vue.set(vm.orderList, index, vm.orderList[index].concat(data))
	} else {
		Vue.set(vm.orderList, index, data)
	}
}
})