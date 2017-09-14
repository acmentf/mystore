var vm = new Vue({
    el: '#app',
    data: {
        orderInfo: {},
        orderResult: {},
        orderTrackInfo: {},
        totalPrice: '',
        actionStatus: '',
        city: '',
        province: ''
    }
})
lf.ready(function() {
    vm.actionStatus = lf.window.currentWebview().actionStatus
    vm.city = lf.window.currentWebview().city
    vm.province = lf.window.currentWebview().province
    console.log(vm.city)
    renderOrderDetails();
    // 销售明细
    mui('body').on('tap', '.sale-detail', function() {
        lf.window.openWindow('/sale-detail/saledetail.html ', '../sale-detail/saledetail.html', {}, {
            orderId: vm.orderInfo.orderId
        })
    })
    // 修改信息
    mui('body').on('tap', '.modifyBtn', function(){
        lf.window.openWindow('result/sales-export.html', '../result/sales-export.html', {}, {
			orderId: vm.orderInfo.orderId,
			userId: window.Role.usercode,
		})
    })
    mui('body').on('tap', '.genSale', function() { //点击生成销售
        console.log(111)
        var orderId = vm.orderInfo.orderId;
        var areaCode = vm.orderInfo.areaCode;
        var tourGuide = vm.orderInfo.tourGuide;
        var purchaser = vm.orderInfo.purchaser;
        var aliasName = vm.orderInfo.aliasName;
        var province = vm.province;
        var city = vm.city;
        lf.window.openWindow('orderPay', '../order-pay/order-pay.html', {}, {
            orderId: orderId,
            areaCode: areaCode,
            tourGuide: tourGuide,
            purchaser: purchaser,
            aliasName: aliasName,
            province: province,
            city: city
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