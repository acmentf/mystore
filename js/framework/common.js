var deviceWidth = document.documentElement.clientWidth
//if(deviceWidth > 640) deviceWidth = 640
document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
window.onresize = function() {
	var deviceWidth = document.documentElement.clientWidth
//	if(deviceWidth > 640) deviceWidth = 640
	document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
}

//角色 id 枚举
var ROLE_EMUN = {
    // 总经办
    officeManager: {
        id: 15,
        windowId: 'officeManager',
        pageUrl: 'statistics/daily-paper.html',
        // pageUrl: 'market-expansion/market-expansion.html',
    },
    // 渠道
    commissioner: {
        id: 16,
        windowId: 'market-expansion',
        pageUrl: 'market-expansion/market-expansion.html',
    },
    // 城市经理
    cityManager: {
        id: 12,
        windowId: 'daily-manage',
        pageUrl: 'daily-manage/daily-manage.html'
    }
}

// 全局共用对象
var GLOBAL_SHOOT = {
    // 得到版本
    setVersion: function (vm) {
        if (mui.os.plus) {
            plus.runtime.getProperty(plus.runtime.appid,function(inf){
                vm.wgtVer = inf.version;
                console.log("当前应用版本：" + vm.wgtVer);
            })
        } else {
            vm.wgtVer = '1.4.9'
        }
    },
    // 检测版本是否更新
    update: function () {
        if (mui.os.plus) {
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
    }
}