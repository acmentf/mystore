lf.ready(function() {
    var vm = new Vue({
        el: '#app',
        data: {
            journeyList: [], // 拍摄景点多选列表
            journeyListed: [], // 已选择拍摄景点列表
            shootType: '',
            shootTypeValue: '',
            productName: '',
            groupNo: '',
            groupMemberNum: '',
            groupDate: '',
            saleDate: '',
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
            deptId:'',//部门id
            lineName: ''
        },
        mounted: function () {
            // 初始化数据,针对h5特殊处理
            if (!mui.os.plus && window.localStorage.getItem('allocation-staff.html')) {
                var localStorageData = JSON.parse(window.localStorage.getItem('allocation-staff.html'))
                if(localStorageData.fromAllocation){
                    for (var key in localStorageData) {
                        if (localStorageData.hasOwnProperty(key)) {
                            this[key] = localStorageData[key]
                        }
                    }
                    localStorageData.fromAllocation=false
                    localStorage.setItem('allocation-staff.html',JSON.stringify(localStorageData))
                }
            }
        },
        methods: {
            selectJourneyName: function(e){
                e.preventDefault()
                e.stopPropagation()

                var _selectedList = vm.shootPlance.split(',')

                var params = {
                    pageSize: 1000,
                    currPage: 1,
                    pageCount: 0,
                    isShoot: 1,
                    lineNameLike: vm.lineName
                } 
    
                lf.nativeUI.showWaiting()
    
                lf.net.getJSON('/sight/list', params, function(res) {
                    lf.nativeUI.closeWaiting()
    
                    if (res.code === '200') {
                        document.querySelector('.select-journey-wrapper').style.display = 'block'
                        document.getElementsByTagName("body")[0].setAttribute("style","overflow:hidden")
    
                        res.data.data.forEach(function(item, index) {
                            if (!item.sightName) return

                            var isSelected = _selectedList.indexOf(item.sightName) != -1

                            if (isSelected) {
                                vm.journeyListed.push(item.sightName)
                            }
    
                            var obj = {
                                text: item.sightName,
                                selected: isSelected
                            }

                            vm.journeyList.push(obj)
                        })
    
                    } else {
                        mui.alert(res.msg)
                    }
                })
            },
            selectSingleJourney: function(name, index) {
                this.journeyListed.push(name)
                this.journeyList[index].selected = true
    
            },
            cancelSingleJourney: function(name, index) {
                var i = this.journeyListed.indexOf(name);
                if(i != -1) {
                    this.journeyListed.splice(i, 1);
                    this.journeyList[index].selected = false
                }
    
            },
            confirmSelectJourney: function() {
                document.querySelector('.select-journey-wrapper').style.display = 'none'
                document.getElementsByTagName("body")[0].setAttribute("style","")
                this.shootPlance = this.journeyListed.toString()
    
                this.journeyListed = []
                this.journeyList = []
            }
        }
    })

    // 监听是否从其他页面点击返回到该页面
    // 主要用于h5中选择指派人或摄影师后刷新页面
    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload() 
        }
    };

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
                        value: item.pNo + ' ' + item.aliasName,
                        text: item.pName
                    }
                    data.push(obj)
                })
                picker.setData(data)
                vm.purchaserStr = res.data.purchaserStr
                console.log(res.data[0].deptId)
                vm.deptId=res.data[0].deptId
                picker.show(function(selectItems) {
                    vm.productName = selectItems[0].text
                    vm.pNo = selectItems[0].value.split(' ')[0]
                    vm.lineName = selectItems[0].value.split(' ')[1]
                })
            } else {
                mui.alert(res.msg)
            }
        })
    })

    mui('#app').on('tap', '.groupDate', function() { //选择出团日期
        blur()
        var opts = { "type": "date" };
        var picker = new mui.DtPicker(opts);
        picker.show(function(select) {
            vm.groupDate = select.value
            vm.shootTime=select.value+' 全天'
        })
    })

    mui('#app').on('tap', '.saleDate', function() { //选择销售日期
        blur()
        var opts = { "type": "date" };
        var picker = new mui.DtPicker(opts);
        picker.show(function(select) {
            vm.saleDate = select.value
        })
    })

    mui('#app').on('tap', '.designate', function() { //选择执行人
        blur()
        vm.operator = ''
        lf.window.openWindow('allocation', '../designate/allocation-staff.html', {}, {
            quikOrderTag: true,
            type: 1,
            ...vm.$data
        })
    })

    mui('#app').on('tap', '.shooter', function() { //选择摄影师
        blur()
        vm.shooter = ''
        if (!vm.deptId) {
            lf.nativeUI.toast('请先选择产品')
            return
        }
        lf.window.openWindow('allocation', '../designate/allocation-staff.html', {}, {
            quikOrderTag: true,
            type: 2,
            ...vm.$data
        })
    })

    mui('#app').on('tap', '.shootType', function() { //选择拍摄类型
        var userPicker = new mui.PopPicker();
		userPicker.setData([{
			value: '1',
			text: '跟团'
		}, {
			value: '2',
			text: '驻点'
		}, {
			value: '3',
			text: '散团'
		}]);
		userPicker.show(function(items) {
			vm.shootType = items[0].text
			vm.shootTypeValue = items[0].value
			//返回 false 可以阻止选择框的关闭
			//return false;
		}, false);
    })
    
    // mui('#app').on('tap', '.shootPlance', function() { //选择拍摄景点
    //     //拍摄景点
    //     blur()
    //     var picker = new mui.PopPicker();
    //     var params = {
    //         pageSize: 1000,
    //         currPage: 1,
    //         pageCount: 0,
    //         isShoot: 1,
    //         lineNameLike: vm.lineName
    //     }
    //     lf.nativeUI.showWaiting()
    //     lf.net.getJSON('/sight/list', params, function(res) {
    //         lf.nativeUI.closeWaiting()
    //         if (res.code === '200') {
    //             var data = []
    //             res.data.data.forEach(function(item, index) {
    //                 var obj = {
    //                     text: item.sightName,
    //                 }
    //                 data.push(obj)
    //             })
    //             picker.setData(data)
    //             picker.show(function(selectItems) {
    //                 vm.shootPlance = selectItems[0].text
    //             })
    //         } else {
    //             mui.alert(res.msg)
    //         }
    //     })
    // })

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
        var picker = new mui.DtPicker(opts);
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
                shootType: vm.shootTypeValue
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
                saleDate: vm.saleDate,
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
    // if (!formData.groupNo.trim()) {
    //     lf.nativeUI.toast('请填写团号')
    //     return false
    // }
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
    if (!formData.shootTypeValue.trim()) {
        lf.nativeUI.toast('请选择拍摄类型')
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