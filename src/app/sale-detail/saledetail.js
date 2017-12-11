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
        mui("#scroll-wrap").pullToRefresh({
            up : {
                contentrefresh : vm.$t('loading') + "...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: vm.$t('no_more_data'),//可选，请求完毕若没有更多数据时显示的提醒内容；
                auto:true,
                callback: function(){
                    var orderId = lf.window.currentWebview().orderId;
                    var params = {
                        orderId: orderId,
                        status: 2,
                        curPage: vm.curPage
                    };
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