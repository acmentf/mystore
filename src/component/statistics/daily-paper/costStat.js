import utils from '@/js/utils'
const typeConstant = {
    area: 'area',
    province: 'province',
    line: 'line',
    travel: 'travel'
}
const ajaxUrlMap = {
    [typeConstant.area] () {
        return `/costReport/queryCostStatisticsOfAreaDimension`
    },
    [typeConstant.province] () {
        return `/costReport/queryCostStatisticsOfProvinceDimension`
    },
    [typeConstant.line] () {
        return `/costReport/queryCostStatisticsOfLineDimension`
    },
    [typeConstant.travel] () {
        return `/costReport/queryCostStatisticsOfTravelDimension`
    }
}
function getAjaxUrl (type, options) {
    let fn = ajaxUrlMap[type]
    return fn ? fn(options) : ''
}
function formatterNumber (value) {
    return utils.isValidNumber(value) ? +value : 0
}
function dealList (list, tableHead = []) {
    tableHead = tableHead.concat([
        'totalPhotogCosts',
        'inputCosts',
        'preIncome',
        'salesIncome',
        'outputIncome',
        'inputOutputRatio',
        'inputOutputRatioWithoutPhotog'
    ].map(prop => ({prop})))
    return (list || []).map(v => {
        tableHead.forEach(({prop}) => {
            if (prop in v) {
                v[prop] = formatterNumber(v[prop])
            }
        })
        let inputCostsHasPhotographer = utils.add(v.inputCosts, v.totalPhotogCosts)
        let grossMargin = utils.sub(v.outputIncome, v.inputCosts)
        let grossMarginHasPhotographer = utils.sub(v.outputIncome, inputCostsHasPhotographer)
        let grossMarginRatio = utils.calcPercent(grossMargin, v.outputIncome, {isAddSymbol: false})
        let grossMarginRatioHasPhotographer = utils.calcPercent(grossMarginHasPhotographer, v.outputIncome, {isAddSymbol: false})
        return {
            ...v,
            inputCostsHasPhotographer,
            grossMargin,
            grossMarginHasPhotographer,
            grossMarginRatio,
            grossMarginRatioHasPhotographer
        }
    })
}
export {
    typeConstant,
    getAjaxUrl,
    dealList
}
