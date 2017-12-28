<template>
    <div class="statistics-daily-paper-cost-stat">
        <div class="search-form">
            <div class="item-row shortcuts-date-item clearfix">
                <button type="button" class="item mui-btn"
                        v-for="item in shortcutsDateOptions"
                        :key="item.text"
                        v-text="item.text"
                        v-tap="{ methods : shortcutsPickerDate, date: item.date }">
                </button>
            </div>
            <div class="item-row clearfix">
                <div class="data-item lf" v-tap="{ methods : pickerDate, key: 'startDate' }">
                    <span class="lab">开始日期</span>
                    <span class="value" v-text="searchForm.startDate"></span>
                </div>
                <div class="data-item rt" v-tap="{ methods : pickerDate, key: 'endDate' }">
                    <span class="lab">结束日期</span>
                    <span class="value" v-text="searchForm.endDate"></span>
                </div>
            </div>
            <div class="item-row range-item" v-tap="{ methods : selectRange }">
                <span class="lab">选择范围</span>
                <span class="value type-name" v-text="typeName"></span>
            </div>
            <div class="item-row switch-item">
                <div class="mui-input-row mui-checkbox mui-left">
                    <label>摄影师成本</label>
                    <input v-model="hasPhotographer" type="checkbox">
                </div>
                <button type="button" class="mui-btn switchover"
                        v-text="isDetail ? '查看柱状图' : '查看趋势图'"
                        v-tap="{ methods : switchChartType }">
                </button>
            </div>
        </div>
        <div class="section-content">
            <e-charts :style="calcBarChartStyle(chartOption)" ref="chart" :options="chartOption" auto-resize></e-charts>
        </div>
        <linkage-picker
                :data="regionMoreList"
                :visible.sync="regionMorePicker"
                @change="selectRangeChange"
        ></linkage-picker>
    </div>
</template>
<script>
    import {typeConstant, getAjaxUrl, getTableColumn, dealList} from './costStat'
    import utils from '../../../js/utils'
    import linkagePicker from '@/component/linkage-picker'
    const typeTitleMap = {
        [typeConstant.area]: '大区',
        [typeConstant.province]: '省份',
        [typeConstant.line]: '线路',
        [typeConstant.travel]: '旅行社'
    }
    const typeList = [
        typeConstant.area,
        typeConstant.province,
        typeConstant.line,
        typeConstant.travel
    ]
    const dateMap = {
        day7: utils.recentDay(7).map(v => v.format('yyyy-MM-dd')),
        day15: utils.recentDay(15).map(v => v.format('yyyy-MM-dd')),
        day30: utils.recentDay(30).map(v => v.format('yyyy-MM-dd'))
    }
    const dtPicker = new mui.DtPicker({
        type: 'date'
    })
    export default {
        name: 'costStat',
        components: {
            ECharts: VueECharts,
            linkagePicker
        },
        data () {
            return {
                formLabelWidth: '115px',
                formItemStyle: {
                    width: '155px'
                },
                searchForm: {
                    typeSel: [],
                    startDate: dateMap.day30[0],
                    endDate: dateMap.day30[1]
                },
                hasPhotographer: true,
                shortcutsDateOptions: [
                    {
                        text: '最近7天',
                        date: dateMap.day7
                    },
                    {
                        text: '最近15天',
                        date: dateMap.day15
                    },
                    {
                        text: '最近30天',
                        date: dateMap.day30
                    }
                ],
                regionMorePicker: false,
                regionMoreList: [],
                tableHead: [],
                list: [],
                activeChart: 'bar'
            }
        },
        computed: {
            typeConstant () {
                return typeConstant
            },
            isDetail () {
                return this.activeChart === 'line'
            },
            type () {
                return typeList[this.searchForm.typeSel.length - 1] || typeConstant.area
            },
            typeName () {
                let ret = ''
                let typeSel = this.searchForm.typeSel
                if (typeSel.length === 0) {
                    ret = typeTitleMap[typeConstant.area]
                } else {
                    ret = typeSel.map((v, i) => {
                        return v.value === '' ? typeTitleMap[typeList[i]] : v.text
                    }).join('/')
                }
                return ret
            },
            hasTableHead () {
                let type = this.type
                return type === typeConstant.line || type === typeConstant.travel
            },
            ajaxParams () {
                const {searchForm} = this
                let typeSel = this.searchForm.typeSel
                let p = {
                    areaCode: ''
                }
                let typeMap = {
                    '0': 'areaCode',
                    '1': 'provinceCode',
                    '2': 'name',
                    '3': 'name'
                }
                if (typeSel.length > 0) {
                    typeSel.forEach((v, i) => {
                        let key = typeMap[i]
                        if (key) {
                            p[key] = v.value
                        }
                    })
                }
                return {
                    ...p,
                    queryType: this.isDetail ? '2' : '1',
                    startDate: searchForm.startDate || '',
                    endDate: searchForm.endDate || ''
                }
            },
            charts () {
                let inputCosts = this.hasPhotographer ? 'inputCosts_hasPhotographer' : 'inputCosts'
                let inputOutputRatio = this.hasPhotographer ? 'inputOutputRatio' : 'inputOutputRatioWithoutPhotog'
                let ret = {
                    bar: {series: []},
                    line: {series: []}
                }
                if (this.activeChart === 'bar') {
                    ret.bar = (list => {
                        let series = []
                        let xAxisData = []
                        let seriesOpts = [
                            {
                                prop: inputOutputRatio,
                                label: '投入产出比'
                            }
                        ]
                        seriesOpts.forEach(({prop, label}, index) => {
                            let seriesData = []
                            list.forEach((item) => {
                                let value = +item[prop]
                                if (index === 0) {
                                    xAxisData.push(item.name)
                                }
                                seriesData.push({
                                    extData: item,
                                    value
                                })
                            })
                            series.push({
                                name: label,
                                type: 'bar',
                                barMaxWidth: 30,
                                label: {
                                    normal: {
                                        show: true,
                                        formatter: '{c}%',
                                        position: 'right'
                                    }
                                },
                                data: seriesData
                            })
                        })
                        return {
                            tooltip: {
                                trigger: 'axis',
                                formatter (params) {
                                    let title = params[0] ? params[0].name : ''
                                    let other = ''
                                    let content = params.map(item => {
                                        if (!other) {
                                            let span = '<span style="display:inline-block;width:18px;height:9px;"></span>'
                                            let extData = item.data.extData
                                            let value = {
                                                inputCosts: extData[inputCosts] || 0,
                                                outputIncome: extData.outputIncome || 0
                                            }
                                            other = `${span}投入成本 : ${value.inputCosts}元<br>${span}产出收入 : ${value.outputIncome}元`
                                        }
                                        return `${utils.getTooltipMarker(item.color)} ${item.seriesName} :&nbsp;&nbsp;${item.value}%`
                                    }).join('<br>')
                                    return title + '<br>' + content + '<br>' + other
                                }
                            },
                            grid: {
                                containLabel: true,
                                top: 10,
                                left: 14,
                                right: 70,
                                bottom: 20
                            },
                            xAxis: {
                                name: '',
                                show: false,
                                type: 'value'
                            },
                            yAxis: {
                                type: 'category',
                                axisTick: {
                                    show: false
                                },
                                axisLabel: {
                                    formatter (value, index) {
                                        return utils.truncationStr(value, 12)
                                    },
                                    interval: 0
                                },
                                data: xAxisData
                            },
                            series: series
                        }
                    })(utils.sortListByNumber(this.list, inputOutputRatio, {isAscending: true}))
                } else if (this.activeChart === 'line') {
                    ret.line = (list => {
                        let series = []
                        let xAxisData = []
                        let seriesOptsMap = {}
                        list.forEach(item => {
                            let arr = seriesOptsMap[item.name]
                            if (!arr) {
                                arr = seriesOptsMap[item.name] = []
                            }
                            arr.push(item)
                        })
                        Object.keys(seriesOptsMap).forEach((label, index) => {
                            let seriesData = []
                            utils.sortListByString(seriesOptsMap[label], 'queryDate', {isAscending: true, isCopy: false}).forEach((item) => {
                                let value = +item[inputOutputRatio]
                                if (index === 0) {
                                    xAxisData.push(item.queryDate)
                                }
                                seriesData.push({
                                    extData: item,
                                    value
                                })
                            })
                            series.push({
                                name: label,
                                type: 'line',
                                label: {
                                    normal: {
                                        formatter: '{c}%',
                                        show: true
                                    }
                                },
                                data: seriesData
                            })
                        })
                        //
                        let numeratorKey = inputCosts
                        let denominatorKey = 'outputIncome'
                        return {
                            tooltip: {
                                trigger: 'axis',
                                formatter (params) {
                                    let title = params[0] ? params[0].name : ''
                                    let content = params.map(item => {
                                        let numerator = item.data.extData[numeratorKey]
                                        let denominator = item.data.extData[denominatorKey]
                                        let tip = ''
                                        if (utils.isDef(numerator) && utils.isDef(denominator)) {
                                            tip = `&nbsp;&nbsp(${numerator}/${denominator})`
                                        }
                                        return `${utils.getTooltipMarker(item.color)} ${item.seriesName} :&nbsp;&nbsp;${item.value}%${tip}`
                                    }).join('<br>')
                                    return title + '<br>' + content
                                }
                            },
                            dataZoom: [
                                {
                                    show: true,
                                    realtime: true,
                                    type: 'inside',
                                    orient: 'horizontal',
                                    zoomLock: false,
                                    start: 0,
                                    end: 100
                                }
                            ],
                            legend: {
                                type: 'scroll',
                                left: 'center',
                                width: '90%',
                                bottom: 20,
                                // data: utils.legendDataBySeries(series),
                                ...(() => {
                                    let selected = {}
                                    let data = series.slice().sort((a, b) => {
                                        let a1 = +a.data[a.data.length - 1]
                                        let b1 = +b.data[b.data.length - 1]
                                        return b1 - a1
                                    }).map((v, i) => {
                                        // selected[v.name] = +v.data[v.data.length - 1] > 0
                                        selected[v.name] = i === 0
                                        return v
                                    }).map((v) => v.name)
                                    return {
                                        selected,
                                        data
                                    }
                                })()
                            },
                            grid: {
                                containLabel: true,
                                top: 20,
                                left: 24,
                                right: 10,
                                bottom: 80
                            },
                            yAxis: {
                                name: '',
                                show: false,
                                type: 'value'
                            },
                            xAxis: {
                                type: 'category',
                                axisLabel: {
                                    formatter (value, index) {
                                        return utils.truncationStr(value, 12)
                                    },
                                    rotate: 40
                                },
                                data: xAxisData
                            },
                            series: series
                        }
                    })(this.list || [])
                }
                return ret
            },
            chartKeyList () {
                return Object.keys(this.charts)
            },
            chartOption () {
                return this.charts[this.activeChart]
            }
        },
        watch: {
            activeChart (val) {
                this.queryData()
            },
            ajaxParams (val) {
                this.queryData()
            }
        },
        methods: {
            shortcutsPickerDate (params) {
                const date = params.date
                const {searchForm} = this
                searchForm.startDate = date[0] || ''
                searchForm.endDate = date[1] || ''
            },
            pickerDate (params) {
                const key = params.key
                const {searchForm} = this
                // searchForm[key] && dtPicker.setSelectedValue(searchForm[key])
                if (key === 'startDate') {
                    let arr = searchForm.endDate.split('-')
                    dtPicker.init({
                        type: 'date',
                        value: searchForm[key],
                        endYear: +arr[0],
                        endMonth: +arr[1],
                        endDay: +arr[2]
                    })
                } else {
                    let arr = searchForm.startDate.split('-')
                    dtPicker.init({
                        type: 'date',
                        value: searchForm[key],
                        beginYear: +arr[0],
                        beginMonth: +arr[1],
                        beginDay: +arr[2]
                    })
                }
                dtPicker.show(selectedItem => {
                    searchForm[key] = selectedItem.text
                });
            },
            selectRange () {
                this.regionMorePicker = true
            },
            selectRangeChange (data, done) {
                if (data && data.length) {
                    done()
                    this.searchForm.typeSel = data.map(v => {
                        return {
                            value: v.value,
                            text: v.text
                        }
                    })
                }
            },
            switchChartType () {
                let index = this.chartKeyList.indexOf(this.activeChart)
                index += 1
                if (index === this.chartKeyList.length) {
                    index = 0
                }
                this.activeChart = this.chartKeyList[index]
            },
            calcBarChartHeight: function (options) {
                let height = 0
                let yAxis = options.yAxis
                if (yAxis) {
                    height = yAxis.data.length * 38 + 50
                }
                return height
            },
            calcBarChartStyle: function (options) {
                let height = this.activeChart === 'bar' ? this.calcBarChartHeight(options) : 240
                return {
                    height: height + 'px'
                }
            },
            /*下拉数据*/
            //初始化大区省份列表
            initRegionMore: function (cb) {
                lf.nativeUI.showWaiting()
                lf.net.getJSON('/costReport/analysisMobile/queryRegionProvLine', {}, res => {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        let allOpt = {
                            value: '',
                            text: '全部'
                        }
                        this.regionMoreList = [allOpt].concat((res.data || []).map(item => {
                            return {
                                value: item.areaCode + '',
                                text: item.areaName,
                                children: [allOpt].concat((item.list || []).map(item => {
                                    return {
                                        value: item.provinceCode + '',
                                        text: item.provinceName,
                                        children: [allOpt].concat((item.list || []).map(text => {
                                            return {
                                                value: text,
                                                text: text
                                            }
                                        }))
                                    }
                                }))
                            }
                        }))
                        /* let temp = this.regionMoreList[0]
                        this.searchForm.typeSel = [
                            {
                                value: temp.value,
                                text: temp.text
                            }
                        ] */
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
            queryData (cb) {
                lf.nativeUI.showWaiting()
                this.tableHead = []
                this.list = []
                lf.net.getJSON(getAjaxUrl(this.type), this.ajaxParams, (res) => {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        if (this.hasTableHead) {
                            let data = res.data || {}
                            this.tableHead = data.header || []
                            this.list = dealList(data.content || [])
                        } else {
                            this.list = dealList(res.data || [])
                        }
                        this.resize()
                    } else {
                        lf.nativeUI.toast(res.msg)
                    }
                    cb && cb()
                }, (res) => {
                    lf.nativeUI.closeWaiting()
                    cb && cb()
                    lf.nativeUI.toast(res.msg)
                })
            },
            init () {
                this.initRegionMore(_ => {
                    this.queryData()
                })
            },
            initMui () {
                this.init()
            },
            // 对外方法
            resize () {
                this.$nextTick(_ => {
                    this.$refs.chart && this.$refs.chart.resize()
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
    .statistics-daily-paper-cost-stat{
        padding: 0 14px;
        font-size: 14px;
        .lf{
            float: left;
        }
        .rt{
            float: right;
        }
        .search-form{
            color: #666;
            .item-row {
                .lab{
                    display: inline-block;
                    padding-right: 10px;
                }
                .value{
                    border-radius: 3px;
                    border: 1px solid #d9d9d9;
                    padding: 2px 8px;
                }
            }
            .item-row + .item-row {
                margin-top: 14px;
            }
            .shortcuts-date-item{
                .item{
                    float: left;
                    padding: 4px 8px;
                }
                .item + .item{
                    margin-left: 10px;
                }
            }
            .data-item{
                @media screen and (max-width: 364px) {
                    width: 100%;
                    &.rt{
                        margin-top: 14px;
                    }
                }
            }
            .range-item{
                display: flex;
                .lab{
                    min-width: 70px;
                    line-height: 27px;
                }
                .type-name{}
            }
            .switch-item{
                display: flex;
                justify-content: space-between;
                .mui-checkbox.mui-left{
                    label{
                        padding-left: 38px;
                    }
                    input[type=checkbox]{
                        left: 0;
                        &:before{
                            font-size: 22px;
                            position: relative;
                            top: 2px;
                        }
                    }
                }
                .switchover{
                    padding: 1px 4px;
                    height: 24px;
                    position: relative;
                    top: 6px;
                }
            }
        }
        .section-content{
            .echarts{
                overflow-y: hidden;
            }
        }
    }
</style>
