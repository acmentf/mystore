var vm = new Vue({
    el: '#app',
    data: {
        orderList:[],
        totalSaleAmount: '0',
        totalSalePersonnelNum: '0',
        totalSaleNum: '0',
        curPage: 1
    }
})
lf.ready(function() {
    initPull();
})
function initPull() {
	mui.ready(function() {
        mui(".content").pullToRefresh({
            up : {
                auto:true,
                callback: function(){
                    var orderId = lf.window.currentWebview().orderId;
                    var params = {
                        orderId: orderId,
                        curPage: vm.curPage
                    };
                    console.log(orderId)
                    var _this = this;
                    lf.net.getJSON('pay/getOrderList', params, function(res) {
                        console.log(JSON.stringify(res))
                        if (res.code == 200) {
                            if (res.data.length>0) {
                                vm.orderList = vm.orderList.concat(res.data)
                                vm.totalSaleAmount = res.data[0].totalSaleAmount || '0'
                                vm.totalSalePersonnelNum = res.data[0].totalSalePersonnelNum || '0'
                                vm.totalSaleNum = res.data[0].totalSaleNum || '0'
                                vm.curPage = vm.curPage + 1
                                _this.endPullUpToRefresh(false)
                            } else {
                                _this.endPullUpToRefresh(true)
                            }
                        } else {
                            lf.nativeUI.toast(data.msg);
                        }
                    })
                }
              }
        });
	});
}