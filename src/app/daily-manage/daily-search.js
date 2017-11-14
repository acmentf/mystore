var vm = new Vue({
    el: '#app',
    data: {
        startTime: '',
        finishTime: '',
        yesterday: '',
        searhList: [],
        history: 0
    }
})
lf.ready(function(){
    var today = Utils.getPageParams("dailySearch").todayDate
    vm.yesterday = lf.util.timeStampToDate2(today-24*60*60*1000)
    mui('#app').on('tap', '.startTime', function () { //选择日报开始日期
        var opts = { "type": "date" };
        picker = new mui.DtPicker(opts);
        picker.setSelectedValue(vm.startTime)
        picker.show(function (select) {
            vm.startTime = select.value
        })
    })
    mui('#app').on('tap', '.finishTime', function () { //选择日报结束日期
        var opts = { "type": "date" };
        picker = new mui.DtPicker(opts);
        picker.setSelectedValue(vm.finishTime)
        picker.show(function (select) {
            vm.finishTime = select.value
        })
    })
    // 只看昨天
    mui("body").on("tap", ".only", function() {
        search(vm.yesterday, vm.yesterday)
        vm.history = 1
    })
    // 搜索
    mui("body").on("tap", ".search", function() {
        if(!vm.startTime){
            lf.nativeUI.toast("请选择填报开始时间")
            return false
        }
        if(!vm.finishTime){
            lf.nativeUI.toast("请选择填报结束时间")
            return false
        }
        var stamp = new Date(vm.finishTime) - new Date(vm.startTime)
        if(stamp<0){
            lf.nativeUI.toast("填报时间间隔不正确")
            return false
        }
        if(stamp>=7*24*60*60*1000){
            lf.nativeUI.toast("填报时间间隔应小于或等于7天")
            return false
        }
        search(vm.startTime, vm.finishTime)
        vm.history = 2
    })
    // 点击备注
    mui("body").on("tap", ".remark", function(){
        lf.window.openWindow('daily-remark', "daily-remark.html",{},{
            planDate: this.getAttribute('data-planDate'),
			planPersons: this.getAttribute('data-planPersons'),
			planAmount: this.getAttribute('data-planAmount'),
			planShootNums: this.getAttribute('data-planShootNums'),
			remark: this.getAttribute('data-remark')
        })
    })
    lf.event.listener('dailyManage', function(e) {
        if (vm.history == 1) {
            search(vm.yesterday, vm.yesterday)
        } else if(vm.history == 2) {
            search(vm.startTime, vm.finishTime)
        }
        lf.event.fire(lf.window.currentWebview().opener(), 'dailyManage', {})
    })
});
// 搜索
function search(startDate, endDate) {
    var params = {
        searchType:"search",
        searchStartDate: startDate,
        searchEndDate: endDate
    }
    lf.nativeUI.showWaiting()
    lf.net.getJSON('plan/getDailyPlan.htm', params, function(res) {
        lf.nativeUI.closeWaiting()
        if (res.code == 200) {
            console.log(JSON.stringify(res.data));
            var list = res.data
            list.sort(function(a,b){
                return a.planDate - b.planDate
            })
            for(var i=0;i<list.length;i++){
                list[i].planDate = lf.util.timeStampToDate2(list[i].planDate)
                if (list[i].planAmount>0) {
                    list[i]["proportionAmount"] = toPercent(list[i].realityAmount / list[i].planAmount)
                } else {
                    list[i]["proportionAmount"] = '0.00%'
                }
                if (list[i].planShootNums>0) {
                    list[i]["proportionShootNums"] = toPercent(list[i].realityShootNums / list[i].planShootNums)
                } else {
                    list[i]["proportionShootNums"] = '0.00%'
                }
            }
            vm.searhList = list
        } else {
            lf.nativeUI.toast(res.msg);
        }
    }, function(error) {
        lf.nativeUI.closeWaiting()
        lf.nativeUI.toast(error.msg);
    });
}
// 小数转为百分比
function toPercent(point){
    var str=Number(point*100).toFixed(2);
    str+="%";
    return str;
}