var vm = new Vue({
    el: '#app',
    data: {
        planDate: '',
        planPersons: '',
        planAmount: '',
        planShootNums: '',
        textLenth: 0,
        remark: ''
    },
    methods: {
        changeText: function(e){
            vm.textLenth = e.target.value.length
        }
    }
})
lf.ready(function() {
    var query = Utils.getPageParams("dailyRemark")
    vm.planDate = query.planDate
    vm.planPersons = query.planPersons
    vm.planAmount = query.planAmount
    vm.planShootNums = query.planShootNums
    vm.remark = query.remark
    vm.textLenth = vm.remark? vm.remark.length:0
    // 保存
    mui("body").on("tap", ".save-btn", function() {
        var params = {
            dailyPlan: [{
                planDate: vm.planDate,
                planPersons: vm.planPersons,
                planAmount: vm.planAmount,
                planShootNums: vm.planShootNums,
                remark: vm.remark
            }]
        }
        lf.nativeUI.showWaiting()
        lf.net.getJSON('plan/saveOrUpDailyPlan.htm', params, function(res) {
            lf.nativeUI.closeWaiting()
            if (res.code == 200) {
                console.log(JSON.stringify(res.data));
                lf.nativeUI.toast('保存成功');
                lf.event.fire(lf.window.currentWebview().opener(), 'dailyManage', {})
                lf.window.closeCurrentWebview();
            } else {
                lf.nativeUI.toast(res.msg);
            }
        }, function(error) {
            lf.nativeUI.closeWaiting()
            lf.nativeUI.toast(error.msg);
        });
    })
})