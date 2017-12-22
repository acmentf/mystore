export function hasShowPlanBtn(obj: Array<any>, vm: any): void {
    if (!obj) return

    interface roleMap {
        manager: number;
        worker: number;
    }

    let roleList: Array<number> = []
    let roleMap: roleMap = {
        manager: 17, // 渠道经理roleId
        worker: 16 // 渠道专员roleId
    }

    obj.forEach(function(item) {
        roleList.push(item.roleId)
    })

    if (roleList.indexOf(roleMap.manager) > -1 && roleList.indexOf(roleMap.worker) > -1) {
        vm.isShowPlanBtn = false
    }
}