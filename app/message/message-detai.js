var vm = new Vue({
	el:"#app",
	data: {
		orderId:'',
		id: '',
		descption: '',
		orderMessage:null
	}
})
lf.ready(function(){
	var wv = lf.window.currentWebview()
	vm.orderId = wv.orderId
	vm.id = wv.Id
	vm.descption = wv.descption
	console.log(JSON.stringify(window.Role))
	getOrder()
	updeteStatu()
})
function getOrder(){
	var params = {
		orderId: vm.orderId
	}
	lf.net.getJSON('order/orderDetail',params, function(res){
		if(res.code == 200){		
			vm.orderMessage = res.data
			console.log(JSON.stringify(vm.orderMessage))
			vm.orderMessage.orderTrackInfo.startTime = lf.util.timeStampToDate2(vm.orderMessage.orderTrackInfo.startTime)
		}
	})
	
}
function updeteStatu(){
	var params = {
		id: vm.id,
		status: 1
	}
	lf.net.getJSON('information/updateStatus', params, function(res){
		if(res.code == 200){
			console.log('成功')
		}
	})
}
