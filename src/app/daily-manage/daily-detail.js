var vm = new Vue({
    el: '#app',
    data: {
        groupList: []   // 数据列表
    },
    methods: {
        showOrder: function(orderId){
            lf.window.openWindow('daily-order', "daily-order.html", {}, {
                orderId: orderId
            });
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
    var stamp  = lf.window.currentWebview().todayDate,
        params = { saleDate: lf.util.timeStampToDate2(stamp) };

	lf.net.getJSON('plan/queryPurchaserOrderList', params, function(data) {
        console.log('response data:', data);
        lf.nativeUI.closeWaiting();
		if(data.code == 200) {
            var sortArr = [];
            data.data.forEach(function(item, id){
                var index;
                data.data[id].createTime = lf.util.timeStampToDate2(item.createTime);
                sortArr.forEach(function(el, i){
                    if( el.purchaser == item.purchaser ){
                        return index = i;
                    }
                });

                if( index ){
                    sortArr[index].orderList.push(item);
                } else {
                    sortArr.push({
                        purchaser: item.purchaser,
                        orderList: [].concat(item)
                    });
                }
            });

            vm.groupList = sortArr;
        } else {
            lf.nativeUI.closeWaiting();
			lf.nativeUI.toast(data.msg);
        }
    }, function(erro) {
		lf.nativeUI.closeWaiting();
		lf.nativeUI.toast(erro.msg);
	})
}