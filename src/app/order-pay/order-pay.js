/*
 * Description: 订单支付
 * Author: nishu
 * Email: nishu@foxmail.com
 */

lf.ready(function() {
    let params = lf.window.currentWebview();
    let salesOrderTxListItemDefault = {
        remark: '',
        remarkName: '',
        argDictId: '',                    
        picNum: '',
        fType:3
    };
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
        saleHandleData:[],
        isPaying: false,
        payType: 0,
        payTypeUrl: '../../assets/css/images/sell_cash.png',
        payName: '',
        loopTime: 1000,
        loopOrderId: '',
        timer: null,
        price:'',
        isPrice:false,
        salesTypeEmun:[],
        salesSizeEmun:[],
        salesOrderTxList: [
            {
                ...salesOrderTxListItemDefault
            }
        ]
    }
    console.log('data',data)
    var vm = new Vue({
        el: '#app',
        data: data,
        computed: {
            saleRemoveIconShow() {
                return this.salesOrderTxList.length > 1;
            }
        },
        mounted: function() {
            document.getElementById("pay-dialog").classList.remove("hide");
            document.getElementById("pay-mask").classList.remove("hide");
            let salesTypeEmun = []
            let that = this;
            let picker = new mui.PopPicker();
            // 选择照片尺寸
            mui('.mui-content').on('tap', '.sales-size', function() {
                vm.salesSizeEmun = [];
                let index = this.getAttribute('data-index')
                let currentItem = that.salesOrderTxList[index];
                vm.saleHandleData.forEach(e=>{
                    if (e.type === currentItem.remarkName){
                     console.log('e--',e);
                         e.sizeData.forEach(i=>{
                             vm.salesSizeEmun.push({
                                 value: i.id,
                                 text: i.size,
                                 unitPrice: i.unitPrice
                             })
                         })
                    }
                 })
                picker.setData(vm.salesSizeEmun);
                picker.show(function(selectedItem){
                    console.log('selectedItem',selectedItem)
                    currentItem.argDictId = selectedItem[0].value;
                    currentItem.unitPrice = selectedItem[0].unitPrice;
                    currentItem.argDictName = selectedItem[0].text;
                    Vue.set(that.salesOrderTxList,index,currentItem);
                    console.log(that.salesOrderTxList);
                })
            });
            // 选择产品类型
            mui('.mui-content').on('tap', '.sales-type', function() {
                console.log(index)
                let index = this.getAttribute('data-index');
                let currentItem = that.salesOrderTxList[index];
                picker.setData(vm.salesTypeEmun);
                picker.show(function(selectedItem) {
                    vm.salesSizeEmun = [];
                    console.log('selectedItem',selectedItem)
                    currentItem.remark = selectedItem[0].id;
                    currentItem.remarkName = selectedItem[0].value;
                    currentItem.argDictName = '';
                   // console.log('currentItem',selectedItem);
                    //规格联动
                    console.log(currentItem)
                    Vue.set(that.salesOrderTxList,index,currentItem);
                   
                })
            });

           
            if (!this.saleOrderId) return
            var params = {
                id: this.saleOrderId
            }

            lf.nativeUI.showWaiting();
           
            lf.net.getJSON('pay/getOrderDetail', params, function(data) {
              
               
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

                    vm.salesOrderTxList = (function() {
                        // 如果 salesOrderTxList 没值，要赋默认值
                        if (!data.data.salesOrderTxList || data.data.salesOrderTxList.length == 0) {
                            return [
                                {
                                    ...salesOrderTxListItemDefault
                                }
                            ]
                        } else {
                            return data.data.salesOrderTxList;
                        }
                    }())
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
            removeSaleItem(index) {
                this.salesOrderTxList.splice(index, 1);
            },
            addSaleItem() {
                let saleItem = {...salesOrderTxListItemDefault};
                this.salesOrderTxList.push(saleItem);
            },
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
                mui.back();
                lf.window.openWindow('../correlate-order/editSaleOrder.html','../correlate-order/editSaleOrder.html',{},{
                    orderId: vm.orderId,
                    productName: vm.productName,
                    tourNo: vm.tourNo,
                    saleTime: vm.orderSaleDate,
                    amount: vm.amount,
                    channelName: vm.channelName,
                    saleOrderId: vm.saleOrderId,
                    tourGuide: vm.guideName
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
                var reg = /^[1-9]\d*$/
                
                for (let i = 0; i < vm.salesOrderTxList.length; i++) {
                   
                    let item = vm.salesOrderTxList[i];
                    if(!item.remark) {
                        lf.nativeUI.toast(this.$t('select_sale_type'));
                        return;
                    }
                    if(!item.argDictId) {
                        lf.nativeUI.toast(this.$t('select_sale_size'));
                        return;
                    }
                    if(!reg.test(item.picNum)){
                        lf.nativeUI.toast(this.$t('select_sale_nums'));
                        return
                    }
                }

                // 通过 salesOrderTxListCopy 去重校验 vm.salesOrderTxList 是否选择了相同销售类型与销售尺寸;
                let nums = 0;
                let salesOrderTxListCopy = vm.salesOrderTxList.map((item) => {
                    nums = nums + (item.picNum - 0);
                    return `remark:${item.remark},argDictId:${item.argDictId},argDictName:${item.argDictName}`;
                });
                this.nums = nums;
                let tempSalesOrderTxList = [];
                for(let i = 0; i < salesOrderTxListCopy.length; i ++) {
                    if(tempSalesOrderTxList.indexOf(salesOrderTxListCopy[i]) == -1) {
                        tempSalesOrderTxList.push(salesOrderTxListCopy[i]);
                    } else {
                        lf.nativeUI.toast(this.$t('choose_tips_same_type_size'));
                        return;
                    }
                }

                if(!reg.test(vm.salePersonnelNum)){
                    lf.nativeUI.toast(vm.$t('enter_person_nums'))
                    return
                }

                var amountReg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/;
                
                if (!amountReg.test(vm.amount)){
                    lf.nativeUI.toast(this.$t('enter_amount_nums'));
                    return
                }

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

                lf.net.getJSON('pay/cancelOrder', params, function(data) {
                    console.log(JSON.stringify(data));
        
                    if(data.code == 200) {
                        lf.nativeUI.closeWaiting();
                        lf.nativeUI.toast(vm.$t('success'));
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
                        return vm.$t('cash_payment')
                    case 1:
                        this.channelCode = 'wechat'
                        return vm.$t('wechat_payment')
                    case 2:
                        this.channelCode = 'alipay'
                        return vm.$t('alipay_payment')
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
        lf.nativeUI.confirm(vm.$t('cash_payment'), vm.amount + vm.$t('cost_suffix'), [vm.$t('ok'), vm.$t('cancel')], function(e) {
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
            nums: vm.picNum,
            amount: vm.amount,
            remark: vm.remark,
            argDictId: vm.argDictId,
            argDictName: vm.sizeOptions[vm.argDictId],
            guideName: vm.guideName,
            purchaser: vm.purchaser,
            alias: vm.alias,
            saleOrderId: vm.saleOrderId,
            province: vm.province,
            city: vm.city,
            salePersonnelNum: vm.salePersonnelNum,
            salesOrderTxList: vm.salesOrderTxList
        }
       
        lf.nativeUI.showWaiting();
        console.log('params',JSON.stringify(params));
      
        lf.net.getJSON('pay/payment', params, function(data) {

            if(data.code == 200) {
                if(vm.channelCode != 'cash'){
                    lf.nativeUI.closeWaiting();
                }
                vm.loopOrderId = data.data.saleOrderId
                // dispatchEvent()
                // 轮询支付状态
                // lf.nativeUI.toast("生成销售成功");
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
            mui.alert(vm.$t('pay_succeeded'))
            // lf.nativeUI.toast("支付成功");
        } else if (data == 3) {
            mui.alert(vm.$t('pay_cancelled'))
            // lf.nativeUI.toast("支付已取消");
        } else if (data == 4) {
            mui.alert(vm.$t('pay_faild'))
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
      
        lf.nativeUI.showWaiting();

        lf.net.getJSON('pay/getOrderDetail', params, function(data) {
            console.log('data',JSON.stringify(data));

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
            } else {
                lf.nativeUI.closeWaiting();
                lf.nativeUI.toast(data.msg);
            }

        }, function(erro) {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(erro.msg);
        })
    })
    //获取销售类型数据
    function getSalesTypeEmun (){
        vm.saleHandleData.forEach(e=>{
            vm.salesTypeEmun.push({
                value: e.type,
                text: e.type,
                id: e.id
            })
        })
    }
    function getUpdateData(){
        lf.net.getJSON('/price/queryTypeSizePrice', {"flag":0,'isSold':1 }, function (res){
            console.log(res)
            if(res.code == 200){
                let data = res.data.type
                //获取销售类型
                vm.saleHandleData = data;
                console.log('vm.saleHandleData',vm.saleHandleData)
                getSalesTypeEmun();
                
            }else {
                lf.nativeUI.toast(res.msg);
            }
        }, function(res) {
            lf.nativeUI.closeWaiting()
            lf.nativeUI.toast(res.msg)
        })
    }
    getUpdateData();
})
