var vm = new Vue({
    el: '#app',
    data: {
        username: '',
        rolePositionList: [],
        rolePositionId: '',
		currentRoleId: '', //当前用户角色id,
		todayDate: '', // 今天的日期
		todayData: {}, // 今天的数据
		futureData: [], // 未来三天的数据
		wgtVer: '', //版本号
    },
    watch: {
		rolePositionId: function(val, oldVal) {
			if (oldVal == '') return
			switchRolePostion(val)
		}
	}
})

lf.ready(function() {
	// 检查版本更新
    GLOBAL_SHOOT.update()
    // 设置版本号
    GLOBAL_SHOOT.setVersion(vm)
    if (window.Role.currentPositions.length > 0) {
        vm.currentRoleId = window.Role.currentPositions[0].roleId;
        console.log("当前用户的角色id" + vm.currentRoleId)
    }
    vm.rolePositionId = window.Role.userroleId // 岗位id
    vm.username = window.Role.username // 用户昵称
    vm.rolePositionList = window.Role.positions // 岗位列表

	console.log(vm.rolePositionList)
    Vue.nextTick(function() {
        init();
    })
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	// 刷新
	mui("body").on("tap", "#refresh", function(){
		init()
	})
	mui("body").on("tap", "#detail", function(){
		lf.window.openWindow('daily-detail', "daily-detail.html", {}, {
			todayDate: vm.todayDate
		});
	})
	// 填报计划
	mui("body").on('tap', ".planBtn", function() {
		lf.window.openWindow('daily-plan', "daily-plan.html", {}, {});
	})
	// 搜索日报
	mui("body").on("tap", "#search", function(){
		lf.window.openWindow('daily-search', "daily-search.html",{},{
			todayDate: vm.todayDate
		})
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
	// 点击通讯录
	mui("body").on("tap", "#link-to-address-book", function(){
		var redirect = '../../assets/webim/index.html#/?username=' + window.Role.usercode;
		lf.window._openWindow(redirect, redirect,{},{},lf.window.currentWebview());
	});
	// 退出登录
	mui('body').on('tap', '#logout', function() {
		lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
			if (e.index == 0) {
				window.Role.logout();
				GLOBAL_SHOOT.restart();
			}
		});
	})
	lf.event.listener('dailyManage', function(e) {
        init();
        lf.event.fire(lf.window.currentWebview().opener(), 'dailyManage', {})
    })
})
// 初始化数据
function init() {
	var params = {
		searchType:"today"
	}
	lf.nativeUI.showWaiting()
	lf.net.getJSON('plan/getDailyPlan.htm', params, function(res) {
		lf.nativeUI.closeWaiting()
		if (res.code == 200) {
			console.log(res.data);
			var list = res.data
			vm.todayDate = list[0].planDate
			list.sort(function(a,b){
                return a.planDate - b.planDate
            })
			for(var i=0;i<list.length;i++){
				list[i].planDate = lf.util.timeStampToDate2(list[i].planDate)
				if (list[i].planAmount > 0) {
                    list[i]["proportionAmount"] = toPercent(list[i].appAmt / list[i].planAmount);
                } else {
                    list[i]["proportionAmount"] = '0.00%';
				}
				
                if( list[i].planPersons > 0 ){
					list[i]["proportionCoverage"] = toPercent(list[i].realityShootNums / list[i].planPersons);
				} else {
					list[i]["proportionCoverage"] = '0.00%';
				}
			}
			vm.todayData = list.shift()
			vm.futureData = list
		} else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(error) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(error.msg);
	});
}
// 岗位切换
function switchRolePostion(val) {
    GLOBAL_SHOOT.switchPosition(val, function() {
        var roleId = window.Role.currentPositions[0].roleId;
		var windowParams = GLOBAL_SHOOT.getPageUrlWithPosition(roleId, 1);
		if(windowParams) {
			GLOBAL_SHOOT.switchPositionOpenWindow(windowParams.windowId,windowParams.pageUrl,{},{},lf.window.currentWebview());
		} else {
			GLOBAL_SHOOT.switchPositionOpenWindow('order','../order/orderlist.html',{},{},lf.window.currentWebview());
		}
		init()		
    })
}
// 小数转为百分比
function toPercent(point){
    var str=Number(point*100).toFixed(2);
    str+="%";
    return str;
}