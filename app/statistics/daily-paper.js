
lf.ready(function() {
    var pageTypeConstant = {
        income: 'income',
        flow: 'flow',
        history: 'history'
    }
    var vm = new Vue({
        el: '#app',
        data: {
            username: '',
            rolePositionList: [],
            rolePositionId: '',
            //当前用户角色id
            currentRoleId: '',
            //版本号
            wgtVer: '',
            //大区省份code
            regionProvinceActive: '',
            regionProvinceMap: {
                incomeAll: {
                    areaCode: '',
                    areaName: '',
                    provinceCode: '',
                    provinceName: ''
                },
                incomeRegion: {
                    areaCode: '',
                    areaName: '',
                    provinceCode: '',
                    provinceName: ''
                },
                flowShootAll: {
                    areaCode: '',
                    areaName: '',
                    provinceCode: '',
                    provinceName: ''
                },
                flowShootRegion: {
                    areaCode: '',
                    areaName: '',
                    provinceCode: '',
                    provinceName: ''
                },
                historyThreeMonthIncome: {
                    areaCode: '',
                    areaName: '',
                    provinceCode: '',
                    provinceName: ''
                }
            },
            /*收入模块 start*/
            // 统计汇总
            incomeTotal: {
                saleAmt: '',//	今日收入
                saleAmtRate: '',//	今日收入涨幅
                saleAmtPer: '',//	前置金额
                saleAmtPerRate: '',//	前置金额涨幅
                appAmt: '',//	销售金额
                appAmtRate: ''//	销售金额涨幅
            },
            //线路产品收入
            /*lineName	线路名称
             saleAmt	收入金额*/
            incomeLine: [],
            //旅行社收入转化
            /*travelName	旅行社名称
             saleAmt	收入金额*/
            incomeTravel: [],
            //全国收入（实时）
            /*hour	小时
             saleAmt	收入金额*/
            incomeAll: [],
            //各大区收入
            /*areaName	大区名称
             saleAmt	收入金额*/
            incomeRegion: [],
            /*收入模块 end*/
            /*流量模块 start*/
            //拍摄统计
            flowShootInfo: {
                shootPerples: '',//	今日拍摄人数
                shootPerplesRate: ''//	拍摄人数涨幅
            },
            //线路产品拍摄人数
            /*lineName	线路名称
             shootPerples	拍摄人数*/
            flowShootLine: [],
            //旅行社拍摄人数
            /*travelName	旅行社名称
             shootPerples	拍摄人数*/
            flowShootTravel: [],
            //全国拍摄人数实时
            /*hour	小时
             shootPerples	拍摄人数*/
            flowShootAll: [],
            //大区拍摄人数(实时)
            /*areaName	大区名称
             shootPerples	拍摄人数*/
            flowShootRegion: [],
            /*流量模块 end*/
            /*历史模块 start*/
            //累计收入
            historyIncomeTotal: {
                saleAmt: '',//	累计收入
                saleAmtPer: '',//	前置收入
                appAmt: ''//	销售收入
            },
            //近30天每日收入
            /*date	日期
             saleAmt	收入金额*/
            historyIncomeDay: [],
            //近3个月收入统计
            /*date	日期
             totalAmt	总收入
             amtRate	涨幅*/
            historyThreeMonthIncome: [],
            //累计拍摄人数
            historyShootCount: {
                shoot: ''//	累计拍摄人数
            },
            //近30天拍摄人数
            /*date	日期
             shoot	拍摄人数*/
            historyShootDay: [],
            //旅行社发团人数排行
            /*travelName	旅行社名称
             peoples	人数*/
            historyTravelRanking: []
            /*历史模块 end*/
        },
        computed:{
            incomeAllTitle: function () {
                return getRegionProvince(this.regionProvinceMap.incomeAll, '全国') + '收入（实时）'
            },
            incomeRegionTitle: function () {
                return getRegionProvince(this.regionProvinceMap.incomeRegion, '各大区') + '收入（实时排行）'
            },
            flowShootAllTitle: function () {
                return getRegionProvince(this.regionProvinceMap.flowShootAll, '全国拍摄人数') + '（实时）'
            },
            flowShootRegionTitle: function () {
                return getRegionProvince(this.regionProvinceMap.flowShootRegion, '大区拍摄人数') + '收入 （实时）'
            },
            historyThreeMonthIncomeTitle: function () {
                return '近三月收入统计'
            },
        },
        watch: {
            rolePositionId: function(val, oldVal) {
                if (oldVal === '') return
                switchRolePostion(val)
            }
        },
        methods: {
            /*下拉数据*/
            //查询大区省份列表
            refreshDataByQueryRegionProvince: function () {
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/queryRegion.htm', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        console.log(JSON.stringify(res.data));
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*收入模块 start*/
            initIncome: function () {
                this.refreshDataByIncome()
                this.refreshDataByIncomeAll()
                this.refreshDataByIncomeRegion()
            },
            //收入统计
            refreshDataByIncome: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/income.htm', {}, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.incomeTotal = data.incomeTotal || {}
                        self.incomeLine = data.incomeLine || []
                        self.incomeTravel = data.incomeTravel || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //全国收入（实时）
            refreshDataByIncomeAll: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/incomeAll.htm', {
                    areaCode: '',
                    provinceCode: ''
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.incomeAll = res.data || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //各大区收入
            refreshDataByIncomeRegion: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/incomeRegion.htm', {
                    areaCode: '',
                    provinceCode: ''
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.incomeRegion = res.data || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*收入模块 end*/
            /*流量模块 start*/
            initFlow: function () {
                this.refreshDataByShoot()
                this.refreshDataByShootAll()
                this.refreshDataByShootRegion()
            },
            //拍摄信息统计
            refreshDataByShoot: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shoot.htm', {}, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.flowShootInfo = data.shootInfo || {}
                        self.flowShootLine = data.shootLine || []
                        self.flowShootTravel = data.shootTravel || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //全国拍摄人数实时
            refreshDataByShootAll: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shootAll.htm', {
                    areaCode: '',
                    provinceCode: ''
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.flowShootAll = res.data || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //大区拍摄人数(实时)
            refreshDataByShootRegion: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shootRegion.htm', {
                    areaCode: '',
                    provinceCode: ''
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.flowShootRegion = res.data || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*流量模块 end*/
            /*历史模块 start*/
            initHistory: function () {
                this.refreshDataByHistoryIncome()
                this.refreshDataByThreeMonthIncome()
                this.refreshDataByHistoryShoot()
            },
            //累计收入
            refreshDataByHistoryIncome: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/historyIncome.htm', {}, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyIncomeTotal = data.incomeTotal || {}
                        self.historyIncomeDay = data.incomeDay || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //近3个月收入统计
            refreshDataByThreeMonthIncome: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/threeMonthIncome.htm', {
                    areaCode: '',
                    provinceCode: ''
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyThreeMonthIncome = res.data || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //累计拍摄人数
            refreshDataByHistoryShoot: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/historyShoot.htm', {}, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyShootCount = data.shootCount || {}
                        self.historyShootDay = data.shootDay || []
                        self.historyTravelRanking = data.travelRanking || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(error.msg);
                });
            }
            /*历史模块 end*/
        }
    })

    if (window.Role.currentPositions.length > 0) {
        vm.currentRoleId = window.Role.currentPositions[0].roleId;
        console.log("当前用户的角色id" + vm.currentRoleId)
    }
    vm.rolePositionId = window.Role.userroleId // 岗位id
    vm.username = window.Role.username // 用户昵称
    vm.rolePositionList = window.Role.positions // 岗位列表
    console.log(JSON.stringify(vm.rolePositionList))

    // 获取大区省份
    function getRegionProvince(options, text) {
        var ret = options.areaName || ''
        if (ret && options.provinceName) {
            ret += options.provinceName
        }
        return ret || text
    }
    // 小数转为百分比
    function toPercent(point){
        var str=Number(point*100).toFixed(2);
        str+="%";
        return str;
    }
    // 初始化数据
    function init() {
    }

    Vue.nextTick(function() {
        init();
    })
    mui.os.plus && update()
    mui.os.plus && getVersion()
    var deceleration = mui.os.ios ? 0.003 : 0.0009;
    mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, //是否显示滚动条
        deceleration: deceleration
    });
    // 收入
    mui("body").on("tap", "#income", function(){
    })
    // 流量
    mui("body").on("tap", "#flow", function(){

    })
    // 历史
    mui("body").on("tap", "#history", function(){

    })
    // 退出登录
    mui('body').on('tap', '#logout', function() {
        lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
            if (e.index == 0) {
                window.Role.logout();
                plus && plus.runtime.restart();
            }
        });
    })
    lf.event.listener('dailyPaper', function(e) {
        init();
        lf.event.fire(lf.window.currentWebview().opener(), 'dailyPaper', {})
    })
})

// 岗位切换
function switchRolePostion(val) {
    var params = {
        positionId: val
    };
    console.log(val)
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
            init()
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