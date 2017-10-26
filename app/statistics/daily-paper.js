
lf.ready(function() {
    var pageTypeConstant = {
        income: 'income',
        flow: 'flow',
        history: 'history'
    }
    //大区省份选择
    var cityPicker = new $.PopPicker({
        layer: 2
    })
    var EACH_SCREEN_COUNT = 6
    var emptyChart = {series: []}
    var vm = new Vue({
        el: '#app',
        components: {
            ECharts: VueECharts
        },
        data: {
            username: '',
            rolePositionList: [],
            rolePositionId: '',
            //当前用户角色id
            currentRoleId: '',
            //版本号
            wgtVer: '',
            //激活模块
            pageTypeActive: pageTypeConstant.income && 'test',
            //定时器
            intervalMap: {
                timeout: null,
                startIndex: {
                    incomeLine: 0,
                    incomeTravel: 0,
                    incomeAll: 0,
                    incomeRegion: 0,
                    flowShootLine: 0,
                    flowShootTravel: 0,
                    flowShootAll: 0,
                    flowShootRegion: 0,
                    historyIncomeDay: 0,
                    historyShootDay: 0
                }
            },
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
            regionProvinceList: [],
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
            pageTypeConstant: function () {
                return pageTypeConstant
            },
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
            incomeLineChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.incomeLine, this.intervalMap.startIndex.incomeLine)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.saleAmt
                    xAxisData.push(item.lineName)
                    seriesData.push(value)
                })
                series.push({
                    name: '收入',
                    type: 'bar',
                    barMaxWidth: 30,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5,
                        bottom: 120
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        },
                        data: xAxisData
                    },
                    series: series
                }
            },
            incomeTravelChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.incomeTravel, this.intervalMap.startIndex.incomeTravel)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.saleAmt
                    xAxisData.push(item.travelName)
                    seriesData.push(value)
                })
                series.push({
                    name: '收入',
                    type: 'bar',
                    barMaxWidth: 30,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5,
                        bottom: 120
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        },
                        data: xAxisData
                    },
                    series: series
                }
            },
            incomeAllChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.incomeAll, this.intervalMap.startIndex.incomeAll)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.saleAmt
                    xAxisData.push(item.hour)
                    seriesData.push(value)
                })
                series.push({
                    name: '收入',
                    type: 'line',
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    series: series
                }
            },
            incomeRegionChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.incomeRegion, this.intervalMap.startIndex.incomeRegion)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.saleAmt
                    xAxisData.push(item.areaName)
                    seriesData.push(value)
                })
                series.push({
                    name: '收入',
                    type: 'bar',
                    barMaxWidth: 30,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    series: series
                }
            },
            flowShootLineChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.flowShootLine, this.intervalMap.startIndex.flowShootLine)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.shootPerples
                    xAxisData.push(item.lineName)
                    seriesData.push(value)
                })
                series.push({
                    name: '流量',
                    type: 'bar',
                    barMaxWidth: 30,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5,
                        bottom: 120
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        },
                        data: xAxisData
                    },
                    series: series
                }
            },
            flowShootTravelChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.flowShootTravel, this.intervalMap.startIndex.flowShootTravel)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.shootPerples
                    xAxisData.push(item.travelName)
                    seriesData.push(value)
                })
                series.push({
                    name: '流量',
                    type: 'bar',
                    barMaxWidth: 30,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5,
                        bottom: 120
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        axisLabel: {
                            interval: 0,
                            rotate: 30
                        },
                        data: xAxisData
                    },
                    series: series
                }
            },
            flowShootAllChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.flowShootAll, this.intervalMap.startIndex.flowShootAll)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.shootPerples
                    xAxisData.push(item.hour)
                    seriesData.push(value)
                })
                series.push({
                    name: '流量',
                    type: 'line',
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    series: series
                }
            },
            flowShootRegionChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.flowShootRegion, this.intervalMap.startIndex.flowShootRegion)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.shootPerples
                    xAxisData.push(item.areaName)
                    seriesData.push(value)
                })
                series.push({
                    name: '流量',
                    type: 'bar',
                    barMaxWidth: 30,
                    label: {
                        normal: {
                            show: true,
                            position: 'inside'
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    series: series
                }
            },
            historyIncomeDayChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.historyIncomeDay, this.intervalMap.startIndex.historyIncomeDay)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.saleAmt
                    xAxisData.push(item.date)
                    seriesData.push(value)
                })
                series.push({
                    name: '历史',
                    type: 'line',
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    series: series
                }
            },
            historyShootDayChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return emptyChart
                }
                var list = dynamicSequenceValue(this.historyShootDay, this.intervalMap.startIndex.historyShootDay)
                var seriesData = []
                list.forEach(function(item) {
                    var value = +item.shoot
                    xAxisData.push(item.date)
                    seriesData.push(value)
                })
                series.push({
                    name: '历史',
                    type: 'line',
                    label: {
                        normal: {
                            show: true
                        }
                    },
                    data: seriesData
                })
                return {
                    tooltip: {
                        trigger: 'axis'
                    },
                    grid: {
                        top: 5
                    },
                    yAxis: {
                        name: '',
                        type: 'value'
                    },
                    xAxis: {
                        type: 'category',
                        data: xAxisData
                    },
                    series: series
                }
            },
            historyIncomeTotalChart: function () {
                var income = this.historyIncomeTotal
                return {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['前置收入','销售收入']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '65%',
                            label: {
                                normal: {
                                    show: true,
                                    formatter: '{d}%',
                                    position: 'inner'
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: false
                                }
                            },
                            data: [
                                {value: income.saleAmtPer, name: '前置收入', selected: true},
                                {value: income.appAmt, name: '销售收入'}
                            ]
                        }
                    ]
                }
            }
        },
        watch: {
            rolePositionId: function(val, oldVal) {
                if (oldVal === '') return
                switchRolePostion(val)
            },
            'regionProvinceMap.incomeAll': {
                deep: true,
                handler: function () {
                    this.refreshDataByIncomeAll()
                }
            },
            'regionProvinceMap.incomeRegion': {
                deep: true,
                handler: function () {
                    this.refreshDataByIncomeRegion()
                }
            },
            'regionProvinceMap.flowShootAll': {
                deep: true,
                handler: function () {
                    this.refreshDataByShootAll()
                }
            },
            'regionProvinceMap.flowShootRegion': {
                deep: true,
                handler: function () {
                    this.refreshDataByShootRegion()
                }
            },
            'regionProvinceMap.historyThreeMonthIncome': {
                deep: true,
                handler: function () {
                    this.refreshDataByThreeMonthIncome()
                }
            }
        },
        methods: {
            /*下拉数据*/
            //初始化大区省份列表
            initRegionProvince: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/queryRegion.htm', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.regionProvinceList = res.data || []
                        cityPicker.setData(self.regionProvinceList);
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*收入模块 start*/
            initIncome: function () {
                this.refreshDataByIncome(function () {
                    this.refreshDataByIncomeAll(function () {
                        this.refreshDataByIncomeRegion()
                    })
                })
            },
            //收入统计
            refreshDataByIncome: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/income.htm', {}, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.incomeTotal = data.incomeTotal || {}
                        self.incomeLine = data.incomeLine || []
                        self.incomeTravel = data.incomeTravel || []

                        self.intervalMap.startIndex.incomeLine = 0
                        self.intervalMap.startIndex.incomeTravel = 0
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //全国收入（实时）
            refreshDataByIncomeAll: function (cb) {
                var self = this
                var regionProvince = this.regionProvinceMap.incomeAll
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/incomeAll.htm', {
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.incomeAll = res.data || []

                        self.intervalMap.startIndex.incomeAll = 0
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //各大区收入
            refreshDataByIncomeRegion: function (cb) {
                var self = this
                var regionProvince = this.regionProvinceMap.incomeRegion
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/incomeRegion.htm', {
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.incomeRegion = res.data || []

                        self.intervalMap.startIndex.incomeRegion = 0
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*收入模块 end*/
            /*流量模块 start*/
            initFlow: function () {
                this.refreshDataByShoot(function () {
                    this.refreshDataByShootAll(function () {
                        this.refreshDataByShootRegion()
                    })
                })

            },
            //拍摄信息统计
            refreshDataByShoot: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shoot.htm', {}, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.flowShootInfo = data.shootInfo || {}
                        self.flowShootLine = data.shootLine || []
                        self.flowShootTravel = data.shootTravel || []

                        self.intervalMap.startIndex.flowShootLine = 0
                        self.intervalMap.startIndex.flowShootTravel = 0
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //全国拍摄人数实时
            refreshDataByShootAll: function (cb) {
                var self = this
                var regionProvince = this.regionProvinceMap.flowShootAll
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shootAll.htm', {
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.flowShootAll = res.data || []

                        self.intervalMap.startIndex.flowShootAll = 0
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //大区拍摄人数(实时)
            refreshDataByShootRegion: function (cb) {
                var self = this
                var regionProvince = this.regionProvinceMap.flowShootRegion
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shootRegion.htm', {
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.flowShootRegion = res.data || []
                        self.intervalMap.startIndex.flowShootRegion = 0
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*流量模块 end*/
            /*历史模块 start*/
            initHistory: function () {
                this.refreshDataByHistoryIncome(function () {
                    this.refreshDataByThreeMonthIncome(function () {
                        this.refreshDataByHistoryShoot()
                    })
                })
            },
            //累计收入
            refreshDataByHistoryIncome: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/historyIncome.htm', {}, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.historyIncomeTotal = data.incomeTotal || {}
                        self.historyIncomeDay = data.incomeDay || []

                        self.intervalMap.startIndex.historyIncomeDay = 0
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //近3个月收入统计
            refreshDataByThreeMonthIncome: function (cb) {
                var self = this
                var regionProvince = this.regionProvinceMap.historyThreeMonthIncome
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/threeMonthIncome.htm', {
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.historyThreeMonthIncome = res.data || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //累计拍摄人数
            refreshDataByHistoryShoot: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/historyShoot.htm', {}, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    if (res.code === '200') {
                        self.historyShootCount = data.shootCount || {}
                        self.historyShootDay = data.shootDay || []
                        self.historyTravelRanking = data.travelRanking || []

                        self.intervalMap.startIndex.historyShootDay = 0
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            }
            /*历史模块 end*/
        },
        created: function () {
            var self = this
            this.initRegionProvince(init)
            setTimeout(function () {
                self.intervalMap.timeout = setInterval(function () {
                    var startIndex = self.intervalMap.startIndex
                    switch (self.pageTypeActive){
                        case pageTypeConstant.income:
                            startIndex.incomeLine += 1
                            startIndex.incomeTravel += 1
                            startIndex.incomeAll += 1
                            startIndex.incomeRegion += 1
                            break
                        case pageTypeConstant.flow:
                            startIndex.flowShootLine += 1
                            startIndex.flowShootTravel += 1
                            startIndex.flowShootAll += 1
                            startIndex.flowShootRegion += 1
                            break
                        case pageTypeConstant.history:
                            startIndex.historyIncomeDay += 1
                            startIndex.historyShootDay += 1
                            break
                    }
                }, 1000);
            }, 300)
        },
        beforeDestroy: function () {
            clearInterval(self.intervalMap.timeout)
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
    // 设置大区省份
    function setRegionProvince(regionProvince, items) {
        regionProvince.areaCode = items[0].value
        regionProvince.areaName = items[0].text
        regionProvince.provinceCode = items[1].value
        regionProvince.provinceName = items[1].text
    }
    // 动态序列取值
    function dynamicSequenceValue(list, startIndex, count) {
        count = count || EACH_SCREEN_COUNT
        var len = list.length
        var sum
        var ret = []
        if (len <= count) {
            ret = list
        } else {
            startIndex = startIndex % len
            sum = startIndex + count
            if (sum > len) {
                ret = list.slice(startIndex).concat(list.slice(0, sum - len))
            } else {
                ret = list.slice(startIndex, sum)
            }
        }
        return ret
    }
    // 小数转为百分比
    function toPercent(point){
        var str=Number(point*100).toFixed(2);
        str+="%";
        return str;
    }
    // 初始化数据
    function init() {
        switch (vm.pageTypeActive){
            case pageTypeConstant.income:
                vm.initIncome()
                break
            case pageTypeConstant.flow:
                vm.initFlow()
                break
            case pageTypeConstant.history:
                vm.initHistory()
                break
        }
    }

    mui.os.plus && update()
    mui.os.plus && getVersion()
    var deceleration = mui.os.ios ? 0.003 : 0.0009;
    mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, //是否显示滚动条
        deceleration: deceleration
    });

    // 收入
    mui('body').on('tap', '#income', function(){
        vm.pageTypeActive = pageTypeConstant.income
        vm.init()
    })
    mui('body').on('tap', '#incomeAll_RP', function(){
        cityPicker.show(function(items) {
            setRegionProvince(vm.regionProvinceMap.incomeAll, items)
        });
    })
    mui('body').on('tap', '#incomeRegion_RP', function(){
        cityPicker.show(function(items) {
            setRegionProvince(vm.regionProvinceMap.incomeRegion, items)
        });
    })
    // 流量
    mui('body').on('tap', '#flow', function(){
        vm.pageTypeActive = pageTypeConstant.flow
        vm.init()
    })
    mui('body').on('tap', '#flowShootAll_RP', function(){
        cityPicker.show(function(items) {
            setRegionProvince(vm.regionProvinceMap.flowShootAll, items)
        });
    })
    mui('body').on('tap', '#flowShootRegion_RP', function(){
        cityPicker.show(function(items) {
            setRegionProvince(vm.regionProvinceMap.flowShootRegion, items)
        });
    })
    // 历史
    mui('body').on('tap', '#history', function(){
        vm.pageTypeActive = pageTypeConstant.history
        vm.init()
    })
    mui('body').on('tap', '#historyThreeMonthIncome_RP', function(){
        cityPicker.show(function(items) {
            setRegionProvince(vm.regionProvinceMap.historyThreeMonthIncome, items)
        });
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
})