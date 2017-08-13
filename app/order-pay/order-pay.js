/*
 * Description: 订单支付
 * Author: nishu
 * Email: nishu@foxmail.com
 */

lf.ready(function() {
    var data = {
        orderId: lf.window.currentWebview().orderId,
        areaCode: lf.window.currentWebview().areaCode,
        channelCode: '',
        nums: '',
        amount: '',
        remark: '',
        argDictId: '',
        argDictName: '',

        isPaying: false,
        payType: 0,
        payName: '',
        loopTime: 3000
    }

    var vm = new Vue({
        el: '#app',
        data: data,
        mounted: function() {
            
        },
        methods: {
            handlePay: function(payType) {
                if (!vm.nums){
                    lf.nativeUI.toast('请输入销售数量')
                    return
                }
                
                if (!vm.amount){
                    lf.nativeUI.toast('请输入金额')
                    return
                }
                
                if (!vm.remark){
                    lf.nativeUI.toast('请输入数量')
                    return
                }
                
                if (!vm.argDictId || !vm.argDictName){
                    lf.nativeUI.toast('请选择尺寸')
                    return
                }

                lf.nativeUI.showWaiting();

                this.isPaying = true

                this.payType = payType
                this.payName = this.getPayName(this.payType)

                this.payment()
            },

            // 发起支付请求
            payment: function() {
                var params = {
                    orderId: vm.orderId,
                    areaCode: vm.areaCode,
                    channelCode: vm.channelCode,
                    nums: vm.nums,
                    amount: vm.amount,
                    remark: vm.remark,
                    argDictId: vm.argDictId,
                    argDictName: vm.argDictName,
                }

                lf.net.getJSON('pay/payment', params, function(data) {
                    console.log(JSON.stringify(data));

                    if(data.code == 200) {
                        lf.nativeUI.closeWaiting();

                        // 轮询支付状态
                        this.timer = setInterval(this.loopCheckPayStatus, this.loopTime)

                        this.generateQrcode(data.data.resultUrl)
                    } else {
                        lf.nativeUI.closeWaiting();
                        lf.nativeUI.toast(data.msg);
                    }

                }, function(erro) {
                    lf.nativeUI.closeWaiting();
                    lf.nativeUI.toast(erro.msg);
                })
            },

            // 生成二维码
            generateQrcode: function(url) {
                new QRCode(document.getElementById("qrcode-img"), {
                    text: url,
                    width: 100,
                    height: 100,
                    colorDark : "#000000",
                    colorLight : "#ffffff",
                    correctLevel : QRCode.CorrectLevel.H
                })
            },

            // 轮询方法
            loopCheckPayStatus: function() {
                lf.net.getJSON('', params, function(data) {
                    if(data.code == 200) {

                        // 移除轮询
                        clearInterval(this.timer)

                        this.isPaying = false

                        this.payCallback()

                    }
                })
            },

            // 支付回调
            payCallback: function(data) {
                
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
            }
        }
    })
})
