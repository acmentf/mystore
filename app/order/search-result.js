var vm = new Vue({
	el: '#app',
	data: {
		searchText: lf.window.currentWebview().searchText,
		status: lf.window.currentWebview().status,
		orderTimeBegin: lf.window.currentWebview().orderTimeBegin,
		orderTimeEnd: lf.window.currentWebview().orderTimeEnd,
		startBeginTime: lf.window.currentWebview().startBeginTime,
		startEndTime: lf.window.currentWebview().startEndTime,
		currPage: lf.window.currentWebview().currPage,
		pageSize: lf.window.currentWebview().pageSize,
		actionStatus: lf.window.currentWebview().actionStatus,
		orderList: [],
		isEmpty: false,

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
	vm.photograherId = window.Role.photograherId
	vm.assignOrder=window.Role.hasAuth('assignOrder'), //计调、指派 
	vm.allotPhotoOrder=window.Role.hasAuth('allotPhotoOrder'), // 分配
	vm.outOrder=window.Role.hasAuth('outOrder'), // 填写输出信息
	vm.saleOutOrder=window.Role.hasAuth('saleOutOrder'), // 销售输出
	vm.genSale=window.Role.hasAuth('genSale'), // 生成销售
	vm.summary=window.Role.hasAuth('summary'), // 录入心得
	vm.currentRole = window.Role.userrole;

	vm.currentRoleId = window.Role.currentPositions[0].roleId;
	
	vm.cancelRole = window.Role.hasAuth('cancel') // 取消按钮的key
	vm.operatorRole = window.Role.hasAuth('handle') // 计调key
	vm.allotRole = window.Role.hasAuth('allotPhoto') // 分配按钮的key
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
			actionStatus: vm.actionStatus
		}

		console.log(JSON.stringify(params))

		lf.net.getJSON('/order/search', params, function (data) {
			
			console.log(JSON.stringify(data))

			if (data.code == "200") {
				
				if (data.data.result.length > 0) {
					data.data.result.forEach(function(item) {
						item.startTime = lf.util.timeStampToDate2(item.startTime)
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
		console.log('gotoorderdetails')
		var id = this.getAttribute('data-id');
		lf.window.openWindow('orderdetails.html', 'orderdetails.html', {}, {
			orderNo: id,
			index: 1,
			photographerId: window.Role.photograherId
		})
	})
})