var vm = new Vue({
    el: '#app',
    components: {
        ECharts: VueECharts
    },
    data: function(){
        return {
            planCompletedList: [],
            monthAmount: '',
            monthPlanAmt: ''
        }
    },
    computed: {
        completeRate: function() {
            if(this.monthPlanAmt == 0 || this.monthAmount == null) {
                return "0.00%";
            }
            if(this.monthAmount == 0 || this.monthAmount == null) {
                return "0.00%";
            }
            return (this.monthAmount/this.monthPlanAmt * 100).toFixed(2) + "%";
        },
        chartOptions: function() {
            var that = this;
            var completeAmount = this.monthAmount;
            var restAmount = this.monthPlanAmt - this.monthAmount;
            if(completeAmount > 0) {
                if(restAmount < 0) {
                    // 超额完成
                    restAmount = 0;
                }
            } else {
                // 完成数 为0
                restAmount = 1;
                completeAmount = 0;
            }
            return {
                series: [
                    {
                        type:'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: false,
                            }
                        },
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        data:[
                            {
                                value: completeAmount,
                                name:'已完成',
                                itemStyle: {
                                    normal: {
                                        color: "#3eb392"
                                    }
                                },
                                label: {
                                    normal: {
                                        show: true,
                                        position: 'center',
                                        formatter: '{d}%'
                                    }
                                },
                            },
                            {
                                value: restAmount,
                                name:'未完成',
                                itemStyle: {
                                    normal: {
                                        color: "#b5b5b5"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        }
    }
});

lf.ready(function() {
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
                vm.monthAmount = resData.monthAmount || 0;
                vm.planCompletedList = resData.dailyList;
                vm.monthPlanAmt = resData.monthPlanAmt || 0;
            } else {
            }
        } else {
            lf.nativeUI.toast(res.msg);
        }
    }, function(erro) {
        lf.nativeUI.closeWaiting();
        lf.nativeUI.toast(erro.msg);
    })

    mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: mui.os.ios ? 0.003 : 0.0009
    });

    lf.event.listener('refreshData', function(e) {
        lf.window.currentWebview().reload()
        refreshParentView();
    })

    function refreshParentView() {
        lf.event.fire(lf.window.currentWebview().opener(), 'refreshData', {})
    }
    
    mui('body').on('tap', '#reAllocate', function() {
        lf.window.openWindow('allocate-task','./allocate-task.html',{},{
        })
    });
})