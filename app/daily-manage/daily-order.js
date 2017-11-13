var vm = new Vue({
    el: '#app',
    data: {
        orderInfo: {}
    }
});

lf.ready(function() {
    lf.nativeUI.showWaiting();
    var params = {
		orderId: Utils.getPageParams('daily-order').orderId
	};
	lf.net.getJSON('order/purchaserOrderDetail', params, function(res){
		lf.nativeUI.closeWaiting();
		if(res.code == 200){
            console.log("response data", JSON.stringify(res.data));
			vm.orderInfo = res.data;
		}
	}, function(err) {
		lf.nativeUI.closeWaiting();
		lf.nativeUI.toast(err.msg);
	});
});