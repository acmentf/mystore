var vm = new Vue({
    el: '#app',
    data: {
        orderInfo: {},
        orderResult: {},
        orderTrackInfo: {},
        totalPrice: ''
    }
})
lf.ready(function() {
    renderOrderDetails();
    // 销售明细
    mui('body').on('tap', '.sale-detail', function() {
        lf.window.openWindow('/sale-detail/saledetail.html ', '../sale-detail/saledetail.html', {}, {
            orderId: vm.orderInfo.orderId
        })
    })
    // 修改信息
    mui('body').on('tap', '.modifyBtn', function(){
        console.log(111)
        lf.window.openWindow('result/sales-export.html', '../result/sales-export.html', {}, {
			orderId: vm.orderInfo.orderId,
			userId: window.Role.usercode,
		})
    })
    lf.event.listener('orderdetails', function(e) {
        renderOrderDetails();
        lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
    })

    lf.event.listener('orderPay', function(e) {
        renderOrderDetails();
        lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
    })
    function add0(m) {
        return m < 10 ? '0' + m : m
    }
    function renderOrderDetails() {
        var orderId = lf.window.currentWebview().orderNo;
        var params = {
            orderId: orderId
        };
        lf.net.getJSON('order/orderDetail', params, function(data) {
            console.log(11)
            if (data.code == 200) {
                console.log(JSON.stringify(data.data));
                vm.orderInfo = data.data.orderInfo
                vm.orderResult = data.data.orderResult
                vm.orderTrackInfo = data.data.orderTrackInfo
                var time = new Date(vm.orderResult.saleDate);
                var year = time.getFullYear();
                var month = time.getMonth() + 1;
                var date = time.getDate();
                var hours = time.getHours();
                var minutes = time.getMinutes();
                var seconds = time.getSeconds();
                vm.orderResult.saleDate = year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
                vm.totalPrice = (parseFloat(vm.orderResult.advanceAmount) || 0) + (parseFloat(vm.orderResult.payableAmount) || 0) + (parseFloat(vm.orderResult.salesAmt) || 0)
            } else {
                lf.nativeUI.toast(data.msg);
            }
        }, function(erro) {
            lf.nativeUI.toast(erro.msg);
        });

    }

    function outLineBreak(str) {
        return (str || '').replace(/\n/g, '<br>')
    }
})