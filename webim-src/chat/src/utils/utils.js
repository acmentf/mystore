import _ from 'lodash'

export const getOrganizeUserName = (state, userId) => {
    const organizes = state.organizes
    let userName = userId
    let flag = false

    organizes.forEach(element => {
        (element.positionUserList || []).forEach((item) => {
            if (item.id == userId) {
                userName = item.name
                flag = true
                return
            }
        })

        if (flag) return
    });

    return userName
}

/**
	 * 获取指定的url查询参数值
	 * @param {string} pname 参数名称
	 * @param {string} purl url地址，默认为当前url地址
	 */
export const getParameterByName = (pname, purl) => {
    let name = pname
    let url = purl

    if (!url) url = window.location.href

    name = name.replace(/[[\]]/g, '\\$&')

    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`)
    const results = regex.exec(url)

    if (!results) return null
    if (!results[2]) return ''

    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}