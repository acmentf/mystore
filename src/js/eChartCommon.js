'use strict';
function getStartValue (list, count) {
    return list.length > count ? list.length - count : 0
}
function legendDataBySeries (series) {
    return (Array.isArray(series) ? series : [series]).map((v) => v.name)
}
export default {
    getStartValue,
    legendDataBySeries
}
