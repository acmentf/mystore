var vm = new Vue({
    el: '#app',
    data: {
        planList: []
    },
    methods: {
        formChange: function(e,i,key){
            this.planList[i][key] = e.target.value
        }
    }
})
lf.ready(function() {
    init()
    // 保存计划
    mui("body").on("tap", ".save-btn", function() {
        for(var i=0;i<vm.planList.length;i++) {
            if(!vm.planList[i].planPersons&&(vm.planList[i].planShootNums||vm.planList[i].planAmount)) {
                lf.nativeUI.toast('请输入发团人数');
                return false
            }
            if((vm.planList[i].planPersons||vm.planList[i].planShootNums)&&!vm.planList[i].planAmount) {
                lf.nativeUI.toast('请输入金额');
                return false
            }
            if((vm.planList[i].planPersons||vm.planList[i].planAmount)&&!vm.planList[i].planShootNums) {
                lf.nativeUI.toast('请输入拍摄人数');
                return false
            }
        }
        var params = {
            dailyPlan: vm.planList
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
// 初始化数据
function init() {
	var params = {
		searchType:"default"
	}
	lf.net.getJSON('plan/getDailyPlan.htm', params, function(res) {
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
            vm.planList = list
		} else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(error) {
		lf.nativeUI.toast(error.msg);
	});
}
// 小数转为百分比
function toPercent(point){
    var str=Number(point*100).toFixed(2);
    str+="%";
    return str;
}