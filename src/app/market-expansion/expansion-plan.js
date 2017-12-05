Vue.filter('dateFormatter', function(date){
    var reg = /^NaN/;
    var result = new Date(date).format('yyyy-MM-dd');
    if(!reg.test(result)) {
        return result;
    } else {
        return '';
    }
});

Vue.filter('dayFormatter', function(date){
    var dayArr = ['日', '一', '二', '三', '四', '五', '六'];
    var timeStamp = new Date(date);
    return timeStamp.format('yyyy-MM-dd') + ' 星期' + dayArr[timeStamp.getDay()];
});
Vue.filter('toFixed2', function(value) {
    return Number(value).toFixed(2);
});

var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            planList: [
            ],
            expectAmount: 0
        }
    },
    computed: {
        lastIndex: function() {
            if(this.planList.length > 0) {
                return this.planList.length - 1
            } else {
                return 0;
            }
        }
    },
    methods: {
        removeItem: function(index) {
            this.planList.splice(index, 1);
        }
    }
});

lf.ready(function(){
    var expectAmount;
    var userId = window.Role.usercode;
    var userName = window.Role.username;
    expectAmount = lf.window.currentWebview().expectAmount;
    vm.expectAmount = expectAmount;
    // 获取计划列表
    lf.nativeUI.showWaiting()
    lf.net.getJSON('/purchaser/getPurchaserPlan', {
        userId: userId,
        date: new Date().format('yyyy-MM-dd')
    }, function(res) {
        lf.nativeUI.closeWaiting();
        if(res.code == 200) {
            vm.planList = res.data;
        } else {
            lf.nativeUI.toast(res.msg);
        }
    }, function(err) {
        lf.nativeUI.closeWaiting();
        lf.nativeUI.toast(err.msg);
    });

    mui('body').on('tap', '#save', function() {
        var requestPlanList = [];
        for(var i = 0; i < vm.planList.length; i++) {
            var item = vm.planList[i];
            if(validateData(item)) {
                var temp = {
                    id: item.id,
                    planPreNum: item.planPreNum,
                    planPreAmount: item.planPreAmount,
                    remark: item.remark,
                    createTime: item.createTime,
                    planTime: item.planTime
                }
                requestPlanList.push(temp);
            } else {
                return;
            }
        }

        lf.nativeUI.showWaiting()
        lf.net.getJSON('/purchaser/saveOrUpPurchaserPlan', {
            purchaserPlans: requestPlanList
        }, function(res){
            lf.nativeUI.closeWaiting();
            if(res.code == 200) {
                lf.nativeUI.toast('保存成功');
                location.reload();
                refreshParentView();
            } else {
                lf.nativeUI.toast(res.msg);
            }
        }, function(err) {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(err.msg);
        })
    })

    function getNewDay() {
        if(vm.planList.length > 0) {
            var lastDayTimeStamp = vm.planList[vm.planList.length - 1].planTime;
            return lastDayTimeStamp + (1000 * 60 * 60 * 24);
        } else {
            return new Date().getTime();
        }
    }

    mui('body').on('tap', '.add-plan', function() {
        var newDay = getNewDay();
        var newItem = {
            createTime: new Date().getTime(),
            planTime: newDay,
            planPreAmount: 0,
            planPreNum: 0,
            userName: '',
            userId: userId
        };
        vm.planList.push(newItem);
        lf.nativeUI.toast(new Date(newDay).format('yyyy-MM-dd') + ' 计划添加成功');
    })

    function refreshParentView() {
        lf.event.fire(lf.window.currentWebview().opener(), 'refreshData', {})
    }

    function validateData(data) {
        // debugger
        var planPreNumReg = /^\d+$/;
        if(data.planPreNum) {
            if(!planPreNumReg.test(data.planPreNum)) {
                lf.nativeUI.toast('请正确填写前置人数');
                return false;
            }
        } else {
            if( data.planPreNum !== 0) {
                lf.nativeUI.toast('请填写' + new Date(data.planTime).format('yyyy-MM-dd') + '前置人数' );
                return false;
            }
        }
        var prePriceReg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/;

        if(data.planPreAmount) {
            if(!prePriceReg.test(data.planPreAmount)) {
                lf.nativeUI.toast('请正确填写前置金额');
                return false;
            }
        } else {
            if( data.planPreAmount !== 0) {
                lf.nativeUI.toast('请填写' + new Date(data.planTime).format('yyyy-MM-dd') + '前置金额' )
                return false;
            }                
        }

        if(data.remark) {
            if(data.remark.length > 15) {
                lf.nativeUI.toast('备注仅限15字');
                return false;
            }
        }
        return true;
    }
})