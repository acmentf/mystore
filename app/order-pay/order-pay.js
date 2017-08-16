/*
 * Description: 订单支付
 * Author: nishu
 * Email: nishu@foxmail.com
 */

 lf.ready(function() {
    var data = {
        orderId: lf.window.currentWebview().orderId,
        areaCode: lf.window.currentWebview().areaCode,
        payId: lf.window.currentWebview().payId,
        guideName: lf.window.currentWebview().tourGuide,
        purchaser: lf.window.currentWebview().purchaser,
        alias: lf.window.currentWebview().aliasName,
        orderStatus: '',
        orderNo: '',
        channelName: '',
        orderTime: '',
        channelCode: '',
        nums: '',
        amount: '',
        remark: '',
        argDictId: '',
        argDictName: '',
        sizeOptions: {
            1: '16寸',
            2: '12寸',
            3: '10寸',
            4: '8寸',
            5: '6寸'
        },

        isPaying: false,
        payType: 0,
        payName: '',
        loopTime: 2000,
        loopOrderId: '',
        timer: null
    }

    var vm = new Vue({
        el: '#app',
        data: data,
        mounted: function() {
            if (!this.payId) return

            var params = {
                id: this.payId
            }

            lf.nativeUI.showWaiting();
    
            lf.net.getJSON('pay/getOrderDetail', params, function(data) {
                console.log(JSON.stringify(data));

                if(data.code == 200) {
                    lf.nativeUI.closeWaiting();
    
                    vm.orderNo = data.data.orderNo
                    vm.nums = data.data.nums
                    vm.amount = data.data.totalAmount
                    vm.orderStatus = data.data.status
                    vm.orderTime = data.data.orderTime
                    vm.remark = data.data.remark
                    vm.argDictName = data.data.argDictName
                    vm.argDictId = data.data.argDictId


                    vm.channelName = data.data.channelName
    
                } else {
                    lf.nativeUI.closeWaiting();
                    lf.nativeUI.toast(data.msg);
                }
    
            }, function(erro) {
                lf.nativeUI.closeWaiting();
                lf.nativeUI.toast(erro.msg);
            })
        },
        methods: {
            payStatus: function(status) {
                switch (status) {
                    case 1:
                        return "待支付"
                    case 2:
                        return "已支付"
                    case 3:
                        return "已取消"
                    case 4:
                        return "支付失败"
                }
            },

            payStatusClass: function(status) {
                switch (status) {
                    case 2:
                        return "pay-status-paid"
                    case 1:
                    case 3:
                    case 4:
                        return "pay-status-paying"
                }
            },

            handlePay: function(payType) {
                if (!vm.nums){
                    lf.nativeUI.toast('请输入数量')
                    return
                }
                
                if (!vm.amount){
                    lf.nativeUI.toast('请输入金额')
                    return
                }

                if (vm.amount < 0.01){
                    lf.nativeUI.toast('金额不能小于0.01')
                    return
                }
                
                if (!vm.remark){
                    lf.nativeUI.toast('请选择销售类型')
                    return
                }
                
                if (!vm.argDictId){
                    lf.nativeUI.toast('请选择尺寸')
                    return
                }

                this.payType = payType
                this.payName = this.getPayName(this.payType)

                if (payType == 0) {
                    cashPay()
                } else {
                    this.isPaying = true
                    payment()
                }
            },

            getPayName: function(type) {
                switch (type) {
                    case 0:
                        this.channelCode = 'cash'
                        return '现金支付'
                    case 1:
                        this.channelCode = 'wechat'
                        return '微信支付'
                    case 2:
                        this.channelCode = 'alipay'
                        return '支付宝'
                }
            },

            formatterTime: function(time) {
                return lf.util.timeStampToDate(time)
            },
        }
    })

    function cashPay() {
        lf.nativeUI.confirm("现金支付", vm.amount + "元", ["确定", "取消"], function(e) {
            if(e.index == 0) {
                payment()
            }
        });
    }

    // 发起支付请求
    function payment() {
        var params = {
            orderId: vm.orderId,
            areaCode: vm.areaCode,
            channelCode: vm.channelCode,
            nums: vm.nums,
            amount: vm.amount,
            remark: vm.remark,
            argDictId: vm.argDictId,
            argDictName: vm.sizeOptions[vm.argDictId],
            guideName: vm.guideName,
            purchaser: vm.purchaser,
            alias: vm.alias
        }

        console.log(JSON.stringify(params));

        lf.nativeUI.showWaiting();

        lf.net.getJSON('pay/payment', params, function(data) {
            console.log(JSON.stringify(data));

            if(data.code == 200) {
                lf.nativeUI.closeWaiting();

                vm.loopOrderId = data.data.saleOrderId

                dispatchEvent()

                // 轮询支付状态
                vm.timer = setInterval(loopCheckPayStatus, vm.loopTime)

                generateQrcode(data.data.resultUrl)

            } else {
                lf.nativeUI.closeWaiting();
                lf.nativeUI.toast(data.msg);
            }

        }, function(erro) {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(erro.msg);
        })
    }

    // 生成二维码
    function generateQrcode(url) {
        new QRCode(document.getElementById("qrcode-img"), {
            text: url,
            width: 200,
            height: 200,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
        })
    }

    // 轮询方法
    function loopCheckPayStatus() {
        var params = {
            id: vm.loopOrderId
        }

        lf.net.getJSON('pay/getOrderDetail', params, function(data) {
            if(data.code == 200) {

                console.log('looping');
                console.log(JSON.stringify(data.data));

                if (data.data.status != 1) {
                    vm.isPaying = false

                    // 移除轮询
                    clearInterval(vm.timer)
                    payCallback(data.data.status)
                }
            }
        })
    }

    // 支付回调
    function payCallback(data) {
        if (data == 2) {
            lf.nativeUI.toast("支付成功");
        } else if (data == 3) {
            lf.nativeUI.toast("支付已取消");
        } else if (data == 4) {
            lf.nativeUI.toast("支付失败");
        }
        
        dispatchEvent()
        lf.window.closeCurrentWebview();
    }

    function dispatchEvent() {
        lf.event.fire(lf.window.currentWebview().opener(), 'orderPay', {})
    }
})