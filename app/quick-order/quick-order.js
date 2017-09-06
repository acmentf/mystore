lf.ready(function () {
    var vm = new Vue({
        el: '#app',
        data: {
            productName: '',
            groupNo: '',
            groupDate: '',
            guidName: '',
            guidTel: '',
            pNo: '',
            orderNo:''
        }
    })

    mui('#app').on('tap', '.product-name', function () {
        var picker = new mui.PopPicker();

        lf.net.getJSON('order/getProductByDept', {}, function (res) {
            if (res.code === '200') {
                var data = []
                res.data.forEach(function (item, index) {
                    var obj = {
                        value: item.pNo,
                        text: item.aliasName
                    }
                    data.push(obj)
                })
                picker.setData(data);
                picker.show(function (selectItems) {
                    vm.productName = selectItems[0].text
                    vm.pNo = selectItems[0].value
                })
            } else {
                mui.alert(res.msg)
            }
        })
    })

    mui('#app').on('tap', '.groupDate', function () {
        var opts = { "type": "date" };
        picker = new mui.DtPicker(opts);
        picker.show(function (select) {
            console.log(select)
            vm.groupDate = select.value
        })
    })

    mui('#app').on('tap', '.designate', function () {
        lf.window.openWindow('designate', '../designate/designate.html', {}, {})
    })

    mui('#app').on('tap', '.sure', function () {
        console.log(window.Role.currentPositions[0].roleId)
        var data = {
            order: {
                tourNo: vm.groupNo,
                productCode: vm.pNo,
                tourGuide: vm.guidName,
                tourGuidePhone: vm.guidTel,
                startTime: +new Date(vm.groupDate),
            },
            tourGroups: {
                tourNo: vm.groupNo
            },
            assignId: window.Role.usercode+'|'+window.Role.userroleId
        }
        lf.net.getJSON('order/mobileQuickOrder', data, function (res) {
            if (res.code === '200'&&res.data&&res.data.orderNo) {
                vm.orderNo=res.data.orderNo
                mui.alert('快速下单成功')
            } else {
                mui.alert(msg)
            }
        })
    })
})

