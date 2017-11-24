import ExpansionCompletedSummary from "@/component/market-expansion/expansion-completed-summary.vue";
import userPositionInfoMinix from "@/component/market-expansion/common/userPositionInfo";

Vue.filter('dayFormatter', function(date){
    var dayArr = ['日', '一', '二', '三', '四', '五', '六'];
    var timeStamp = new Date(date);
    return timeStamp.format('yyyy-MM-dd') + ' 星期' + dayArr[timeStamp.getDay()];
});
var vm = new Vue({
    el: "#app",
    mixins: [userPositionInfoMinix],
    components: {
        ExpansionCompletedSummary
    },
    data: function() {
        return {
            date: {
                dateText: new Date().format('yyyy-MM-dd'),
            },
            planCompletedList: [],
            monthAmount: '',
            monthPlanAmt: ''
        }
    },
    methods: {
        detailClick:function() {
            alert(1);
        }
    },
    watch: {
		rolePositionId: function(val, oldVal) {
			if (oldVal == '') return
			switchRolePostion(val)
		}
	}
})

function Watcher() {
    this._subs = [];
}
Watcher.prototype = {
    addSub: function(sub) {
        this._subs.push(sub);
    },
    notify: function(date) {
        this._subs.forEach(function(sub) {
            sub.update(date);
        });
    }
}

var subVm = {
    update: function(date){
        Vue.set(vm.date, 'dateText', date);
    }
}

var planCompleted = {
    setData: function(data){
        vm.planCompletedList = data.dailyList;
        vm.monthAmount = data.monthAmount || 0;
        vm.monthPlanAmt = data.monthPlanAmt || 0;
    },
    update: function(date) {
        this.getDataByDate(date);
    },
    getDataByDate: function(date){
        var params = {
            startDate: date
        };
        var that = this;
        lf.nativeUI.showWaiting();
        lf.net.getJSON('/report/newAnalysis/channelPlanDetail', params, function(res){
            lf.nativeUI.closeWaiting();
            if(res.code == 200) {
                var resData = res.data;
                if(resData) {
                    if(resData.dailyList.length == 0) {
                        lf.nativeUI.toast('没有详细数据');
                    }
                    that.setData(resData);
                } else {
                }
            } else {
                lf.nativeUI.toast(res.msg);
            }
        }, function(erro) {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(erro.msg);
        })
    }
};

var dateWatcher = new Watcher();
dateWatcher.addSub(planCompleted);
dateWatcher.addSub(subVm);

var dateSelector = {
    dayMillionSeconds: 24 * 60 * 60 * 1000,
    dayStart: function(day){
        var result = new Date(day);
        result.setHours(0);
        result.setMinutes(0);
        result.setSeconds(0);
        result.setMilliseconds(0);
        return result;
    },
    _value: '',
    getValue: function(){
        return this._value;
    },
    setValue: function(date) {
        this._value = date;
        dateWatcher.notify(this._value);
    },
    pre: function(){
        if((new Date(this._value).getTime() - new Date('2017-06-01').getTime()) < this.dayMillionSeconds) {
            lf.nativeUI.toast('已是最早日期');
            return;
        }
        var value = new Date(new Date(this._value).getTime() - this.dayMillionSeconds).format('yyyy-MM-dd');
        this.setValue(value);
    },
    next: function(){
        // 现今日期的 00:00:00 与 时间选择器日期的 00:00:00 的 差值
        var timeDistance = this.dayStart(new Date()).getTime() - this.dayStart(new Date(this._value).getTime());
        if(timeDistance  === 0) {
            lf.nativeUI.toast('已是最新日期');
            return false;
        } else {
            var value = new Date(new Date(this._value).getTime() + this.dayMillionSeconds).format('yyyy-MM-dd');
            this.setValue(value);
        }
    },
    hasNext: function() {
        var timeDistance = this.dayStart(new Date()).getTime() - this.dayStart(new Date(this._value).getTime());
        if(timeDistance  === 0) {
            return false;
        } else {
            return true;
        }
    }
}

var dtPicker = new mui.DtPicker({
    type: 'date',
    value: '2017-01-01',
    beginDate: new Date('2017-06-01'),
    endDate: new Date()
});

function initPage() {
    dateSelector.setValue(new Date().format('yyyy-MM-dd'));
}

// 岗位切换
function switchRolePostion(val) {
    GLOBAL_SHOOT.switchPosition(val, function() {
        var roleId = window.Role.currentPositions[0].roleId;
        var windowParams = GLOBAL_SHOOT.getPageUrlWithPosition(roleId, 1);
        if(windowParams) {
            GLOBAL_SHOOT.switchPositionOpenWindow(windowParams.windowId,windowParams.pageUrl,{},{},lf.window.currentWebview())
        } else {
            GLOBAL_SHOOT.switchPositionOpenWindow('order','../order/orderlist.html',{},{},lf.window.currentWebview())
        }
    })
}

lf.ready(function() {
    // 检查版本更新
    GLOBAL_SHOOT.update()
    // 设置版本号
    GLOBAL_SHOOT.setVersion(vm)

    mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: mui.os.ios ? 0.003 : 0.0009
    });
    
    vm.rolePositionId = window.Role.userroleId // 岗位id
	vm.username = window.Role.username // 用户昵称
    vm.rolePositionList = window.Role.positions // 岗位列表
    
    mui('body').on('tap', '#dateSelected', function(){
        dtPicker.setSelectedValue(new Date(dateSelector.getValue()).format('yyyy-MM-dd'));
        dtPicker.show(function(selectedItem) {
            dateSelector.setValue(selectedItem.text);
        });
    });
    mui('body').on('tap', '#preDay', function(){
        dateSelector.pre();
    });
    mui('body').on('tap', '#nextDay', function(){
        dateSelector.next();
    });
    mui('body').on('tap', '#missionProgress', function() {
        var date = this.getAttribute('data-date');
        lf.window.openWindow('monthly-expect','./monthly-expect.html',{},{
        })        
    });

    mui('body').on('tap', '.check-section-2', function() {
        var userId = this.getAttribute('data-userid');
        var date = this.getAttribute('data-date');
        var userName = this.getAttribute('data-user-name');
        lf.window.openWindow('person-daily-detail','./person-daily-detail.html',{},{
            userId: userId,
            date: date,
            userName: userName
        })
    });

    // 跳转到 渠道关系列表
    mui('body').on('tap', '.edit-relation', function() {
        var date = this.getAttribute('data-date');
        lf.window.openWindow('market-staff-relation.html','./market-staff-relation.html',{},{
        })        
    });

    // 退出登录
	mui('body').on('tap', '#logout', function() {
		lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
			if(e.index == 0) {
				window.Role.logout();
				// lf.window.openWindow('login','../login.html',{},{})
				GLOBAL_SHOOT.restart();
			}
		});
    })
    
    lf.event.listener('refreshData', function(e) {
        lf.window.currentWebview().reload()
    })
    
    initPage();
})