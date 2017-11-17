<template>
    <div class="statistics-daily-paper-more">
        <header class="mui-bar mui-bar-nav">
            <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
            <h1 class="mui-title">更多数据</h1>
        </header>
        <div class="mui-content mui-scroll-wrapper" id="page-scroll">
            <div class="mui-scroll">
                <div class="daily-content">
                    <!--各大区-->
                    <div class="section-box">
                        <div class="section-title clearfix">
                            <div class="text" v-text="areaTitle"></div>
                            <div class="tool">
                                <button type="button" class="item mui-btn switchover"
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
                                <button type="button" class="item mui-btn switchover"
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
                                <button type="button" class="item mui-btn switchover"
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
                                <button type="button" class="item mui-btn switchover"
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
    </div>
</template>
<script>
    import utils from '../../../js/utils'
    import {pageTypeConstant, chartTypeConstant, totalMoreTypeConstant,
        X_AXIS_NAME_COUNT,
        getLineLongCategoryChartOption} from './commom'

    export default {
        name: 'more',
        components: {
            ECharts: VueECharts
        },
        data () {
            return {
                pageType: pageTypeConstant.income,
                queryDate: utils.recentDay(90),
                watchSelect: false, // 为假时开始 watch *Select
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
                    chartType: chartTypeConstant.day,
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
                const {income, incomeAcc, people, peopleAcc} = totalMoreTypeConstant
                if (this.pageType === pageTypeConstant.income) {
                    return {
                        areaList: this.areaSelect.chartType === chartTypeConstant.day ? income : incomeAcc ,
                        provinceList: this.provinceSelect.chartType === chartTypeConstant.day ? income : incomeAcc,
                        lineList: this.lineSelect.chartType === chartTypeConstant.day ? income : incomeAcc,
                        productList: this.productSelect.chartType === chartTypeConstant.day ? income : incomeAcc
                    }
                } else {
                    return {
                        areaList: this.areaSelect.chartType === chartTypeConstant.day ? people : peopleAcc ,
                        provinceList: this.provinceSelect.chartType === chartTypeConstant.day ? people : peopleAcc,
                        lineList: this.lineSelect.chartType === chartTypeConstant.day ? people : peopleAcc,
                        productList: this.productSelect.chartType === chartTypeConstant.day ? people : peopleAcc
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
        watch: {
            areaSelect: {
                handler () {
                    this.watchSelect && this.refreshAreaList()
                },
                deep: true
            },
            provinceSelect: {
                handler () {
                    this.watchSelect && this.refreshProvinceList()
                },
                deep: true
            },
            lineSelect: {
                handler () {
                    this.watchSelect && this.refreshLineList()
                },
                deep: true
            },
            productSelect: {
                handler () {
                    this.watchSelect && this.refreshProductList()
                },
                deep: true
            }
        },
        methods: {
            initPicker () {
                this.Picker = {
                    areaSelect: new mui.PopPicker(),
                    provinceSelect: new mui.PopPicker(),
                    lineSelect: new mui.PopPicker(),
                    productSelect: new mui.PopPicker()
                }
            },
            setPickerData (data) {
                const p = this.Picker
                p.areaSelect.setData(data.areaSelect)
                p.provinceSelect.setData(data.provinceSelect);
                p.lineSelect.setData(data.lineSelect);
                p.productSelect.setData(data.productSelect);
            },
            // 下拉数据
            initPickerData: function (cb) {
                const {queryDate} = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/totalMoreAll', {
                    type: this.queryType.areaList,
                    startDate: queryDate[0] ? queryDate[0].format('yyyy-MM-dd') : '',
                    endDate: queryDate[1] ? queryDate[1].format('yyyy-MM-dd') : ''
                }, res => {
                    lf.nativeUI.closeWaiting()
                    function map2(v) {
                        return {
                            noTruncation: true,
                            category: v.date,
                            value: v.value
                        }
                    }
                    if (res.code === '200') {
                        const {
                            areaMap,
                            araeCode,
                            araeName,
                            areaData,

                            provinceMap,
                            provinceCode,
                            provinceName,
                            provinceData,

                            lineList,
                            lineName,
                            lineData,

                            productMap,
                            productId,
                            productName,
                            productData
                        } = res.data || {}

                        this.setPickerData({
                            areaSelect: (areaMap || []).map(v => {
                                return {
                                    value: v.regionsCode,
                                    text: v.regionsName
                                }
                            }),
                            provinceSelect: (provinceMap || []).map(v => {
                                return {
                                    value: v.regionsCode,
                                    text: v.regionsName
                                }
                            }),
                            lineSelect: (lineList || []).map(v => {
                                return {
                                    value: v,
                                    text: v
                                }
                            }),
                            productSelect: (productMap || []).map(v => {
                                return {
                                    value: v.id,
                                    text: v.pName
                                }
                            })
                        })

                        this.areaSelect.value = araeCode || ''
                        this.areaSelect.text = araeName || ''
                        this.provinceSelect.value = provinceCode || ''
                        this.provinceSelect.text = provinceName || ''
                        this.lineSelect.value = lineName || ''
                        this.lineSelect.text = lineName || ''
                        this.productSelect.value = productId || ''
                        this.productSelect.text = productName || ''

                        this.areaList = (areaData || []).map(map2)
                        this.provinceList = (provinceData || []).map(map2)
                        this.lineList = (lineData || []).map(map2)
                        this.productList = (productData || []).map(map2)
                        this.$nextTick(() => {
                            this.watchSelect = true
                        })
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
                return typeName + title + (name ? ' - ' + utils.truncationStr(name, X_AXIS_NAME_COUNT) : '' )
            },
            getChartTypeTitle(type) {
                return type === chartTypeConstant.day ? '查看累积趋势' : '查看每日趋势'
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
            queryTotalMoreData (options, cb) {
                const {queryDate} = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('newReport/analysisMobile/totalMore', {
                    startDate: queryDate[0] ? queryDate[0].format('yyyy-MM-dd') : '',
                    endDate: queryDate[1] ? queryDate[1].format('yyyy-MM-dd') : '',
                    ...options
                }, res => {
                    let data
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        data = (res.data || []).map(v => {
                            return {
                                noTruncation: true,
                                category: v.date,
                                value: v.value
                            }
                        })
                    } else {
                        lf.nativeUI.toast(res.msg)
                    }
                    cb && cb(data)
                }, function(error) {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(error.msg)
                })
            },
            refreshAreaList (cb) {
                const {areaSelect} = this
                if (!areaSelect.value) {
                    return
                }
                this.queryTotalMoreData({
                    type: this.queryType.areaList,
                    areaCode: areaSelect.value
                }, data => {
                    if (data) {
                        this.areaList = data
                    }
                    cb && cb()
                })
            },
            refreshProvinceList (cb) {
                const {provinceSelect} = this
                if (!provinceSelect.value) {
                    return
                }
                this.queryTotalMoreData({
                    type: this.queryType.provinceList,
                    provinceCode: provinceSelect.value
                }, data => {
                    if (data) {
                        this.provinceList = data
                    }
                    cb && cb()
                })
            },
            refreshLineList (cb) {
                const {lineSelect} = this
                if (!lineSelect.value) {
                    return
                }
                this.queryTotalMoreData({
                    type: this.queryType.lineList,
                    lineName: lineSelect.value
                }, data => {
                    if (data) {
                        this.lineList = data
                    }
                    cb && cb()
                })
            },
            refreshProductList (cb) {
                const {productSelect} = this
                if (!productSelect.value) {
                    return
                }
                this.queryTotalMoreData({
                    type: this.queryType.productList,
                    productId: productSelect.value
                }, data => {
                    if (data) {
                        this.productList = data
                    }
                    cb && cb()
                })
            },
            init (cb) {
                /*this.initPickerData(() => {
                    this.refreshAreaList(() => {
                        this.refreshProvinceList(() => {
                            this.refreshLineList(() => {
                                this.refreshProductList(cb)
                            })
                        })
                    })
                })*/
                this.initPicker()
                this.initPickerData(cb)
            },
            initMui () {
                this.pageType = lf.window.currentWebview().pageType
                console.log('pageTypeConstant', this.pageType)
                this.$nextTick(() =>{
                    this.init()
                })
                let deceleration = mui.os.ios ? 0.003 : 0.0009;
                mui('.mui-scroll-wrapper').scroll({
                    bounce: false,
                    indicators: true, //是否显示滚动条
                    deceleration: deceleration
                })
            }
        },
        created () {
            lf.ready(() => {
                this.initMui()
            })
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
                        .switchover{
                            padding: 1px 4px;
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