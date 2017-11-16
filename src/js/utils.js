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
    calcPercent (a, b) {
        let c = (a / b)
        c = !isNaN(c) || Math.abs(c) === Infinity ? c : 0
        c = c !== 0 ? toFixed(c * 100, 2) : 0
        return c
    },
    randomNumBoth (min,max){
        let range = max - min
        let rand = Math.random()
        return min + Math.round(rand * range); //四舍五入
    },
    //校验数字值
    isValidNumber (v) {
        v = +v
        return !!v && !isNaN(v)
    },
    // 截断字符串
    truncationStr(str, count) {
        str = str + ''
        return str.length > count ? str.slice(0, count - 1) + '...' : str
    }
}
