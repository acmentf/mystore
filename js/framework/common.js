var deviceWidth = document.documentElement.clientWidth
//if(deviceWidth > 640) deviceWidth = 640
document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
window.onresize = function() {
	var deviceWidth = document.documentElement.clientWidth
//	if(deviceWidth > 640) deviceWidth = 640
	document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
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
    },
    // 岗位切换
    switchPosition: function(roleId, cb) {
        var params = {
            positionId: roleId
        };
        lf.nativeUI.showWaiting();
        lf.net.getJSON('user/switchPosition', params, function(data) {
            lf.nativeUI.closeWaiting();        
            if(data.code == 200) {
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
    
                if(cb && typeof cb == "function") {
                    cb();
                }
    
            } else {
                lf.nativeUI.closeWaiting();
                lf.nativeUI.toast(data.msg);
            }
        }, function(erro) {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(erro.msg);
        })
    },
    /**
     * 用户切换 岗位，根据 roleId，以及 目录层级 返回相应的跳转参数
     * @param {number} roleId 用户角色id
     * @param {number} dirLevel 当前页面相对于 app/ 目录的层级，
     * 例：
     * login.html 位于 app/ 下， 相对于 app/* 目录同级，则 dirLevel 值为 0；
     * orderlist.html 位于 app/order 下， 相对于 app/* 为子级目录，dirLevel 值为 1；
     */
    getPageUrlWithPosition: function(roleId, dirLevel) {
        // 由于correlate-order 及 orderlist 里的跳转关系混乱，所以不在当前文件做页面跳转，
        // 该文件只返回根据 roleId 以及 目录层级 返回 相应的映射 具体跳转参数，
        // 没有对应映射的，单独在调用页面作特殊处理

        //角色 id 枚举
        var ROLE_EMUN = {
            // 角色：总经办，页面：daily-paper(日报)
            "15": {
                id: 15,
                windowId: 'office-manager',
                pageUrl: 'statistics/daily-paper.html',
            },
            // 角色：渠道人员，页面：market-expansion(渠道人员日报)
            "16": {
                id: 16,
                windowId: 'market-expansion',
                pageUrl: 'market-expansion/market-expansion.html',
            },
            // 角色：渠道经理，页面：manager-daily(渠道经理日报)
            "17" : {
                id: '',
                windowId: 'market-manager-daily',
                pageUrl: 'market-expansion/manager-daily.html'
            },
            // 角色：城市经理，页面：daily-manage(城市日报)
            "12": {
                id: 12,
                windowId: 'daily-manage',
                pageUrl: 'daily-manage/daily-manage.html'
            }
        };


        try {
            if(dirLevel < 0) {
                // 目录层级不能为负数
                throw 'dirLevel: 为 ' + dirLevel + ' ,dirLevel 不能为负数';
            }
        } catch(err) {
            throw err;
        }
        if(typeof ROLE_EMUN[roleId] == 'undefined') {
            // 角色id 不在 ROLE_EMUN 枚举中
            return false;
        }
        var pageUrl = (function(level){
            if(level == 0) {
                return './' + ROLE_EMUN[roleId].pageUrl;
            } else if (level > 0) {
                var temp = '';
                for(var i = 0; i < level; i++) {
                    temp = temp.concat('../');
                }
                return temp + ROLE_EMUN[roleId].pageUrl;
            }
        }(dirLevel));
        return {
            windowId: ROLE_EMUN[roleId].windowId,
            pageUrl: pageUrl
        }
    },
    /**
     * 登录系统后，打开页面，由于，closeW 在 app 和 h5 里，要 关闭的closeW 不一样
     */
    loginOpenPage: function(windowId, pageUrl, styleConfig, windowParams) {
        var closeW;
        if(mui.os.plus) {
            closeW = lf.window.currentWebview();
        } else {
            closeW = 'login';
        }
        this.switchPositionOpenWindow(windowId, pageUrl, styleConfig, windowParams, closeW);
    },
    /**
     * 切换岗位，打开新页面
     * app 端在切换岗位时需要关闭当前的 WebView
     * h5 端在登录时要关闭掉 'login'
     */
    switchPositionOpenWindow: (function(windowId, pageUrl, styleConfig, windowParams, closeW) {
        if(mui.os.plus) {
            // app 端
            lf.window._openWindow(windowId, pageUrl, styleConfig || {}, windowParams || {}, closeW || lf.window.currentWebview());
        } else {
            // h5 端
            lf.window.openWindow(windowId, pageUrl, styleConfig || {}, windowParams || {}, closeW);
        }
    })
}

var Utils = {
    isApp: function(){
        return !!mui.os.plus;
    },
    getPageParams: function(windowId) {
        if(this.isApp()) {
            return lf.window.currentWebview();
        } else {
            return lf.window.getPageParams("getPageParams");
        }
    },
    RoleLogout: function() {
        if(this.isApp()) {
            plus.runtime.restart();
        } else {
            lf.window.openWindow('login','../login.html',{},{});
        }
    },
    getClientId: function() {
        if(this.isApp()) {
            return plus.push.getClientInfo().clientid;
        } else {
            return 'H5';
        }
    },
    closeSplashscreen: function() {
        if(this.isApp()) {
            plus.plus.navigator.closeSplashscreen();
        } else {
            return ;
        }
    }
}