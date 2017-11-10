var vm = new Vue({
    el: '#app',
    data: {
        groupList: []   // 数据列表
    },
    methods: {
        showOrder: function(orderid){
            console.log( orderid );
            lf.window.openWindow('daily-order', "daily-order.html", {}, {});
        }
    }
});

lf.ready(function() {
    init();
    lf.event.listener('daily-detail', function(e) {
        lf.event.fire(lf.window.currentWebview().opener(), 'daily-detail', {});
        lf.window.closeCurrentWebview();
    });
});

function init(){
    lf.nativeUI.showWaiting();
	lf.net.getJSON('plan/queryPurchaserOrderList', {
        saleDate: lf.window.currentWebview().todayDate
    }, function(data) {
        console.log('response data:', data);
        lf.nativeUI.closeWaiting();
		if(data.code == 200) {
            vm.groupList = data.data;
        } else {
            lf.nativeUI.closeWaiting();
			lf.nativeUI.toast(data.msg);
        }
    }, function(erro) {
		lf.nativeUI.closeWaiting();
		lf.nativeUI.toast(erro.msg);
	})
}