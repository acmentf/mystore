import utils from '../../../js/utils'

const pageTypeConstant = {
    income: 'income',
    flow: 'flow',
    history: 'history',
    photo: 'photo'
}
const chartTypeConstant = {
    day: 'day',
    acc: 'acc'
}
const totalMoreTypeConstant = {
    people: 1,
    peopleAcc: 2,
    income: 3,
    incomeAcc: 4
}
/* chart start*/
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
const BAR_TOOLTIP = {
    trigger: 'axis',
    show: true
}
const BAR_Y_AXIS_TICK = {
    show: false
}
const BAR_X_AXIS = {
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
const BAR_AXIS_LABEL_LEFT = 100
const BAR_AXIS_LABEL_RIGHT = 70

//获取line的chart option
function getLineChartOption(list, seriesOpts) {
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
                xAxisData.push(item.noTruncation ? item[categoryKey] : utils.truncationStr(item[categoryKey], X_AXIS_NAME_COUNT))
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
                xAxisData.push(item.noTruncation ? item[categoryKey] : utils.truncationStr(item[categoryKey], X_AXIS_NAME_COUNT))
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
//获取Bar的chart option(长category)
function getBarLongCategoryChartOption(list, seriesOpts) {
    let xAxisData = []
    let series = []
    seriesOpts = Array.isArray(seriesOpts) ? seriesOpts : [seriesOpts]
    seriesOpts.forEach(function (opt, groupIndex) {
        let categoryKey = opt.categoryKey;
        let valueKey = opt.valueKey
        let seriesData = []

        list.forEach(function(item) {
            let value = +item[valueKey]
            if (groupIndex) {
                xAxisData.push(item.noTruncation ? item[categoryKey] : utils.truncationStr(item[categoryKey], X_AXIS_NAME_COUNT))
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
/* chart end*/

export {
    pageTypeConstant,
    chartTypeConstant,
    totalMoreTypeConstant,
    EACH_SCREEN_COUNT,
    X_AXIS_NAME_COUNT,
    DATA_ZOOM_INSIDE,
    GRID_TOP,
    GRID_BOTTOM,
    getLineChartOption,
    getLineLongCategoryChartOption,
    getBarLongCategoryChartOption
}