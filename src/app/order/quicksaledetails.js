var vm = new Vue({
    el: '#app',
    data: {
        orderInfo: {},
        orderResult: {
            saleDate: '',
            salesOrderXms: [],
            giveOrderXms: [],
            buyers: '',
            advanceAmount: '',
            payableAmount: '',
            salesAmt: ''
        },
        orderTrackInfo: {},
        totalPrice: '',
        actionStatus: '',
        city: '',
        province: '',
        isDisable:true  //禁止按钮
    },
    created:function(){
        this.initConfirmBtn();
   },
   methods:{
       // 初始化服務完成點擊按鈕
       initConfirmBtn:function(){  
           // console.log(this.actionStatus)         
           var serveStatus=lf.window.currentWebview().actionStatus
           // console.log(serveStatus)
           if(serveStatus=='44'){
               vm.isDisable=!vm.isDisable;
           }           
       }
   }
})
lf.ready(function() {
    vm.actionStatus = lf.window.currentWebview().actionStatus
    vm.city = lf.window.currentWebview().city
    vm.province = lf.window.currentWebview().province
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
        var orderId = vm.orderInfo.orderId;
        var tourNo = vm.orderInfo.tourNo;
        var productName = vm.orderInfo.productName;
        var tourGuidePhone = vm.orderInfo.tourGuidePhone;
        var areaCode = vm.orderInfo.areaCode;
        var tourGuide = vm.orderInfo.tourGuide;
        var purchaser = vm.orderInfo.purchaser;
        var aliasName = vm.orderInfo.aliasName;
        var province = vm.province;
        var city = vm.city;
        lf.window.openWindow('orderPay', '../order-pay/order-pay.html', {}, {
            orderId: orderId,
            tourNo: tourNo,
            productName: productName,
            tourGuidePhone: tourGuidePhone,
            areaCode: areaCode,
            tourGuide: tourGuide,
            purchaser: purchaser,
            aliasName: aliasName,
            province: province,
            city: city
        })
    })
    /**
	 * 查看销售订单
	 */
    mui('body').on('tap', '#order-pay-list-btn', function () {
		// console.log(JSON.stringify(vm.orderInfo));
		var orderid = this.getAttribute('data-orderid');
		lf.window.openWindow('order-pay/order-pay-list.html', '../order-pay/order-pay-list.html', {}, {
			orderId: orderid,
			areaCode: vm.orderInfo.areaCode,
			tourGuide: vm.orderInfo.tourGuide,
			purchaser: vm.orderInfo.purchaser,
			aliasName: vm.orderInfo.aliasName,
			province: vm.orderInfo.province,
            city: vm.orderInfo.city,
            tourNo: vm.orderInfo.tourNo,
            tourGuidePhone: vm.orderInfo.tourGuidePhone,
            productName: vm.orderInfo.productName
		})
	})
    mui('body').on('tap', '.finish', function() {
        lf.nativeUI.confirm("操作提示", "确认服务已完成?", ["确定", "取消"], function (e) {
			if (e.index == 0) {
				saleFn()
			}
		});

		function saleFn() {
			var params = {
				orderId: vm.orderInfo.orderId,
                orderState: 2,
                orderNo: vm.orderInfo.orderNo
			};
			lf.nativeUI.showWaiting();
			lf.net.getJSON('order/updateOrderState', params, function (data) {
                lf.nativeUI.closeWaiting();
				if (data.code == 200) {
					lf.nativeUI.toast("服务已完成！");
                    // lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
                    vm.isDisable=!vm.isDisable;
                    // console.log(vm.actionStatus)          
                    mui.back();
				} else {
					lf.nativeUI.toast(data.msg);
				}
			}, function (erro) {
				lf.nativeUI.toast(erro.msg);
			});
		}
    })
    lf.event.listener('orderdetails', function(e) {
        console.log(e)
        if(e.detail.serveStatus=='44'){
            vm.isDisable=!vm.isDisable;
        }
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
        var orderId = lf.window.currentWebview().orderId;
        console.log(orderId)
        var params = {
            orderId: orderId
        };
        lf.net.getJSON('order/orderDetail', params, function(data) {
            if (data.code == 200) {
                console.log(JSON.stringify(data.data));
                vm.orderInfo = data.data.orderInfo
                vm.orderTrackInfo = data.data.orderTrackInfo
                if(data.data.orderResult){
                    vm.orderResult = data.data.orderResult
                    if(vm.orderResult.saleDate){
                        var time = new Date(vm.orderResult.saleDate);
                        var year = time.getFullYear();
                        var month = time.getMonth() + 1;
                        var date = time.getDate();
                        var hours = time.getHours();
                        var minutes = time.getMinutes();
                        var seconds = time.getSeconds();
                        vm.orderResult.saleDate = year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes) + ':' + add0(seconds);
                    }
                    vm.totalPrice = (parseFloat(vm.orderResult.advanceAmount) || 0) + (parseFloat(vm.orderResult.payableAmount) || 0) + (parseFloat(vm.orderResult.salesAmt) || 0)
                }
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