(function () {
    var pageTypeConstant = {
        income: 'income',
        flow: 'flow',
        history: 'history'
    }
    var titleMap = {
        income: '收入',
        flow: '流量',
        history: '历史数据'
    }
    //大区省份选择
    var cityPicker = new mui.PopPicker({
        layer: 2
    })
    var EACH_SCREEN_COUNT = 8
    var X_AXIS_NAME_COUNT = 7
    var DATA_ZOOM_INSIDE = {
        show: true,
        realtime: true,
        type: 'inside',
        orient: 'horizontal',
        zoomLock: false,
        startValue: 0,
        endValue: EACH_SCREEN_COUNT - 1
    }
    var EMPTY_CHART = {series: []}
    var LINE_Y_AXIS = {
        name: '',
        show: false,
        type: 'value'
    }
    var BAR_TOOLTIP = {
        trigger: 'axis',
        show: true
    }
    var BAR_Y_AXIS_TICK = {
        show: false
    }
    var BAR_X_AXIS = {
        name: '',
        show: false,
        type: 'value'
    }
    var AXIS_LABEL = {
        interval: 0,
        rotate: 30
    }
    var GRID_TOP = 20
    var GRID_LEFT = 14
    var GRID_RIGHT = 10
    var GRID_BOTTOM = 30
    var AXIS_LABEL_LEFT = 50
    var AXIS_LABEL_BOTTOM = 70
    var BAR_AXIS_LABEL_LEFT = 100
    var BAR_AXIS_LABEL_RIGHT = 70
    var ALL_RP = 'all'
    var ALL_NAME_RP = '全部'
    var MERGE_SERIES_SUFFIX = '_newKey'
    var TODAY_COLOR = '#c23531'
    var YESTERDAY_COLOR = '#2f4554'
    var INCOME_SERIES_OPTS = {
        seriesName: '收入',
        color: TODAY_COLOR,
        categoryKey: 'category',
        valueKey: 'value'
    }
    var FLOW_SERIES_OPTS = {
        seriesName: '人数',
        color: TODAY_COLOR,
        categoryKey: 'category',
        valueKey: 'value'
    }

    // 获取大区省份
    function getRegionProvince(options, text) {
        var ret = options.areaName && options.areaName !== ALL_NAME_RP ? options.areaName : ''
        if (ret && options.provinceName && options.provinceName !==  ALL_NAME_RP) {
            ret += options.provinceName
        }
        return ret || text
    }
    // 设置大区省份
    function setRegionProvince(regionProvince, items) {
        regionProvince.areaCode = items[0].value
        regionProvince.areaName = items[0].text
        regionProvince.provinceCode = items[1].value || ALL_RP
        regionProvince.provinceName = items[1].text || ALL_NAME_RP
    }
    //合并序列数据
    function mergeSeriesData(options) {
        var fromList = options.fromList;
        var toList = options.toList;
        var categoryKey = options.categoryKey;
        var valueKey = options.valueKey;
        var baseMap = {}
        var ret = []
        ;(toList || []).forEach(function (item) {
            baseMap[item[categoryKey]] = {
                category: item[categoryKey],
                value: item[valueKey]
            }
        })
        ;(fromList || []).forEach(function (item) {
            var data = baseMap[item[categoryKey]]
            if (!data) {
                baseMap[item[categoryKey]] = data = {
                    category: item[categoryKey],
                    value: 0
                }
            }
            data['value' + MERGE_SERIES_SUFFIX] = item[valueKey]
        })
        Object.keys(baseMap).forEach(function (key) {
            ret.push(baseMap[key])
        })
        return ret
    }
    // 过滤（或）
    function filterSeriesByOr(item) {
        return isValidValue(item.value) || isValidValue(item['value' + MERGE_SERIES_SUFFIX])
    }
    // 排序
    function baseSortSeries(a, b) {
        var key = 'value' + MERGE_SERIES_SUFFIX
        return a[key] - b[key]
    }
    //获取line的chart option
    function getLineChartOption(list, seriesOpts) {
        var xAxisData = []
        var series = []
        seriesOpts = Array.isArray(seriesOpts) ? seriesOpts : [seriesOpts]
        seriesOpts.forEach(function (opt, groupIndex) {
            var categoryKey = opt.categoryKey;
            var valueKey = opt.valueKey
            var seriesData = []

            list.forEach(function(item) {
                var value = +item[valueKey]
                if (groupIndex === 0) {
                    xAxisData.push(item.noTruncation ? item[categoryKey] : truncationStr(item[categoryKey], X_AXIS_NAME_COUNT))
                }
                seriesData.push(value)
            })
            series.push({
                name: opt.seriesName,
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: opt.color
                    }
                },
                data: seriesData
            })
        })

        return {
            tooltip: {
                trigger: 'axis'
            },
            dataZoom: DATA_ZOOM_INSIDE,
            grid: {
                top: GRID_TOP,
                left: GRID_LEFT,
                right:GRID_RIGHT,
                bottom: GRID_BOTTOM
            },
            yAxis: LINE_Y_AXIS,
            xAxis: {
                type: 'category',
                data: xAxisData
            },
            series: series
        }
    }
    //获取两条line的chart option
    function getTwoLineChartOption(list) {
        return getLineChartOption(list, [
            {
                seriesName: '今日',
                color: TODAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'
            },
            {
                seriesName: '昨日',
                color: YESTERDAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'+ MERGE_SERIES_SUFFIX
            }
        ])
    }
    //获取line的chart option(长category)
    function getLineLongCategoryChartOption(list, seriesOpts) {
        var xAxisData = []
        var series = []
        seriesOpts = Array.isArray(seriesOpts) ? seriesOpts : [seriesOpts]
        seriesOpts.forEach(function (opt, groupIndex) {
            var categoryKey = opt.categoryKey;
            var valueKey = opt.valueKey
            var seriesData = []

            list.forEach(function(item) {
                var value = +item[valueKey]
                if (groupIndex === 0) {
                    xAxisData.push(item.noTruncation ? item[categoryKey] : truncationStr(item[categoryKey], X_AXIS_NAME_COUNT))
                }
                seriesData.push(value)
            })
            series.push({
                name: opt.seriesName,
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: opt.color
                    }
                },
                data: seriesData
            })
        })

        return {
            tooltip: {
                trigger: 'axis'
            },
            dataZoom: DATA_ZOOM_INSIDE,
            grid: {
                top: GRID_TOP,
                left: AXIS_LABEL_LEFT,
                right:GRID_RIGHT,
                bottom: AXIS_LABEL_BOTTOM
            },
            yAxis: LINE_Y_AXIS,
            xAxis: {
                type: 'category',
                axisLabel: AXIS_LABEL,
                data: xAxisData
            },
            series: series
        }
    }
    //获取两条line的chart option(长category)
    function getTwoLineLongCategoryChartOption(list) {
        return getLineLongCategoryChartOption(list, [
            {
                seriesName: '今日',
                color: TODAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'
            },
            {
                seriesName: '昨日',
                color: YESTERDAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'+ MERGE_SERIES_SUFFIX
            }
        ])
    }
    //获取Bar的chart option(长category)
    function getBarLongCategoryChartOption(list, seriesOpts) {
        var xAxisData = []
        var series = []
        seriesOpts = Array.isArray(seriesOpts) ? seriesOpts : [seriesOpts]
        seriesOpts.forEach(function (opt, groupIndex) {
            var categoryKey = opt.categoryKey;
            var valueKey = opt.valueKey
            var seriesData = []

            list.forEach(function(item) {
                var value = +item[valueKey]
                if (groupIndex) {
                    xAxisData.push(item.noTruncation ? item[categoryKey] : truncationStr(item[categoryKey], X_AXIS_NAME_COUNT))
                }
                seriesData.push(value)
            })
            series.push({
                name: opt.seriesName,
                type: 'bar',
                barMaxWidth: 30,
                label: {
                    normal: {
                        show: true,
                        position: 'right'
                    }
                },
                itemStyle: {
                    normal: {
                        color: opt.color
                    }
                },
                data: seriesData
            })
        })

        return {
            tooltip: BAR_TOOLTIP,
            grid: {
                top: GRID_TOP-10,
                left: BAR_AXIS_LABEL_LEFT,
                right:BAR_AXIS_LABEL_RIGHT,
                bottom: GRID_BOTTOM - 10
            },
            yAxis: {
                type: 'category',
                axisTick: BAR_Y_AXIS_TICK,
                data: xAxisData
            },
            xAxis: BAR_X_AXIS,
            series: series
        }
    }
    //获取两条Bar的chart option(长category)
    function getTwoBarLongCategoryChartOption(list) {
        return getBarLongCategoryChartOption(list, [
            {
                seriesName: '今日',
                color: TODAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'
            },
            {
                seriesName: '昨日',
                color: YESTERDAY_COLOR,
                categoryKey: 'category',
                valueKey: 'value'+ MERGE_SERIES_SUFFIX
            }
        ])
    }
    //校验值
    function isValidValue(v) {
        v = +v
        return !!v && !isNaN(v)
    }
    //是否定义
    function isDef(v) {
        return v !== undefined && v !== null
    }
    // 截断字符串
    function truncationStr(str, count) {
        str = str + ''
        return str.length > count ? str.slice(0, count - 1) + '...' : str
    }

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
            pageTypeActive: pageTypeConstant.income,
            queryDate: new Date(/*new Date() - 1000*60*60*24*/),
            //大区省份code
            //regionProvinceActive: '',
            regionProvinceMap: {
                incomeAll: {
                    areaCode: ALL_RP,
                    areaName: ALL_NAME_RP,
                    provinceCode: ALL_RP,
                    provinceName: ALL_NAME_RP
                },
                incomeRegion: {
                    areaCode: ALL_RP,
                    areaName: ALL_NAME_RP,
                    provinceCode: ALL_RP,
                    provinceName: ALL_NAME_RP
                },
                flowShootAll: {
                    areaCode: ALL_RP,
                    areaName: ALL_NAME_RP,
                    provinceCode: ALL_RP,
                    provinceName: ALL_NAME_RP
                },
                flowShootRegion: {
                    areaCode: ALL_RP,
                    areaName: ALL_NAME_RP,
                    provinceCode: ALL_RP,
                    provinceName: ALL_NAME_RP
                },
                historyIncomeDay: {
                    areaCode: ALL_RP,
                    areaName: ALL_NAME_RP,
                    provinceCode: ALL_RP,
                    provinceName: ALL_NAME_RP
                },
                historyThreeMonthIncome: {
                    areaCode: ALL_RP,
                    areaName: ALL_NAME_RP,
                    provinceCode: ALL_RP,
                    provinceName: ALL_NAME_RP
                },
                historyShootDay: {
                    areaCode: ALL_RP,
                    areaName: ALL_NAME_RP,
                    provinceCode: ALL_RP,
                    provinceName: ALL_NAME_RP
                }
            },
            regionProvinceList: [],
            //
            realTitleExplainText: '今日实时/昨日',
            /*收入模块 start*/
            // 统计汇总
            incomeTotal: {
                saleAmt: '',//	收入
                saleAmtRate: '',//	收入涨幅
                saleAmtPer: '',//	前置金额
                saleAmtPerRate: '',//	前置金额涨幅
                appAmt: '',//	销售金额
                appAmtRate: ''//	销售金额涨幅
            },
            incomeYesterdayTotal: {
                saleAmt: '',//	收入
                saleAmtRate: '',//	收入涨幅
                saleAmtPer: '',//	前置金额
                saleAmtPerRate: '',//	前置金额涨幅
                appAmt: '',//	销售金额
                appAmtRate: ''//	销售金额涨幅
            },
            //线路产品收入
            /*productName	线路名称
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
                shootPerples: '',//	拍摄人数
                shootPerplesRate: ''//	拍摄人数涨幅
            },
            flowYesterdayShootInfo: {
                shootPerples: '',//	拍摄人数
                shootPerplesRate: ''//	拍摄人数涨幅
            },
            //线路产品拍摄人数
            /*productName	线路名称
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
            /*hour	日期
             shootPerples	拍摄人数*/
            historyShootDay: [],
            //旅行社发团人数排行
            /*travelName	旅行社名称
             total	人数*/
            historyTravelRanking: []
            /*历史模块 end*/
        },
        computed:{
            showTitle: function () {
                return titleMap[this.pageTypeActive] || '日报'
            },
            pageTypeConstant: function () {
                return pageTypeConstant
            },
            incomeAllTitle: function () {
                return getRegionProvince(this.regionProvinceMap.incomeAll, '全国') + '收入（' + this.realTitleExplainText + '）'
            },
            incomeRegionTitle: function () {
                return getRegionProvince(this.regionProvinceMap.incomeRegion, '各大区') + '收入（' + this.realTitleExplainText + '）'
            },
            flowShootAllTitle: function () {
                return getRegionProvince(this.regionProvinceMap.flowShootAll, '全国拍摄人数') + '（' + this.realTitleExplainText + '）'
            },
            flowShootRegionTitle: function () {
                return getRegionProvince(this.regionProvinceMap.flowShootRegion, '大区拍摄人数') + '（' + this.realTitleExplainText + '）'
            },
            historyIncomeDayTitle: function () {
                return '近30天每日收入'
            },
            historyThreeMonthIncomeTitle: function () {
                return '近3月收入统计'
            },
            historyShootDayTitle: function () {
                return '近30天每日拍摄人数'
            },
            incomeLineChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.incomeLine)
            },
            incomeTravelChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.incomeTravel)
            },
            incomeAllChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return EMPTY_CHART
                }
                var options = getTwoLineChartOption(this.incomeAll)
                options.dataZoom = lf.extend({},DATA_ZOOM_INSIDE,{
                    start: 0,
                    end: 100
                })
                return options
            },
            incomeRegionChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.income) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.incomeRegion)
            },
            flowShootLineChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.flow) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.flowShootLine)
            },
            flowShootTravelChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.flow) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.flowShootTravel)
            },
            flowShootAllChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.flow) {
                    return EMPTY_CHART
                }
                var options = getTwoLineChartOption(this.flowShootAll)
                options.dataZoom = lf.extend({},DATA_ZOOM_INSIDE,{
                    start: 0,
                    end: 100
                })
                return options
            },
            flowShootRegionChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.flow) {
                    return EMPTY_CHART
                }
                return getTwoBarLongCategoryChartOption(this.flowShootRegion)
            },
            historyIncomeDayChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.history) {
                    return EMPTY_CHART
                }
                var options = getLineLongCategoryChartOption(this.historyIncomeDay, INCOME_SERIES_OPTS)
                options.dataZoom = lf.extend({},DATA_ZOOM_INSIDE,{
                    startValue: options.xAxis.data.length - EACH_SCREEN_COUNT,
                    end: 100
                })
                return options
            },
            historyShootDayChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.history) {
                    return EMPTY_CHART
                }
                var options =  getLineLongCategoryChartOption(this.historyShootDay, FLOW_SERIES_OPTS)
                options.dataZoom = lf.extend({},DATA_ZOOM_INSIDE,{
                    startValue: options.xAxis.data.length - EACH_SCREEN_COUNT,
                    end: 100
                })
                return options
            },
            historyIncomeTotalChart: function () {
                if (this.pageTypeActive !== pageTypeConstant.history) {
                    return EMPTY_CHART
                }
                var income = this.historyIncomeTotal
                return {
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        top: 'middle',
                        left: 30,
                        data: ['前置收入','销售收入']
                    },
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            radius: '75%',
                            center: ['65%', '50%'],
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
            'regionProvinceMap.historyIncomeDay': {
                deep: true,
                handler: function () {
                    this.refreshDataByThirtyIncome()
                }
            },
            'regionProvinceMap.historyThreeMonthIncome': {
                deep: true,
                handler: function () {
                    this.refreshDataByThreeMonthIncome()
                }
            },
            'regionProvinceMap.historyShootDay': {
                deep: true,
                handler: function () {
                    this.refreshDataByThirtyShoot()
                }
            }
        },
        methods: {
            getAbs: function (value) {
                return isDef(value) ? Math.abs(value) : 0
            },
            isSign: function(value) {
                value = value + ''
                return value[0] !== '-'
            },
            getNumberClassName: function (value) {
                return [this.isSign(value) ? 'number-sign' : 'number-lose']
            },
            calcBarChartHeight: function (options) {
                var height = 0
                var yAxis = options.yAxis
                if (yAxis) {
                    height = yAxis.data.length * 38 + GRID_TOP + GRID_BOTTOM
                }
                return height
            },
            calcBarChartStyle: function (options) {
                return {
                    height: this.calcBarChartHeight(options) + 'px'
                }
            },
            refreshChart: function (key) {
                var self = this
                var chartMap = {
                    income: {
                        prefix: 'incomeChart_',
                        list: ['1','2','3','4']
                    },
                    flow: {
                        prefix: 'flowChart_',
                        list: ['1','2','3','4']
                    }
                }
                var item = chartMap[key]
                item && this.$nextTick(function () {
                    var prefix = item.prefix
                    item.list.forEach(function (index) {
                        var chart = self.$refs[prefix + index]
                        chart && chart.resize()
                    })
                })
            },
            /*下拉数据*/
            //初始化大区省份列表
            initRegionProvince: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/queryRegionAndProvince', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.regionProvinceList = (res.data || []).map(function (item) {
                            return {
                                value: item.areaCode,
                                text: item.areaName,
                                children: (item.province || []).map(function (chd) {
                                    return {
                                        value: chd.provinceCode,
                                        text: chd.provinceName
                                    }
                                })
                            }
                        })
                        cityPicker.setData(self.regionProvinceList);
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*收入模块 start*/
            initIncome: function (cb) {
                var self = this
                self.refreshDataByIncome(function () {
                    self.refreshDataByIncomeAll(function () {
                        self.refreshDataByIncomeRegion(function () {
                            cb && cb()
                            self.refreshChart('income')
                        })
                    })
                })
            },
            //收入统计
            refreshDataByIncome: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/income', {
                    queryDate: this.queryDate.format('yyyy-MM-dd')
                }, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.incomeTotal = data.incomeTotal || {}
                        self.incomeYesterdayTotal = data.yesterdayIncomeTotal || {}
                        self.incomeLine = mergeSeriesData({
                            toList: data.incomeProduct,
                            fromList:data.yesterdayIncomeProduct,
                            categoryKey: 'productName',
                            valueKey: 'saleAmt'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)

                        self.incomeTravel = mergeSeriesData({
                            toList: data.incomeTravel,
                            fromList:data.yesterdayIncomeTravel,
                            categoryKey: 'travelName',
                            valueKey: 'saleAmt'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
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
                lf.net.getJSON('newReport/analysisMobile/incomeAll', {
                    queryDate: this.queryDate.format('yyyy-MM-dd'),
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.incomeAll = mergeSeriesData({
                            toList: data.toDay,
                            fromList:data.yesterday,
                            categoryKey: 'hour',
                            valueKey: 'saleAmt'
                        }).sort(function (a, b) {
                            return a.category - b.category
                        })
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
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
                lf.net.getJSON('newReport/analysisMobile/incomeRegion', {
                    queryDate: this.queryDate.format('yyyy-MM-dd'),
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.incomeRegion = mergeSeriesData({
                            toList: (data.toDay || []).map(function (item) {
                                item.areaName = item.areaName || item.provinceName || item.lineName
                                return item
                            }),
                            fromList:(data.yesterday || []).map(function (item) {
                                item.areaName = item.areaName || item.provinceName || item.lineName
                                return item
                            }),
                            categoryKey: 'areaName',
                            valueKey: 'saleAmt'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*收入模块 end*/
            /*流量模块 start*/
            initFlow: function (cb) {
                var self = this
                self.refreshDataByShoot(function () {
                    self.refreshDataByShootAll(function () {
                        self.refreshDataByShootRegion(function () {
                            cb && cb()
                            self.refreshChart('flow')
                        })
                    })
                })
            },
            //拍摄信息统计
            refreshDataByShoot: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/shoot', {
                    queryDate: this.queryDate.format('yyyy-MM-dd')
                }, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.flowShootInfo = data.shootInfo || {}
                        self.flowYesterdayShootInfo = data.yesterdayShootInfo || {}
                        self.flowShootLine = mergeSeriesData({
                            toList: data.shootProduct,
                            fromList:data.yesterdayShootProduct,
                            categoryKey: 'productName',
                            valueKey: 'shootPerples'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)

                        self.flowShootTravel = mergeSeriesData({
                            toList: data.shootTravel,
                            fromList:data.yesterdayShootTravel,
                            categoryKey: 'travelName',
                            valueKey: 'shootPerples'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
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
                lf.net.getJSON('newReport/analysisMobile/shootAll', {
                    queryDate: this.queryDate.format('yyyy-MM-dd'),
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.flowShootAll = mergeSeriesData({
                            toList: data.toDay,
                            fromList:data.yesterday,
                            categoryKey: 'hour',
                            valueKey: 'shootPerples'
                        }).sort(function (a, b) {
                            return a.category - b.category
                        })
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
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
                lf.net.getJSON('newReport/analysisMobile/shootRegion', {
                    queryDate: this.queryDate.format('yyyy-MM-dd'),
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.flowShootRegion = mergeSeriesData({
                            toList: (data.toDay || []).map(function (item) {
                                item.areaName = item.areaName || item.provinceName || item.lineName
                                return item
                            }),
                            fromList:(data.yesterday || []).map(function (item) {
                                item.areaName = item.areaName || item.provinceName || item.lineName
                                return item
                            }),
                            categoryKey: 'areaName',
                            valueKey: 'shootPerples'
                        }).filter(filterSeriesByOr).sort(baseSortSeries)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*流量模块 end*/
            /*历史模块 start*/
            initHistory: function (cb) {
                var self = this
                self.refreshDataByHistoryIncome(function () {
                    self.refreshDataByThirtyIncome(function () {
                        self.refreshDataByThreeMonthIncome(function () {
                            self.refreshDataByHistoryShoot(function () {
                                self.refreshDataByThirtyShoot(function () {
                                    self.refreshDataByTravelRanking(function () {
                                        cb && cb()
                                    })
                                })
                            })
                        })
                    })
                })
            },
            //累计收入
            refreshDataByHistoryIncome: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/historyIncome', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyIncomeTotal = res.data || {}
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //近30天每日收入
            refreshDataByThirtyIncome: function (cb) {
                var self = this
                var regionProvince = this.regionProvinceMap.historyIncomeDay
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/thirtyIncome', {
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyIncomeDay = (res.data || []).map(function (item) {
                            return {
                                noTruncation: true,
                                category: item.date,
                                value: item.saleAmt
                            }
                        }).filter(filterSeriesByOr)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
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
                lf.net.getJSON('newReport/analysisMobile/threeMonthIncome', {
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    var data = res.data || {}
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyThreeMonthIncome = ['1','2','3'].map(function (index) {
                            return {
                                date: data['date' + index],
                                totalAmt: data['totalAmt' + index],
                                amtRate: data['amtRate' + index]
                            }
                        })
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
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
                lf.net.getJSON('newReport/analysisMobile/totalShoot', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyShootCount = {
                            shoot: isDef(res.data) ? res.data : 0
                        }
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //近30天每日拍摄人数
            refreshDataByThirtyShoot: function (cb) {
                var self = this
                var regionProvince = this.regionProvinceMap.historyShootDay
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/thirtyShoot', {
                    areaCode: regionProvince.areaCode,
                    provinceCode: regionProvince.provinceCode
                }, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyShootDay = (res.data || []).map(function (item) {
                            return {
                                noTruncation: true,
                                category: item.hour,
                                value: item.shootPerples
                            }
                        }).filter(filterSeriesByOr)
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            //旅行社发团人数排行
            refreshDataByTravelRanking: function (cb) {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/travelRanking', {}, function(res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.historyTravelRanking = res.data || []
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                });
            },
            /*历史模块 end*/
            init: function (cb) {
                this.initRegionProvince(function () {
                    init(cb)
                })
            }
        },
        created: function () {
        }
    })

    // 初始化数据
    function init(cb) {
        switch (vm.pageTypeActive){
            case pageTypeConstant.income:
                vm.initIncome(cb)
                break
            case pageTypeConstant.flow:
                vm.initFlow(cb)
                break
            case pageTypeConstant.history:
                vm.initHistory(cb)
                break
        }
    }
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
            vm.init(refreshSlider)
        })
        GLOBAL_SHOOT.update()
        GLOBAL_SHOOT.setVersion(vm)
        var deceleration = mui.os.ios ? 0.003 : 0.0009;
        mui('.mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: true, //是否显示滚动条
            deceleration: deceleration
        });
        refreshSlider()
        function goPageTop() {
            mui('#page-scroll').scroll().scrollTo(0,0,0)
        }
        function refreshSlider() {
            Vue.nextTick(function() {
                mui('.info-box-mui-slider').slider();
            })
        }
        function switchTab() {
            goPageTop()
            init(refreshSlider)
        }

        // 收入
        mui('body').on('tap', '#income', function(){
            vm.pageTypeActive = pageTypeConstant.income
            switchTab()
        })
        mui('#tab-income').on('tap', '.mui-control-item', function(){
            vm.refreshChart('income')
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
            switchTab()
        })
        mui('#tab-flow').on('tap', '.mui-control-item', function(){
            vm.refreshChart('flow')
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
            switchTab()
        })
        mui('body').on('tap', '#historyIncomeDay_RP', function(){
            cityPicker.show(function(items) {
                setRegionProvince(vm.regionProvinceMap.historyIncomeDay, items)
            });
        })
        mui('body').on('tap', '#historyThreeMonthIncome_RP', function(){
            cityPicker.show(function(items) {
                setRegionProvince(vm.regionProvinceMap.historyThreeMonthIncome, items)
            });
        })
        mui('body').on('tap', '#historyShootDay_RP', function(){
            cityPicker.show(function(items) {
                setRegionProvince(vm.regionProvinceMap.historyShootDay, items)
            });
        })

        // 退出登录
        mui('body').on('tap', '#logout', function() {
            lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
                if (e.index == 0) {
                    window.Role.logout();
                    Utils.RoleLogout();
                }
            });
        })
        lf.event.listener('dailyPaper', function(e) {
            switchTab();
            lf.event.fire(lf.window.currentWebview().opener(), 'dailyPaper', {})
        })
    })
    // 岗位切换
function switchRolePostion(val) {
    GLOBAL_SHOOT.switchPosition(val, function() {
        if(window.Role.currentPositions.length>0){
			vm.currentRoleId = window.Role.currentPositions[0].roleId;
			console.log("当前用户的角色id"+vm.currentRoleId)
		}

		var roleId = window.Role.currentPositions[0].roleId;
		var windowParams = GLOBAL_SHOOT.getPageUrlWithPosition(roleId, 1);
		if(windowParams) {
			GLOBAL_SHOOT.switchPositionOpenWindow(windowParams.windowId,windowParams.pageUrl,{},{})
		} else if(roleId != 9) {
			GLOBAL_SHOOT.switchPositionOpenWindow('order-list','../order/orderlist.html',{},{})
		}

		// if (window.Role.currentPositions[0].roleId==12) {
		//     lf.window.openWindow('daily-manage','../daily-manage/daily-manage.html',{},{})
		// } else if(window.Role.currentPositions[0].roleId!=9){
		//     lf.window.openWindow('order-list','../order/orderlist.html',{},{})
		// }
		init()
    })
}
})()