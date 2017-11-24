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