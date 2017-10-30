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
    if(value) {
        return Number(value).toFixed(2);
    } else {
        if(value === 0) {
            return Number(value).toFixed(2);
        } else {
            return ''
        }
    }
});
Vue.filter('lengthTo8', function(value){
    if(value) {
        if(value.length > 7) {
            return value.substr(0, 7) +'...'
        } else {
            return value
        }
    }
});

var vm = new Vue({
    el: '#app',
    data() {
        return {
            date: {
                dateText: new Date().format('yyyy-MM-dd'),
            },
            planCompletedDetail: {
                peopleComletionRate: 0,
                completedPeople: 0,
                planPeople: 0,
                amountComletionRate: 0,
                completedAmount: 0,
                planAmount: 0,
            },
            planList: [
                {
                    planTime: 0,
                    planPreAmount: 0,
                    planPreNum: 0,
                    remark: ''
                }
            ],
            username: '',
            rolePositionList: [],
            rolePositionId: '',
            currentRoleId:'',//当前用户角色id,
            wgtVer: '1.4.6'
        }
    },
    watch: {
		rolePositionId: function(val, oldVal) {
			if (oldVal == '') return
			switchRolePostion(val)
		}
	}
});

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

var planCompletedRatio = {
    setData: function(data){
        for(var attr in data) {
            Vue.set(vm.planCompletedDetail, attr, data[attr]);
        }
    },
    update: function(date) {
        this.getDataByDate(date);
    },
    getDataByDate: function(date){
        var params = {
            startDate: date,
            endDate: date
        };
        var that = this;
        lf.net.getJSON('/report/newAnalysis/dtPlannedComletionRate', params, function(res){
            if(res.code == 200) {
                var resData = res.data.dataList[0].list[0];
                if(resData) {
                    that.setData(resData);
                } else {
                }
            } else {
                lf.nativeUI.toast(res.msg);
            }
        })
    }
};

var dateWatcher = new Watcher();
dateWatcher.addSub(planCompletedRatio);
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
    // 获取计划列表
    lf.nativeUI.showWaiting()
    // lf.net.getJSON('/purchaserPlan/getPlanThree.htm', {
    lf.net.getJSON('/purchaser/getPurchaserPlan', {
        userId: window.Role.usercode,
        date: new Date().format('yyyy-MM-dd')
    }, function(res) {
        lf.nativeUI.closeWaiting();
        if(res.code == 200) {
            vm.planList = res.data;
        } else {
            lf.nativeUI.toast(res.msg);
        }
    })
}

// 岗位切换
function switchRolePostion(val) {
    var params = {
        positionId: val
    };
    lf.nativeUI.showWaiting();
    lf.net.getJSON('user/switchPosition', params, function(data) {
        console.log(JSON.stringify(data));
        if(data.code == 200) {
            lf.nativeUI.closeWaiting();
            var obj = {
                usercode: data.data.id,
                username: data.data.name,
                phone: data.data.phone,
                companyId: data.data.companyId,
                userrole: data.data.positions[0].type,
                userroleName: data.data.positions[0].name,
                userroleId: data.data.positions[0].id,
                tonken: data.data.token,
                loginsign: '1',
                auths: data.data.auths,
                positions: data.data.userPositionList,
                currentPositions: data.data.positions,
                photograherId: data.data.photograherId
            }
            window.Role.save(obj)
            lf.nativeUI.toast('切换岗位成功');

            var windowCurrentPositionRoleId = window.Role.currentPositions[0].roleId;
            
            if(windowCurrentPositionRoleId == ROLE_EMUN.cityManager.id) {
                // 城市经理
                lf.window.openWindow(ROLE_EMUN.cityManager.windowId, '../' + ROLE_EMUN.cityManager.pageUrl,{},{},lf.window.currentWebview());
            } else if (windowCurrentPositionRoleId == ROLE_EMUN.commissioner.id) {
                // 渠道 
                // lf.window.openWindow(ROLE_EMUN.commissioner.windowId, ROLE_EMUN.commissioner.pageUrl,{},{});
            } else if (windowCurrentPositionRoleId == ROLE_EMUN.officeManager.id) {
                //总经办
                lf.window.openWindow(ROLE_EMUN.officeManager.windowId, '../' + ROLE_EMUN.officeManager.pageUrl,{},{},lf.window.currentWebview());
            } else {
                lf.window.openWindow('order','../order/orderlist.html',{},{},lf.window.currentWebview());
            }

            // if (window.Role.currentPositions[0].roleId!=12) {
            //     lf.window.openWindow('order','../order/orderlist.html',{},{})
            // }
        } else {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(data.msg);
        }
    }, function(erro) {
        lf.nativeUI.closeWaiting();
        lf.nativeUI.toast(erro.msg);
    })
}

lf.ready(function() {
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
    mui('body').on('tap', '#toExpansionPlan', function() {
        lf.window.openWindow('expansion-plan','../market-expansion/expansion-plan.html',{},{})        
    });

    mui('body').on('tap', '.section-2', function() {
        lf.window.openWindow('group-plan-completion','../market-expansion/group-plan-completion.html',{},{
            date: dateSelector.getValue()
        })
    });

    // 退出登录
	mui('body').on('tap', '#logout', function() {
		lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
			if(e.index == 0) {
				window.Role.logout();
				lf.window.openWindow('login','../login.html',{},{})
				// plus.runtime.restart();
			}
		});
	})


    
    initPage();
    
})