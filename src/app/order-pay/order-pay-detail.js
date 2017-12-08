/*
 * Description: 订单支付
 * Author: nishu
 * Email: nishu@foxmail.com
 */

 lf.ready(function() {
    var data = {
        orderId: lf.window.currentWebview().orderId,
        productName: lf.window.currentWebview().productName,
        areaCode: lf.window.currentWebview().areaCode,
        saleOrderId: lf.window.currentWebview().saleOrderId,
        guideName: lf.window.currentWebview().tourGuide,
        tourGuidePhone: lf.window.currentWebview().tourGuidePhone,
        purchaser: lf.window.currentWebview().purchaser,
        alias: lf.window.currentWebview().aliasName,
        province: lf.window.currentWebview().province,
        city: lf.window.currentWebview().city,
        orderStatus: '',
        orderNo: '',
        pOrderNo: '',
        channelName: '',
        orderTime: '',
        orderSaleDate: '',
        guidePhone: '',
        channelCode: '',
        salePersonnelNum: '',
        givesNum: '',
        nums: '',
        salesNums: '',
        amount: '',
        remark: '相片',
        argDictId: 6,
        argDictName: '',
        sizeOptions: {
            1: '16寸',
            2: '12寸',
            3: '10寸',
            4: '8寸',
            6: '7寸',
            5: '6寸',
        },
        id: '',
        verificationStatus: '',

        isPaying: false,
        payType: 0,
        payTypeUrl: '../../assets/css/images/sell_cash.png',
        payName: '',
        loopTime: 1000,
        loopOrderId: '',
        timer: null,
        price:'',
        isPrice:false,
        salesOrderTxList: []
    }

    var vm = new Vue({
        el: '#app',
        data: data,
        mounted: function() {
            document.getElementById("pay-dialog").classList.remove("hide");
            document.getElementById("pay-mask").classList.remove("hide");

            if (!this.saleOrderId) return

            var params = {
                id: this.saleOrderId
            }

            lf.nativeUI.showWaiting();

            lf.net.getJSON('/pay/getOrderDetail', params, function(data) {
                console.log(JSON.stringify(data));

                if(data.code == 200) {
                    lf.nativeUI.closeWaiting();
                    
                    vm.id = data.data.id
                    vm.orderNo = data.data.orderNo
                    vm.pOrderNo = data.data.pOrderNo
                    vm.nums = data.data.nums
                    vm.salesNums = data.data.salesNums
                    vm.amount = data.data.totalAmount
                    vm.orderStatus = data.data.status

                    vm.orderTime = data.data.orderTime && lf.util.timeStampToDate(data.data.orderTime)
                    vm.orderSaleDate = data.data.orderSaleDate && lf.util.timeStampToDate2(data.data.orderSaleDate)

                    vm.remark = data.data.remark
                    vm.argDictName = data.data.argDictName
                    vm.argDictId = data.data.argDictId
                    vm.channelName = data.data.channelName
                    vm.salePersonnelNum = data.data.salePersonnelNum
                    vm.verificationStatus = data.data.verificationStatus
                    vm.givesNum = data.data.givesNum
                    vm.province = vm.province || data.data.province
                    vm.city = vm.city || data.data.city
                    vm.guidePhone = data.data.guidePhone
                    vm.guideName = data.data.guideName
                    vm.productName = data.data.productName
                    vm.salesOrderTxList = data.data.salesOrderTxList
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
            showPriceDialog: function() {
                vm.isPrice = true
                vm.price = ''
            },
            offBtn: function() {
                vm.isPrice = false
            },
            sureBtn: function() {
                if(vm.price>0){
                    vm.amount = vm.price
                }
                vm.isPrice = false
            },
            hideDialog: function() {
                vm.isPaying = false
                clearInterval(vm.timer)
            },
            edit: function() {
                // mui.back();
                lf.window.openWindow('../correlate-order/editSaleOrder.html','../correlate-order/editSaleOrder.html',{},{
                    orderId: vm.orderId,
                    productName: vm.productName,
                    tourNo: vm.tourNo,
                    saleTime: vm.orderSaleDate,
                    amount: vm.amount,
                    channelName: vm.channelName,
                    saleOrderId: vm.saleOrderId,
                    tourGuide: vm.guideName,
                    interSource: 1
                })
            },
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
                // if (!vm.nums){
                //     lf.nativeUI.toast('请输入数量')
                //     return
                // }

                // var reg = /^[1-9]\d*$/
                // if (!reg.test(vm.nums)){
                //     lf.nativeUI.toast('销售数量不合法')
                //     return
                // }
                
                // var reg = /^[1-9]\d*$/
                // if (!reg.test(vm.nums)){
                //     lf.nativeUI.toast('销售数量不合法')
                //     return
                // }
                
                // if(!reg.test(vm.salePersonnelNum)&&vm.salePersonnelNum){
                //     lf.nativeUI.toast('销售人数不合法')
                //     return
                // }

                // var amountReg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
                
                // if (!vm.amount){
                //     lf.nativeUI.toast('请输入金额')
                //     return
                // }

                // if (vm.amount < 0.01){
                //     lf.nativeUI.toast('金额不能小于0.01')
                //     return
                // }

                // if (!amountReg.test(vm.amount)){
                //     lf.nativeUI.toast('金额只能精确到两位小数')
                //     return
                // }
                
                // if (!vm.remark){
                //     lf.nativeUI.toast('请选择销售类型')
                //     return
                // }
                
                // if (!vm.argDictId){
                //     lf.nativeUI.toast('请选择尺寸')
                //     return
                // }

                this.payType = payType
                this.payName = this.getPayName(this.payType)
                this.payTypeUrl = this.getPayTypeUrl(this.payType)

                if (payType == 0) {
                    cashPay()
                } else {
                    this.isPaying = true
                    payment()
                }
            },

            handleCancelPay: function() {
                var params = {
                    id: vm.id,
                }

                console.log(JSON.stringify(params));

                lf.nativeUI.showWaiting();

                lf.net.getJSON('/pay/cancelOrder', params, function(data) {
                    console.log(JSON.stringify(data));
        
                    if(data.code == 200) {
                        lf.nativeUI.closeWaiting();
                        lf.nativeUI.toast("已取消订单");
                        dispatchEvent()
                        lf.window.closeCurrentWebview();
                    } else {
                        lf.nativeUI.closeWaiting();
                        lf.nativeUI.toast(data.msg);
                    }
        
                }, function(erro) {
                    lf.nativeUI.closeWaiting();
                    lf.nativeUI.toast(erro.msg);
                })
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

            getPayTypeUrl: function(type) {
                switch (type) {
                    case 0:
                        this.channelCode = 'cash'
                        return '../../assets/css/images/sell_cash.png'
                    case 1:
                        this.channelCode = 'wechat'
                        return '../../assets/css/images/sell_wechat.png'
                    case 2:
                        this.channelCode = 'alipay'
                        return '../../assets/css/images/sell_alipay.png'
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
            argDictId: 1, // 脏代码待移除
            argDictName: "相片", // 脏代码待移除
            guideName: vm.guideName,
            purchaser: vm.purchaser,
            alias: vm.alias,
            saleOrderId: vm.saleOrderId,
            province: vm.province,
            city: vm.city,
            salePersonnelNum: vm.salePersonnelNum,
            salesOrderTxList: vm.salesOrderTxList
        }

        console.log(JSON.stringify(params));

        lf.nativeUI.showWaiting();

        lf.net.getJSON('/pay/payment', params, function(data) {
            console.log(JSON.stringify(data));

            if(data.code == 200) {
                if(vm.channelCode != 'cash'){
                    lf.nativeUI.closeWaiting();
                }

                vm.loopOrderId = data.data.saleOrderId

                // dispatchEvent()

                // 轮询支付状态
                vm.timer = setInterval(loopCheckPayStatus, vm.loopTime)

                generateQrcode(data.data.resultUrl)

            } else {
                lf.nativeUI.closeWaiting();
                lf.nativeUI.toast(data.msg);
                dispatchEvent()
                lf.window.closeCurrentWebview();
            }

        }, function(erro) {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(erro.msg);
            dispatchEvent()
            lf.window.closeCurrentWebview();
        })
    }
    // 删除所有子元素
    function clearAllNode(parentNode){
        while (parentNode.firstChild) {
            var oldNode = parentNode.removeChild(parentNode.firstChild);
            oldNode = null;
        }
    }
    // 生成二维码
    function generateQrcode(url) {
        clearAllNode(document.getElementById("qrcode-img"))
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
        if(vm.channelCode == 'cash'){
            lf.nativeUI.showWaiting();
        }
        lf.net.getJSON('pay/getOrderDetail', params, function(data) {
            console.log(JSON.stringify(data.data));

            if(data.code == 200) {

                console.log('looping');

                if (data.data.status != 1) {
                    vm.isPaying = false

                    // 移除轮询
                    clearInterval(vm.timer)
                    payCallback(data.data.status)
                }
                lf.nativeUI.closeWaiting();
            }
        })
    }

    // 支付回调
    function payCallback(data) {
        if (data == 2) {
            mui.alert("支付成功")
            // lf.nativeUI.toast("支付成功");
        } else if (data == 3) {
            mui.alert("支付已取消")
            // lf.nativeUI.toast("支付已取消");
        } else if (data == 4) {
            mui.alert("支付失败")
            // lf.nativeUI.toast("支付失败");
        }
        
        dispatchEvent()
        lf.window.closeCurrentWebview();
    }

    function dispatchEvent() {
        lf.event.fire(lf.window.currentWebview().opener(), 'orderPay', {})
    }

    lf.event.listener('orderdetails', function(e) {
        var params = {
            id: vm.saleOrderId
        }
        console.log("2222222")
        lf.nativeUI.showWaiting();

        lf.net.getJSON('pay/getOrderDetail', params, function(data) {
            console.log(JSON.stringify(data));

            if(data.code == 200) {
                lf.nativeUI.closeWaiting();
                
                vm.id = data.data.id
                vm.orderNo = data.data.orderNo
                vm.pOrderNo = data.data.pOrderNo
                vm.nums = data.data.nums
                vm.amount = data.data.totalAmount
                vm.orderStatus = data.data.status
               
                vm.orderTime = data.data.orderTime && lf.util.timeStampToDate(data.data.orderTime)
                vm.orderSaleDate = data.data.orderSaleDate && lf.util.timeStampToDate2(data.data.orderSaleDate)
                
                vm.remark = data.data.remark
                vm.argDictName = data.data.argDictName
                vm.argDictId = data.data.argDictId
                vm.channelName = data.data.channelName
                vm.salePersonnelNum = data.data.salePersonnelNum
                vm.verificationStatus = data.data.verificationStatus
                vm.givesNum = data.data.givesNum
                vm.province = data.data.province
                vm.city =  data.data.city
                vm.guidePhone = data.data.guidePhone
                vm.guideName = data.data.guideName
                vm.salesNums = data.data.salesNums
                vm.productName = data.data.productName
                vm.salesOrderTxList = data.data.salesOrderTxList;
            } else {
                lf.nativeUI.closeWaiting();
                lf.nativeUI.toast(data.msg);
            }

        }, function(erro) {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(erro.msg);
        })
    })
})
