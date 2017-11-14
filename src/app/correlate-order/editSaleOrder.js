lf.ready(function() {
    var query = Utils.getPageParams("editSaleOrder");
    
    var vm = new Vue({
        el: '#app',
        data: {
            orderId: query.orderId,
            productName: query.productName,
            tourNo: query.tourNo,
            saleTime: lf.util.timeStampToDate2(query.saleTime),
            amount: query.amount,
            channelName: query.channelName,
            saleOrderId: query.saleOrderId,
            tourGuide: query.tourGuide,
            orderStatus: '',
            orderNo: '',
            pOrderNo: '',
            nums: '',
            id: '',
            alias: '',
            orderTime: '',
            orderSaleDate: '',
            remark: '相片',
            argDictId: 6,
            argDictName: '7寸',
            salePersonnelNum: '',
            verificationStatus: '',
            givesNum: '',
            sizeOptions: {
                1: '16寸',
                2: '12寸',
                3: '10寸',
                4: '8寸',
                6: '7寸',
                5: '6寸',
            },
            saleId: '',
            saleName: '',
            salePositionId: '',
            pNo:''
        },
        // watch: {
        //     argDictId: function(val) {
        //         for(var key in sizeOptions){
        //             if(key==val){
        //                 this.argDictName = sizeOptions[key]
        //             }
        //         }
        //     }
        // },
        methods: {
            channelTyle: function(channelName){
                switch (channelName) {
                    case '现金支付':
                        return '../../css/images/sell_cash.png'
                    case '微信支付':
                        return '../../css/images/sell_wechat.png' 
                    case '支付宝支付':
                        return '../../css/images/sell_alipay.png'
                }
            },
            saveInfo: function () {
                if(!vm.productName){
                    lf.nativeUI.toast("请选择产品名称")
                    return
                }
                if(!vm.orderSaleDate){
                    lf.nativeUI.toast("请选择销售时间")
                    return
                }
                if(!vm.tourGuide){
                    lf.nativeUI.toast("请选择导游")
                    return
                }
                if(!vm.remark){
                    lf.nativeUI.toast("请选择销售类型")
                    return
                }
                if(!vm.argDictId){
                    lf.nativeUI.toast("请选择销售尺寸")
                    return
                }
                var reg = /^[1-9]\d*$/
                if(!vm.nums){
                    lf.nativeUI.toast("请输入销售张数")
                    return
                }
                if (!reg.test(vm.nums)){
                    lf.nativeUI.toast('销售张数不合法')
                    return
                }
                if(!vm.salePersonnelNum){
                    lf.nativeUI.toast("请输入销售人数")
                    return
                }
                if (!reg.test(vm.salePersonnelNum)){
                    lf.nativeUI.toast('销售人数不合法')
                    return
                }
                if(!vm.saleName){
                    lf.nativeUI.toast("请选择销售")
                    return
                }
                console.log(vm.orderId)
                var params = {
                    argDictId:vm.argDictId,
                    argDictName: vm.sizeOptions[vm.argDictId],
                    remark:vm.remark,
                    createTimeStr:vm.createTime,
                    id:vm.id,
                    orderId: vm.orderId,
                    guideName: vm.tourGuide,
                    nums:vm.nums,
                    saleId:vm.saleId,
                    saleName:vm.saleName,
                    salePersonnelNum:vm.salePersonnelNum,
                    salePositionId:vm.salePositionId
                };
                console.log(vm.argDictdName)
                lf.nativeUI.showWaiting()
                lf.net.getJSON('pay/editOrderInfo', params, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        lf.nativeUI.toast('保存成功！');
                        lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
                        lf.window.closeCurrentWebview();
                    } else {
                        mui.alert(res.msg)
                    }
                })
            },
            selectProduct: function () {
                blur()
                var params = {
                    aliasName:vm.alias
                };
                lf.nativeUI.showWaiting()
                lf.net.getJSON('order/getProductByAliasName', params, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        var data = []
                        if (res.data.length ==0){
                            mui.alert('暂无产品')
                            return 
                        }
                        console.log(JSON.stringify(res.data))
                        res.data.forEach(function(item, index) {
                            var obj = {
                                value: item.pNo,
                                text: item.pName
                            }
                            data.push(obj)
                        })
                        console.log(JSON.stringify(data))
                        var picker = new mui.PopPicker();
                        picker.setData(data)
                        picker.show(function(selectItems) {
                            if(selectItems[0].text != vm.productName){
                                vm.productName = selectItems[0].text
                                vm.pNo = selectItems[0].value
                                vm.orderSaleDate = ''
                                vm.tourGuide = ''
                                vm.pOrderNo = ''
                                vm.nums = ''
                                vm.saleName = ''
                            }
                        })
                    } else {
                        mui.alert(res.msg)
                    }
                })
            },
            selectDate: function() {
                blur()
                var opts = { "type": "date" };
                picker = new mui.DtPicker(opts);
                picker.setSelectedValue(vm.saleTime)
                picker.show(function(select) {
                    if(select.value != vm.orderSaleDate){
                        vm.orderSaleDate = select.value
                        vm.tourGuide = ''
                        vm.pOrderNo = ''
                        vm.nums = ''
                        vm.saleName = ''
                    }
                })
            },
            selectGuide: function() {
                if(!vm.pNo){
                    lf.nativeUI.toast("请选择产品名称")
                    return
                }
                if(!vm.orderSaleDate){
                    lf.nativeUI.toast("请选择销售时间")
                    return
                }
                blur()
                var params = {
                    productCode: vm.pNo, 
                    saleDate: vm.orderSaleDate
                };
                lf.nativeUI.showWaiting()
                lf.net.getJSON('order/queryGuideByProductAndSaleDate', params, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        console.log(JSON.stringify(res.data))
                        var data = []
                        if (res.data.length ==0){
                            lf.nativeUI.toast('暂无导游');
                            return 
                        }
                        res.data.forEach(function(item, index) {
                            var obj = {
                                text: item.tourGuide,
                                value: item.orderNo + " " + item.orderId
                            }
                            data.push(obj)
                        })
                        var picker = new mui.PopPicker();
                        picker.setData(data)
                        picker.show(function(selectItems) {
                            if(selectItems[0].text != vm.tourGuide){
                                vm.tourGuide = selectItems[0].text
                                vm.pOrderNo = selectItems[0].value.split(" ")[0]
                                vm.orderId = selectItems[0].value.split(" ")[1]
                                vm.saleName = ''
                            }
                        })
                    } else {
                        mui.alert(res.msg)
                    }
                })
            },
            selectSale: function(){
                blur()
                var params = {
                    orderNo: vm.pOrderNo
                };
                lf.nativeUI.showWaiting()
                lf.net.getJSON('order/querySaleUserByOrderNo', params, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        var data = []
                        if (res.data.length ==0){
                            mui.alert('暂无销售')
                            return 
                        }
                        res.data.forEach(function(item, index) {
                            var obj = {
                                value: item.id + ' ' + item.positionId,
                                text: item.name
                            }
                            data.push(obj)
                        })
                        var picker = new mui.PopPicker();
                        picker.setData(data)
                        picker.show(function(selectItems) {
                            vm.saleId = selectItems[0].value.split(" ")[0]
                            vm.saleName = selectItems[0].text
                            vm.salePositionId = selectItems[0].value.split(" ")[1]
                        })
                    } else {
                        mui.alert(res.msg)
                    }
                })
            }
        },
        mounted: function() {
            console.log(window.Role.userroleId)
            this.salePositionId = window.Role.userroleId
            var params = {
                id: this.saleOrderId
            }

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
                    if(data.data.orderSaleDate) {
                        vm.orderSaleDate = lf.util.timeStampToDate2(data.data.orderSaleDate)
                    }
                    if(data.data.argDictId){
                        vm.remark = data.data.remark
                        vm.argDictName = data.data.argDictName
                        vm.argDictId = data.data.argDictId
                    }
                    vm.channelName = data.data.channelName
                    vm.salePersonnelNum = data.data.salePersonnelNum
                    vm.verificationStatus = data.data.verificationStatus
                    vm.givesNum = data.data.givesNum
                    vm.province = vm.province || data.data.province
                    vm.city = vm.city || data.data.city
                    vm.alias = data.data.alias
                    vm.pNo = data.data.productNo
                    vm.saleId = data.data.saleId
                    vm.saleName = data.data.saleName
                    vm.createTime = lf.util.timeStampToDate2(data.data.createTime)
                    vm.guideName = data.data.guideName
                    vm.nums = data.data.salesNums
                    vm.productName = data.data.productName
    
                } else {
                    lf.nativeUI.closeWaiting();
                    lf.nativeUI.toast(data.msg);
                }
    
            }, function(erro) {
                lf.nativeUI.closeWaiting();
                lf.nativeUI.toast(erro.msg);
            })
        }
    })
})

function blur(){
    for(var i=0,length=document.getElementsByTagName('input').length;i<length;i++){
        document.getElementsByTagName('input')[i].blur()
    }
}