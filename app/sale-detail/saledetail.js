var vm = new Vue({
    el: '#app',
    data: {
        orderList:[],
        totalSaleAmount: '0',
        totalSalePersonnelNum: '0',
        totalSaleNum: '0'
    }
})
lf.ready(function() {
    var orderId = lf.window.currentWebview().orderId;
    var params = {
        orderId: orderId
    };
    console.log(orderId)
    lf.net.getJSON('pay/getOrderList', params, function(res) {
        console.log(JSON.stringify(res))
        if (res.code == 200) {
            if (res.data.length>0) {
                vm.orderList = res.data
                vm.totalSaleAmount = res.data[0].totalSaleAmount || '0'
                vm.totalSalePersonnelNum = res.data[0].totalSalePersonnelNum || '0'
                vm.totalSaleNum = res.data[0].totalSaleNum || '0'
            }
        } else {
            lf.nativeUI.toast(data.msg);
        }
    })
})