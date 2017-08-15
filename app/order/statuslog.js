var vm = new Vue({
	el: '#app',
	data: {
		currentOrderId: '',
		statusData0: [],
		statusData1: [],
		statusData2: [],
		statusData3: [],
		statusData4: [],
		statusData0Show: false,
		statusData1Show: false,
		statusData2Show: false,
		statusData3Show: false,
		statusData4Show: false,

	}
})

lf.ready(function() {
	vm.currentOrderId = lf.window.currentWebview().orderid
	console.log("接收到的id........." + vm.currentOrderId)
	getStatusLogList()

})

function getStatusLogList() {

	var params = {
		orderId: vm.currentOrderId,
	};
	lf.net.getJSON('order/queryOrderLogs', params, function(data) {
		if(data.code == 200) {
			if(data.data != '') {
				console.log("这也能跳进来？")
				vm.statusData0 = data.data.s0
				vm.statusData1 = data.data.s1
				vm.statusData2 = data.data.s2
				vm.statusData3 = data.data.s3
				vm.statusData4 = data.data.s4
				if(vm.statusData0) {
					if(vm.statusData0.length > 0) {
						vm.statusData0Show = true
						vm.statusData0.forEach(function(v, i) {
							v.createTime = lf.util.timeStampToDate(v.createTime)
						})
					}
				}
				if(vm.statusData1) {
					if(vm.statusData1.length > 0) {
						vm.statusData1Show = true
						vm.statusData1.forEach(function(v, i) {
							v.createTime = lf.util.timeStampToDate(v.createTime)
						})
					}
				}
				if(vm.statusData2) {
					if(vm.statusData2.length > 0) {
						vm.statusData2Show = true
						vm.statusData2.forEach(function(v, i) {
							v.createTime = lf.util.timeStampToDate(v.createTime)
						})
					}
				}
				if(vm.statusData3) {
					if(vm.statusData3.length > 0) {
						vm.statusData3Show = true
						vm.statusData3.forEach(function(v, i) {
							v.createTime = lf.util.timeStampToDate(v.createTime)
						})
					}
				}
				if(vm.statusData4) {
					if(vm.statusData4.length > 0) {
						vm.statusData4Show = true
						vm.statusData4.forEach(function(v, i) {
							v.createTime = lf.util.timeStampToDate(v.createTime)
						})
					}
				}

			}

		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	});
}