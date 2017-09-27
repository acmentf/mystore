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
            var reg = /^[1-9]\d*$/
            var amountReg = /^[0-9]+([.]{1}[0-9]{1,2})?$/
            if(vm.planList[i].planPersons&&!reg.test(vm.planList[i].planPersons)){
                lf.nativeUI.toast('请输入正确的预发团人数');
                return false
            }
            if(vm.planList[i].planAmount&&vm.planList[i].planAmount<0.01){
                lf.nativeUI.toast('预销售额不能小于0.01')
                return false
            }
            if(vm.planList[i].planAmount&&!amountReg.test(vm.planList[i].planAmount)){
                lf.nativeUI.toast('预销售额只能精确到两位小数');
                return false
            }
            if(vm.planList[i].planShootNums&&!reg.test(vm.planList[i].planShootNums)){
                lf.nativeUI.toast('请输入正确的预拍人数');
                return false
            }
            if(!vm.planList[i].planPersons&&(vm.planList[i].planShootNums||vm.planList[i].planAmount)) {
                lf.nativeUI.toast('请输入预发团人数');
                return false
            }
            if((vm.planList[i].planPersons||vm.planList[i].planShootNums)&&!vm.planList[i].planAmount) {
                lf.nativeUI.toast('请输入预销售额');
                return false
            }
            if((vm.planList[i].planPersons||vm.planList[i].planAmount)&&!vm.planList[i].planShootNums) {
                lf.nativeUI.toast('请输入预拍人数');
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
            }
            vm.planList = list
		} else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(error) {
		lf.nativeUI.toast(error.msg);
	});
}