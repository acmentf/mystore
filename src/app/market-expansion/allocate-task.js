var priceReg = /(^[1-9](\d+)?(\.\d{1,2})?$)|(^(0){1}$)|(^\d\.\d{1,2}?$)/;

var vm = new Vue({
    el: "#app",
    data: function () {
        return {
            monthPlanAmt: 0,
            list: []
        }
    },
    computed: {
        restAmount: function() {
            var result = this.monthPlanAmt;
            this.list.forEach(function(item){
                if(priceReg.test(item.monthPlanAmt)) {
                    result = result - item.monthPlanAmt;
                }
            });
            if(result < 0) {
                return 0;
            }
            return result;
        }
    },
    methods: {
        inputBlur: function(userName, val) {
            if(!priceReg.test(val)){
                lf.nativeUI.toast(userName + '本月预期填写错误');
            }
        }
    },
});

function getLastMonthDate() {
    // 获取上个月一号
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = '1';

    var resultDate = new Date();
    resultDate.setFullYear(year);
    resultDate.setMonth(month - 1);
    resultDate.setDate(day);
    return resultDate;
}
lf.ready(function () {
    mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, //是否显示滚动条
        deceleration: mui.os.ios ? 0.003 : 0.0009
    });

    var lastMonthDate = getLastMonthDate();

    lf.nativeUI.showWaiting();
    lf.net.getJSON('/report/newAnalysis/channelPlanDetail', {
        startDate: new Date().format("yyyy-MM-dd")
    }, function(res){
        lf.nativeUI.closeWaiting();
        if(res.code == 200) {
            var resData = res.data;
            if(resData) {
                if(resData.dailyList.length == 0) {
                    lf.nativeUI.toast('没有详细数据');
                }
                vm.planCompletedList = resData.dailyList;
                vm.monthPlanAmt = resData.monthPlanAmt;

                lf.nativeUI.showWaiting();
                lf.net.getJSON('/report/newAnalysis/channelPlanDetail', {
                    startDate: lastMonthDate.format('yyyy-MM-dd')
                }, function(res){
                    lf.nativeUI.closeWaiting();
                    if(res.code == 200) {
                        var lastMonthData = res.data.dailyList;
                        if(lastMonthData) {
                            var list = [];
                            for(var i = 0; i < vm.planCompletedList.length; i++) {
                                list[i] = vm.planCompletedList[i];
                                list[i].monthPlanAmt = list[i].monthPlanAmt || 0;
                                list[i].lastMonthPlanAmt = lastMonthData[i] ? lastMonthData[i].monthPlanAmt : 0;
                                list[i].lastMonthAmount = lastMonthData[i] ? lastMonthData[i].monthAmount : 0;
                            }
                            vm.list = list;
                        } else {
                        }
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(erro) {
                    lf.nativeUI.closeWaiting();
                    lf.nativeUI.toast(erro.msg);
                });
            } else {
            }
        } else {
            lf.nativeUI.toast(res.msg);
        }
    }, function(erro) {
        lf.nativeUI.closeWaiting();
        lf.nativeUI.toast(erro.msg);
    })

    mui('body').on('tap', '#save', function() {

        if(vm.restAmount > 0) {
            lf.nativeUI.toast('本月预期尚未分配完');
            return;
        }
        var requestList = [];
        var errorFlag = false;
        for(var i = 0, length = vm.list.length; i < length; i++) {
            var item = vm.list[i];
            var temp = {};
            if(item.monthPlanAmt !== null) {
                if(priceReg.test(item.monthPlanAmt)) {
                    temp = {
                        userId: item.userId,
                        userName: item.userName,
                        saleAmt: -(-item.monthPlanAmt),
                        salesPersons: item.planPreNum
                    };
                } else {
                    lf.nativeUI.toast(item.userName + '本月预期分配不正确');
                    errorFlag = true;
                    break;
                }
            } else {
                temp = {
                    userId: item.userId,
                    userName: item.userName,
                    saleAmt: 0,
                    salesPersons: item.planPreNum
                };
            }
            requestList.push(temp);
        }
        if(errorFlag) {
            return;
        }

        lf.nativeUI.showWaiting();
        lf.net.getJSON("/purchaser/setChannelInfo", {
            achievementsSetList: requestList
        }, function(res) {
            lf.nativeUI.closeWaiting();
            if(res.code == 200) {
                lf.nativeUI.toast("保存成功");
                refreshParentView();
            } else {
                lf.nativeUI.toast(res.msg);
            }
        }, function(erro) {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(erro.msg);
        })

        function refreshParentView() {
            lf.event.fire(lf.window.currentWebview().opener(), 'refreshData', {})
        }
    });
});