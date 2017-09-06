lf.ready(function() {
    var vm = new Vue({
        el: '#app',
        data: {
            productName: '',
            groupNo: '',
            groupDate: '',
            guidName: '',
            guidTel: '',
            pNo: '',
            orderNo: '',
            operator:''
        }
    })

    mui('#app').on('tap', '.product-name', function() { //选择产品名称
        var picker = new mui.PopPicker();

        lf.nativeUI.showWaiting()
        lf.net.getJSON('order/getProductByDept', {}, function(res) {
            lf.nativeUI.closeWaiting()
            if (res.code === '200') {
                var data = []
                res.data.forEach(function(item, index) {
                    var obj = {
                        value: item.pNo,
                        text: item.aliasName
                    }
                    data.push(obj)
                })
                picker.setData(data);
                picker.show(function(selectItems) {
                    vm.productName = selectItems[0].text
                    vm.pNo = selectItems[0].value
                })
            } else {
                mui.alert(res.msg)
            }
        })
    })

    mui('#app').on('tap', '.groupDate', function() { //选择出团日期
        var opts = { "type": "date" };
        picker = new mui.DtPicker(opts);
        picker.show(function(select) {
            console.log(select)
            vm.groupDate = select.value
        })
    })

    mui('#app').on('tap', '.designate', function() { //选择执行人
        lf.window.openWindow('designate', '../designate/designate.html', {}, {
            quikOrderTag:true
        })
    })

    mui('#app').on('tap', '.sure', function() { //确认下单
        if (!validate(vm.$data)) {
            return
        }
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
            assignId: window.Role.usercode + '|' + window.Role.userroleId
        }
        lf.nativeUI.showWaiting()
        lf.net.getJSON('order/mobileQuickOrder', data, function(res) {
            lf.nativeUI.closeWaiting()
            if (res.code === '200' && res.data && res.data.orderNo) {
                vm.orderNo = res.data.orderNo
                lf.nativeUI.toast('下单成功')
            } else {
                lf.nativeUI.toast(res.msg)
            }
        }, function(res) {
            lf.nativeUI.closeWaiting()
            lf.nativeUI.toast(res.msg || '服务器异常')
        })
    })

    window.addEventListener('quikOrder', function(event) {
        console.log(event.detail.operatorNames)
        vm.operator=event.detail.operatorNames
    });
})

function validate(formData) {
    if (!formData.productName.trim()) {
        lf.nativeUI.toast('请选择产品')
        return false
    }
    if (!formData.groupNo.trim()) {
        lf.nativeUI.toast('请填写团号')
        return false
    }
    if (!formData.groupDate.trim()) {
        lf.nativeUI.toast('请选择日期')
        return false
    }
    if (!formData.guidName.trim()) {
        lf.nativeUI.toast('请填写姓名')
        return false
    }else if(!/^([\u4e00-\u9fa5]){2,7}$/.test(formData.guidName.trim())){
        lf.nativeUI.toast("请填写正确的中文姓名")
        return false
    }
    if (!formData.guidTel.trim()) {
        lf.nativeUI.toast('请填写电话')
        return false
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(formData.guidTel.trim()))) {
        lf.nativeUI.toast("请填写正确的手机号码")
        return false;
    }
    return true
}