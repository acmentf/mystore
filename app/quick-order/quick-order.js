lf.ready(function() {
    var vm = new Vue({
        el: '#app',
        data: {
            productName: '',
            groupNo: '',
            groupMemberNum: '',
            groupDate: '',
            guidName: '',
            guidTel: '',
            pNo: '',
            purchaserStr: '', //采购方
            orderNo: '',
            operator: '',
            idString: '',
            shootPlance: '',
            shootTime: '',
            shooter: '',
            shooterId: '',
            shootNums: '',
            selectPhotoNums: '',
            size: '',
            sizeValue:'',
            printNums: '',
            photographerIdStr: [],
            deptId:''//部门id
        }
    })

    mui('#app').on('tap', '.product-name', function() { //选择产品名称
        blur()
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
                picker.setData(data)
                vm.purchaserStr = res.data.purchaserStr
                console.log(res.data[0].deptId)
                vm.deptId=res.data[0].deptId
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
        blur()
        var opts = { "type": "date" };
        picker = new mui.DtPicker(opts);
        picker.show(function(select) {
            vm.groupDate = select.value
            vm.shootTime=select.value+' 全天'
        })
    })

    mui('#app').on('tap', '.designate', function() { //选择执行人1
        blur()
        vm.operator = ''
        lf.window.openWindow('allocation', '../designate/allocation-staff.html', {}, {
            quikOrderTag: true,
            type: 1
        })
    })

    mui('#app').on('tap', '.shooter', function() { //选择摄影师2
        blur()
        vm.shooter = ''
        lf.window.openWindow('allocation', '../designate/allocation-staff.html', {}, {
            quikOrderTag: true,
            deptId:vm.deptId,
            type: 2
        })
    })

    mui('#app').on('tap', '.shootTime', function() { //选择拍摄日期
        blur()
        var opts = {
            "type": "hour",
            "customData": {
                "h": [
                    { value: "0", text: "全天" },
                    { value: "1", text: "上午" },
                    { value: "2", text: "下午" }
                ]
            }
        };
        picker = new mui.DtPicker(opts);
        picker.show(function(select) {
            console.log(select)
            vm.shootTime = select.text
        })
    })

    mui('#app').on('tap', '.print-size', function() { //选择打印尺寸
        blur()
        var picker = new mui.PopPicker();
        picker.setData([
            { value: '5', text: '6寸' },
            { value: '6', text: '7寸' },
            { value: '4', text: '8寸' },
            { value: '3', text: '10寸' },
            { value: '2', text: '12寸' },
            { value: '1', text: '16寸' },
        ]);
        picker.show(function(select) {
            vm.size = select[0].text
            vm.sizeValue = select[0].value
        })
    })

    mui('#app').on('tap', '.sure', function() { //确认下单
        blur()
        if (!validate(vm,vm.$data)) {
            return
        }
        var periodType = vm.shootTime.split(' ')[1]
        switch (periodType) {
            case '上午':
                periodType = 1
                break;
            case '下午':
                periodType = 2
                break;
            case '晚上':
                periodType = 3
                break;
            case '全天':
                periodType = 0
                break;
        }
        var photographerIdStr = vm.shooterId.split(',')
        if (photographerIdStr.length > 1) {
            photographerIdStr = photographerIdStr.map(function(item) {
                return item.split('|')[0]
            })
        } else if (photographerIdStr.length == 1) {
            photographerIdStr = [].concat(vm.shooterId.split('|')[0])
        } else {
            photographerIdStr = []
        }

        var data = {
            userId: window.Role.currentPositions[0].roleId,
            order: {
                purchaser: vm.purchaserStr,
                tourNo: vm.groupNo,
                productCode: vm.pNo,
                tourGuide: vm.guidName,
                tourGuidePhone: vm.guidTel,
                startTime: vm.groupDate,
            },
            tourGroups: {
                personCount: vm.groupMemberNum
            },
            assignId: vm.idString,
            lineSightDTOS: [{
                journeyName: vm.shootPlance,
                shootTime: vm.shootTime.split(' ')[0],
                photographerIdStr: photographerIdStr,
                periodType: periodType
            }],
            orderX: {
                shootNum: vm.shootNums,
                selectsNum: vm.selectPhotoNums,
            },
            orderXmList: [{
                picSize: vm.sizeValue,
                picNum: vm.printNums,
                fType:'1'
            }]
        }
        console.log('摄影师id',photographerIdStr)
        lf.nativeUI.showWaiting()
        lf.net.getJSON('order/mobileQuickOrder', data, function(res) {
            lf.nativeUI.closeWaiting()
            if (res.code === '200' && res.data && res.data.orderNo) {
                vm.orderNo = res.data.orderNo
                lf.nativeUI.toast('下单成功')
                lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
                lf.window.closeCurrentWebview()
            } else {
                lf.nativeUI.toast(res.msg)
            }
        }, function(res) {
            lf.nativeUI.closeWaiting()
            lf.nativeUI.toast(res.msg || '服务器异常')
        })
    })

    window.addEventListener('quikOrderSelectUsers', function(event) {
        if (event.detail.type == 1) {
            vm.operator = event.detail.nameString
            vm.idString = event.detail.idString
        }
        if (event.detail.type == 2) {
            vm.shooter = event.detail.nameString
            vm.shooterId = event.detail.idString
        }
    });
})

function blur(){
    for(var i=0,length=document.getElementsByTagName('input').length;i<length;i++){
        document.getElementsByTagName('input')[i].blur()
    }
}

function validate(vm,formData) {
    if (!formData.productName.trim()) {
        lf.nativeUI.toast('请选择产品')
        return false
    }
    if (!formData.groupNo.trim()) {
        lf.nativeUI.toast('请填写团号')
        return false
    }
    if (!formData.groupMemberNum.trim()) {
        lf.nativeUI.toast('请填写团人数')
        return false
    } else if (!/^[0-9]*[1-9][0-9]*$/.test(formData.groupMemberNum.trim())) {
        lf.nativeUI.toast('请输入正确的人数')
        return false
    }
    if (!formData.groupDate.trim()) {
        lf.nativeUI.toast('请选择出团日期')
        return false
    }
    if (!formData.guidName.trim()) {
        lf.nativeUI.toast('请填写姓名')
        return false
    } else if (!/^([\u4e00-\u9fa5]){2,7}$/.test(formData.guidName.trim())) {
        lf.nativeUI.toast("请填写正确的中文姓名")
        return false
    }
    if (!formData.guidTel.trim()) {
        lf.nativeUI.toast('请填写电话')
        return false
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(formData.guidTel.trim()))) {
        lf.nativeUI.toast("请填写正确的手机号码")
        return false
    }
    if (!formData.idString.trim()) {
        lf.nativeUI.toast('请选择指派人')
        return false
    }
    if (!formData.shootPlance.trim()) {
        lf.nativeUI.toast('请填写景点名')
        return false
    }
    if (!formData.shootTime.trim()) {
        lf.nativeUI.toast('请选择拍摄时间')
        return false
    }
    if (!formData.shooter.trim()) {
        lf.nativeUI.toast('请选择摄影师')
        return false
    }
    if (formData.shootNums.trim()) {
        if (!/^[0-9]*[1-9][0-9]*$/.test(formData.shootNums.trim())) {
            lf.nativeUI.toast('请填写正确拍摄数量')
            return false
        }
    }
    if (formData.selectPhotoNums.trim()) {
        if (!/^[0-9]*[1-9][0-9]*$/.test(formData.selectPhotoNums.trim())) {
            lf.nativeUI.toast('请填写正确选片数量')
            return false
        }
    }
    if (!formData.size.trim()) {
        console.log(888)
        vm.printNums = ''
    } else {
        if (!/^[0-9]*[1-9][0-9]*$/.test(formData.printNums.trim())) {
            lf.nativeUI.toast('请填写正确打印数量')
            return false
        }
    }
    return true
}