<template>
    <div class="statistics-daily-paper-more">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">更多数据</h1>
        </header>
        <div class="mui-content">
            <div class="daily-content">
                <!--各大区-->
                <div class="section-box">
                    <div class="section-title clearfix">
                        <div class="text" v-text="areaTitle"></div>
                        <div class="tool">
                            <button type="button" class="item mui-btn"
                                    v-text="areaTypeTitle"
                                    v-tap="{ methods : switchChartType, key: 'areaSelect' }">
                            </button>
                            <i class="item icon-more-select"
                               v-tap="{ methods : selectPicker, key: 'areaSelect' }">
                            </i>
                        </div>
                    </div>
                    <div class="section-content">
                        <e-charts class="axis-label-long" :options="areaChart" auto-resize></e-charts>
                    </div>
                </div>
                <!--各省份-->
                <div class="section-box">
                    <div class="section-title clearfix">
                        <div class="text" v-text="provinceTitle"></div>
                        <div class="tool">
                            <button type="button" class="item mui-btn"
                                    v-text="provinceTypeTitle"
                                    v-tap="{ methods : switchChartType, key: 'provinceSelect' }">
                            </button>
                            <i class="item icon-more-select"
                               v-tap="{ methods : selectPicker, key: 'provinceSelect' }">
                            </i>
                        </div>
                    </div>
                    <div class="section-content">
                        <e-charts class="axis-label-long" :options="provinceChart" auto-resize></e-charts>
                    </div>
                </div>
                <!--各线路-->
                <div class="section-box">
                    <div class="section-title clearfix">
                        <div class="text" v-text="lineTitle"></div>
                        <div class="tool">
                            <button type="button" class="item mui-btn"
                                    v-text="lineTypeTitle"
                                    v-tap="{ methods : switchChartType, key: 'lineSelect' }">
                            </button>
                            <i class="item icon-more-select"
                               v-tap="{ methods : selectPicker, key: 'lineSelect' }">
                            </i>
                        </div>
                    </div>
                    <div class="section-content">
                        <e-charts class="axis-label-long" :options="lineChart" auto-resize></e-charts>
                    </div>
                </div>
                <!--各产品-->
                <div class="section-box">
                    <div class="section-title clearfix">
                        <div class="text" v-text="productTitle"></div>
                        <div class="tool">
                            <button type="button" class="item mui-btn"
                                    v-text="productTypeTitle"
                                    v-tap="{ methods : switchChartType, key: 'productSelect' }">
                            </button>
                            <i class="item icon-more-select"
                               v-tap="{ methods : selectPicker, key: 'productSelect' }">
                            </i>
                        </div>
                    </div>
                    <div class="section-content">
                        <e-charts class="axis-label-long" :options="productChart" auto-resize></e-charts>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import utils from '../../../js/utils'
    import {pageTypeConstant, chartTypeConstant} from './commom'

    const EACH_SCREEN_COUNT = 8
    const X_AXIS_NAME_COUNT = 7
    const DATA_ZOOM_INSIDE = {
        show: true,
        realtime: true,
        type: 'inside',
        orient: 'horizontal',
        zoomLock: false,
        startValue: 0,
        endValue: EACH_SCREEN_COUNT - 1
    }
    const LINE_Y_AXIS = {
        name: '',
        show: false,
        type: 'value'
    }
    const AXIS_LABEL = {
        interval: 0,
        rotate: 30
    }
    const GRID_TOP = 20
    const GRID_LEFT = 14
    const GRID_RIGHT = 10
    const GRID_BOTTOM = 30
    const AXIS_LABEL_LEFT = 50
    const AXIS_LABEL_BOTTOM = 70

    //获取line的chart option(长category)
    function getLineLongCategoryChartOption(list, seriesOpts) {
        let xAxisData = []
        let series = []
        seriesOpts = Array.isArray(seriesOpts) ? seriesOpts : [seriesOpts]
        seriesOpts.forEach(function (opt, groupIndex) {
            let categoryKey = opt.categoryKey;
            let valueKey = opt.valueKey
            let seriesData = []

            list.forEach(function(item) {
                let value = +item[valueKey]
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
    //校验值
    function isValidValue(v) {
        v = +v
        return !!v && !isNaN(v)
    }
    //是否定义
    function isDef(v) {
        return v !== undefined && v !== null
    }
    export default {
        name: 'more',
        components: {
            ECharts: VueECharts
        },
        data () {
            return {
                pageType: pageTypeConstant.income,
                queryDate: utils.recentDay(30),
                areaSelect: {
                    chartType: chartTypeConstant.day,
                    value: '',
                    text: ''
                },
                provinceSelect: {
                    chartType: chartTypeConstant.day,
                    value: '',
                    text: ''
                },
                lineSelect: {
                    value: '',
                    text: ''
                },
                productSelect: {
                    chartType: chartTypeConstant.day,
                    value: '',
                    text: ''
                },
                areaList: [],
                provinceList: [],
                lineList: [],
                productList: []
            }
        },
        computed: {
            queryType () {
                if (this.pageType = pageTypeConstant.income) {
                    return {
                        areaList: this.areaSelect === chartTypeConstant.day ? 3 : 4 ,
                        provinceList: this.provinceSelect === chartTypeConstant.day ? 3 : 4,
                        lineList: this.lineSelect === chartTypeConstant.day ? 3 : 4,
                        productList: this.productSelect === chartTypeConstant.day ? 3 : 4
                    }
                } else {
                    return {
                        areaList: this.areaSelect === chartTypeConstant.day ? 1 : 2 ,
                        provinceList: this.provinceSelect === chartTypeConstant.day ? 1 : 2,
                        lineList: this.lineSelect === chartTypeConstant.day ? 1 : 2,
                        productList: this.productSelect === chartTypeConstant.day ? 1 : 2
                    }
                }
            },
            areaTitle () {
                return this.getChartTitle('各大区', this.areaSelect.text)
            },
            provinceTitle () {
                return this.getChartTitle('各省份', this.provinceSelect.text)
            },
            lineTitle () {
                return this.getChartTitle('各线路', this.lineSelect.text)
            },
            productTitle () {
                return this.getChartTitle('各产品', this.productSelect.text)
            },
            areaTypeTitle () {
                return this.getChartTypeTitle(this.areaSelect.chartType)
            },
            provinceTypeTitle () {
                return this.getChartTypeTitle(this.provinceSelect.chartType)
            },
            lineTypeTitle () {
                return this.getChartTypeTitle(this.lineSelect.chartType)
            },
            productTypeTitle () {
                return this.getChartTypeTitle(this.productSelect.chartType)
            },
            seriesOpts () {
                return  {
                    seriesName: this.pageType === pageTypeConstant.income ? '收入' : '人数',
                    categoryKey: 'category',
                    valueKey: 'value'
                }
            },
            areaChart () {
                return getLineLongCategoryChartOption(this.areaList, this.seriesOpts)
            },
            provinceChart () {
                return getLineLongCategoryChartOption(this.provinceList, this.seriesOpts)
            },
            lineChart () {
                return getLineLongCategoryChartOption(this.lineList, this.seriesOpts)
            },
            productChart () {
                return getLineLongCategoryChartOption(this.productList, this.seriesOpts)
            }
        },
        watch: {},
        methods: {
            initPicker (data) {
                const p = this.Picker = {
                    areaSelect: new mui.PopPicker(),
                    provinceSelect: new mui.PopPicker(),
                    lineSelect: new mui.PopPicker(),
                    productSelect: new mui.PopPicker()
                }
                p.areaSelect.setData(data.areaSelect)
                p.provinceSelect.setData(data.provinceSelect);
                p.lineSelect.setData(data.lineSelect);
                p.productSelect.setData(data.productSelect);
            },
            // 下拉数据
            initPickerData: function (cb) {
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/queryRegionAndProvince', {}, res => {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {

                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg);
                })
            },
            getChartTitle(typeName, name) {
                let title = this.pageType === pageTypeConstant.income ? '每日收入' : '每日拍摄人数'
                return typeName + title + (name ? ' - ' + name : '' )
            },
            getChartTypeTitle(type) {
                return type === pageTypeConstant.day ? '查看累积趋势' : '查看每日趋势'
            },
            selectPicker (params) {
                const key = params.key
                const p = this.Picker[key]
                const s = this[key]
                p.show(items => {
                    s.value = items[0].value
                    s.text = items[0].text
                })
            },
            switchChartType (params) {
                const key = params.key
                const s = this[key]
                s.chartType = s.chartType === chartTypeConstant.day ? chartTypeConstant.acc :chartTypeConstant.day
            },
            refreshAreaList (cb) {
                const {queryDate,areaSelect} = this
                if (!areaSelect.value) {
                    return
                }
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/totalMore.htm', {
                    type: this.queryType.areaList,
                    startDate: queryDate[0] ? queryDate[0].format('yyyy-MM-dd') : '',
                    endDate: queryDate[1] ? queryDate[1].format('yyyy-MM-dd') : '',
                    areaCode: areaSelect.value
                }, res => {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        this.areaList = (res.data || []).map(v => {
                            return {
                                category: v.date,
                                value: v.value
                            }
                        })
                    } else {
                        lf.nativeUI.toast(res.msg)
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg)
                })
            },
            refreshProvinceList (cb) {
                const {queryDate,provinceSelect} = this
                if (!provinceSelect.value) {
                    return
                }
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/totalMore.htm', {
                    type: this.queryType.provinceList,
                    startDate: queryDate[0] ? queryDate[0].format('yyyy-MM-dd') : '',
                    endDate: queryDate[1] ? queryDate[1].format('yyyy-MM-dd') : '',
                    provinceCode: provinceSelect.value
                }, res => {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        this.provinceList = (res.data || []).map(v => {
                            return {
                                category: v.date,
                                value: v.value
                            }
                        })
                    } else {
                        lf.nativeUI.toast(res.msg)
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg)
                })
            },
            refreshLineList (cb) {
                const {queryDate,lineSelect} = this
                if (!lineSelect.value) {
                    return
                }
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/totalMore.htm', {
                    type: this.queryType.lineList,
                    startDate: queryDate[0] ? queryDate[0].format('yyyy-MM-dd') : '',
                    endDate: queryDate[1] ? queryDate[1].format('yyyy-MM-dd') : '',
                    lineName: lineSelect.value
                }, res => {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        this.lineList = (res.data || []).map(v => {
                            return {
                                category: v.date,
                                value: v.value
                            }
                        })
                    } else {
                        lf.nativeUI.toast(res.msg)
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg)
                })
            },
            refreshProductList (cb) {
                const {queryDate,productSelect} = this
                if (!productSelect.value) {
                    return
                }
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/totalMore.htm', {
                    type: this.queryType.productList,
                    startDate: queryDate[0] ? queryDate[0].format('yyyy-MM-dd') : '',
                    endDate: queryDate[1] ? queryDate[1].format('yyyy-MM-dd') : '',
                    productId: productSelect.value
                }, res => {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        this.productList = (res.data || []).map(v => {
                            return {
                                category: v.date,
                                value: v.value
                            }
                        })
                    } else {
                        lf.nativeUI.toast(res.msg)
                    }
                    cb && cb()
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg)
                })
            }
        },
        created () {

        }
    }
</script>
<style lang="scss">
    html,
    body {
        background-color: #efeff4;
    }
    .statistics-daily-paper-more{
        $primary-color: #3CB493;
        background-color: #efeff4;
        .clearfix:before, .clearfix:after {
            content: " ";
            display: table;
        }
        .clearfix:after {
            clear: both;
        }
        .lf{
            float: left;
        }
        .rt{
            float: right;
        }
        .mui-bar-nav{
            color: #333;
            background:#fff;
        }
        .daily-content{
            padding-bottom: 20px;
            .section-box{
                margin-bottom: 5px;
                background-color: #fff;
                .section-title {
                    padding: 18px 14px 16px;
                    color: #919191;
                    .text {
                        float: left;
                        font-size: 15px;
                        color: #666;
                    }
                    .tool {
                        float: right;
                        height: 21px;
                        .item{
                            display: inline-block;
                            height: 21px;
                        }
                        .item + .item {
                            cursor: pointer;
                            margin-left: 10px;
                        }
                        .icon-more-select{
                            width: 26px;
                            background-repeat: no-repeat;
                            background-position: center;
                            background-size: contain;
                            background-image: url("../../../assets/images/statistics/more.png");
                        }
                    }
                }
                .section-content{
                    .echarts{
                        width: 100%;
                        height: 240px;
                    }
                    .echarts.axis-label-long{
                        height: 280px;
                    }
                }
            }
        }
    }
</style>