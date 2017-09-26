var vm = new Vue({
    el: '#app',
    data: {
        username: '',
        rolePositionList: [],
        rolePositionId: '',
		currentRoleId: '', //当前用户角色id,
		todayDate: '',
		todayData: {},
		futureData: [],
		wgtVer: '', //版本号
		hide: true
    },
    watch: {
		rolePositionId: function(val, oldVal) {
			if (oldVal == '') return
			switchRolePostion(val)
		}
	}
})

lf.ready(function() {
    if (window.Role.currentPositions.length > 0) {
        vm.currentRoleId = window.Role.currentPositions[0].roleId;
        console.log("当前用户的角色id" + vm.currentRoleId)
    }
    vm.rolePositionId = window.Role.userroleId // 岗位id
    vm.username = window.Role.username // 用户昵称
    vm.rolePositionList = window.Role.positions // 岗位列表

    console.log(JSON.stringify(vm.rolePositionList))
    Vue.nextTick(function() {
        init();
    })
    update()
	getVersion()
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
	// 点击更多信息
	mui("body").on("tap", ".more", function() {
		vm.hide = false
	})
	// 填报计划
	mui("body").on('tap', ".planBtn", function() {
		lf.window.openWindow('daily-plan', "daily-plan.html",{},{})
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
	// 退出登录
	mui('body').on('tap', '#logout', function() {
		lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
			if (e.index == 0) {
				window.Role.logout();
				plus.runtime.restart();
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
			console.log(JSON.stringify(res.data));
			var list = res.data
			vm.todayDate = list[0].planDate
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
            if (window.Role.currentPositions[0].roleId!=12) {
                lf.window.openWindow('order','../order/orderlist.html',{},{},lf.window.currentWebview())
            }
		} else {
			lf.nativeUI.closeWaiting();
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.closeWaiting();
		lf.nativeUI.toast(erro.msg);
	})
}
// 检测版本是否更新
function update() {
	var params = {
		"app_id": plus.runtime.appid,
		"version": plus.runtime.version,
		"imei": plus.device.imei,
		"platform": plus.os.name
	};
	lf.net.getJSON("/app/validationversion", params, function(data) {
		var update_desc = "发现新的版本，是否需要立即更新";
		if(data.code == 200) {
			var btns = null;
			console.log(data.data.releaseUrl)
			if(data.data.isMandatory == 1) {
				update_desc = "发现新的版本，请立即更新";
				btns = ["立即更新"];
			} else {
				btns = ["立即更新", "取　　消"];
			}
			if(data.data.upgrade_desc) {
				update_desc = update_desc + "\n" + data.data.releaseRemark;
			}
			lf.nativeUI.confirm("", update_desc, btns, function(e) {
				if(btns.length == 1) {
					if(0 == e.index) {
						plus.runtime.openURL(data.data.releaseUrl);
						lf.window.closeCurrentWebview();
					} else {
						plus.runtime.quit();
					}
				} else {
					if(0 == e.index) {
						plus.runtime.openURL(data.data.releaseUrl);
						lf.window.closeCurrentWebview();
					} else {}
				}
			});
		}
	}, function(res) {});
}
// 得到版本
function getVersion() {
	plus.runtime.getProperty(plus.runtime.appid,function(inf){
        vm.wgtVer = inf.version;
        console.log("当前应用版本：" + vm.wgtVer);
    });
}
// 小数转为百分比
function toPercent(point){
    var str=Number(point*100).toFixed(2);
    str+="%";
    return str;
}