/*
 * 常用方法集合
 * */
//保留num位小数，支持number|string
function toFixed(value, num = 2, cutZero) {
    const type = typeof value
    if ((type === 'number' || type === 'string') && value !==  '') {
        if (type === 'string') {
            if (isNaN(Number(value))) {
                //转换失败，返回原始值
                return value
            }
            value = Number(value)
        }
        if (num < 0) {
            num = 0
        }
        value = value.toFixed(num).replace(/\.0+$/, '')

        if (cutZero) {
            if (value.indexOf('.') !== -1){
                value = value.replace(/0+$/, '')
            }
        }
        if (type === 'number'){
            value = +value
        }
    }
    return value
}
function encodeHTML (source) {
    return String(source)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}
function _divide (a, b) {
    let c = (a / b)
    return !isNaN(c) && Math.abs(c) !== Infinity ? c : 0
}
function isValidNumber (v) {
    v = +v
    return !!v && !isNaN(v)
}
export default {
    //把List强行转换为适用Tree的JSON嵌套格式
    transformTozTreeFormat (sNodes, {idKey = 'id', pIdKey = 'pId', rootPId = null, childrenKey = 'children'} = {}) {
        let i, l,
            key = idKey,
            parentKey = pIdKey,
            childKey = childrenKey;
        if (!key || key === '' || !sNodes) return [];

        if (Array.isArray(sNodes)) {
            let r = [];
            let tmpMap = {};
            for (i = 0, l = sNodes.length; i < l; i++) {
                tmpMap[sNodes[i][key]] = sNodes[i];
            }
            for (i = 0, l = sNodes.length; i < l; i++) {
                if (tmpMap[sNodes[i][parentKey]] && sNodes[i][key] !== sNodes[i][parentKey]) {
                    if (!tmpMap[sNodes[i][parentKey]][childKey])
                        tmpMap[sNodes[i][parentKey]][childKey] = [];
                    tmpMap[sNodes[i][parentKey]][childKey].push(sNodes[i]);
                } else {
                    r.push(sNodes[i]);
                }
            }
            return r;
        } else {
            return [sNodes];
        }
    },
    // 将图像转换为帆布;返回新画布元素
    createImagePng (image) {
        let canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;

        return canvas.toDataURL('image/png');
    },
    isDef(v) {
        return v !== undefined && v !== null
    },
    //保留num位小数，小数都为零时返回int
    toFixedAutoInt (value, num = 2) {
        return toFixed(value, num)
    },
    //保留num位小数，舍弃无意义的0
    toFixedCutZero (value, num = 2) {
        return toFixed(value, num, true)
    },
    //返回时间范围， beforeDay, afterDay以今天为基准
    recentDay (beforeDay, afterDay) {
        const end = new Date()
        const start = new Date()
        beforeDay = beforeDay || 0
        afterDay = afterDay || 0
        start.setTime(start.getTime() - 3600 * 1000 * 24 * beforeDay)
        end.setTime(end.getTime() + 3600 * 1000 * 24 * afterDay)
        return [start, end]
    },
    //返回当月时间范围
    currentMonth (){
        const end = new Date()
        const start = new Date()
        start.setDate(1)
        return [start, end]
    },
    calcPercent (a, b, {retainDecimal = 2, isAddSymbol = true} = {}) {
        let c = _divide(a, b)
        c = c !== 0 ? toFixed(c * 100, retainDecimal) : 0
        return isAddSymbol ? (c === Infinity ? '' : c + '%') : c
    },
    divide (a, b, {retainDecimal = 2} = {}) {
        let c = _divide(a, b)
        return c !== 0 ? toFixed(c, retainDecimal) : 0
    },
    add (a, b, {retainDecimal = 2} = {}) {
        let c = (isValidNumber(a) ? +a : 0) + (isValidNumber(b) ? +b : 0)
        return c !== 0 ? toFixed(c, retainDecimal) : 0
    },
    sub (a, b, {retainDecimal = 2} = {}) {
        let c = (isValidNumber(a) ? a : 0) - (isValidNumber(b) ? b : 0)
        return c !== 0 ? toFixed(c, retainDecimal) : 0
    },
    randomNumBoth (min,max){
        let range = max - min
        let rand = Math.random()
        return min + Math.round(rand * range); //四舍五入
    },
    //校验数字值
    isValidNumber,
    /**
     * 每三位默认加,格式化
     * @param {string|number} x
     * @return {string}
     */
    addCommas (x) {
        if (isNaN(x)) {
            return '-'
        }
        x = (x + '').split('.')
        return x[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g,'$1,')
            + (x.length > 1 ? ('.' + x[1]) : '')
    },
    // 截断字符串
    truncationStr(str, count) {
        str = str + ''
        return str.length > count ? str.slice(0, count - 1) + '...' : str
    },
    encodeHTML,
    /* eChart common start*/
    getStartValue (list, count) {
        return list.length > count ? list.length - count : 0
    },
    legendDataBySeries (series) {
        return (Array.isArray(series) ? series : [series]).map((v) => v.name)
    },
    /**
     * @param {string} color
     * @param {string} [extraCssText]
     * @return {string}
     */
    getTooltipMarker (color, extraCssText) {
        return color
            ? `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;
              background-color:${encodeHTML(color)}; ${extraCssText || ''}"></span>`
            : ''
    },
    getTooltipPositionByMore ({loseHeight = false} = {}) {
        return function (pos, params, dom, rect, {contentSize, viewSize}) {
            let ret = [pos[0], pos[1]]
            if (pos[0] + contentSize[0] > viewSize[0] + 5) {
                ret[0] = viewSize[0] - contentSize[0] - 5
                if (ret[0] < 0) {
                    ret[0] = 0
                }
            }
            if (pos[1] + contentSize[1] > viewSize[1] + 5) {
                ret[1] = viewSize[1] - contentSize[1] - 5
                if (ret[1] < 0 && !loseHeight) {
                    ret[1] = 0
                }
            }
            return ret
        }
    },
    /* eChart common end*/
    // number sort
    sortListByNumber (list, key, {isCopy = true, isAscending = false} = {}) {
        return (isCopy ? list.map(v => {
            return {...v}
        }) : list).sort((a, b) => {
            if (isAscending) {
                return a[key] - b[key]
            } else {
                return b[key] - a[key]
            }
        })
    },
    // string sort
    sortListByString (list, key, {isCopy = true, isAscending = false} = {}) {
        return (isCopy ? list.map(v => {
            return {...v}
        }) : list).sort((a, b) => {
            if (isAscending) {
                return (a[key] + '').localeCompare(b[key] + '')
            } else {
                return (b[key] + '').localeCompare(a[key] + '')
            }
        })
    },
    /**
     * 获取列表的合计
     * @param list
     * @param noCalcValues 非计算值赋值
     * @returns {*}
     */
    getTotalByList (list, noCalcValues = {}) {
        let total = null
        if (list.length) {
            const columns = Object.keys(list[0])
            total = {}
            columns.forEach((property, index) => {
                if (property in noCalcValues) {
                    total[property] = noCalcValues[property]
                    return
                }
                const values = list.map(item => Number(item[property]))
                if (!values.every(value => isNaN(value))) {
                    total[property] = values.reduce((prev, curr) => {
                        const value = Number(curr)
                        if (!isNaN(value)) {
                            return prev + curr
                        } else {
                            return prev
                        }
                    }, 0)
                    // sums[index] += ' 元'
                } else {
                    // sums[index] = 'N/A'
                    total[property] = ''
                }
            })
        }
        return total
    },
    /**
     * element table summary-method 使用
     * @param total 合计对象
     * @param columns (element table summary-method 函数 param.columns)
     * @returns {Array}
     */
    getTableSummaryByTotal (total, columns) {
        let sums = []
        columns.forEach((column, index) => {
            sums[index] = total[column.property]
        })
        return sums
    }
}
