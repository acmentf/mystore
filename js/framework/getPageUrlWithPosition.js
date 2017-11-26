// 由于correlate-order 及 orderlist 里的跳转关系混乱，所以不在当前文件做页面跳转，
// 该文件只返回根据 roleId 以及 目录层级 返回 相应的映射 具体跳转参数，
// 没有对应映射的，单独在调用页面作特殊处理

//角色 id 枚举
var ROLE_EMUN = {
    // 角色：总经办，页面：daily-paper(日报)
    "15": {
        id: 15,
        windowId: 'office-manager',
        pageUrl: 'statistics/daily-paper.html',
    },
    // 角色：渠道人员，页面：market-expansion(渠道人员日报)
    "16": {
        id: 16,
        windowId: 'market-expansion',
        pageUrl: 'market-expansion/market-expansion.html',
    },
    // 角色：渠道经理，页面：manager-daily(渠道经理日报)
    "17" : {
        id: '',
        windowId: 'market-manager-daily',
        pageUrl: 'market-expansion/manager-daily.html'
    },
    // 角色：城市经理，页面：daily-manage(城市日报)
    "12": {
        id: 12,
        windowId: 'daily-manage',
        pageUrl: 'daily-manage/daily-manage.html'
    }
}
/**
 * 用户切换 岗位，根据 roleId，以及 目录层级 返回相应的跳转参数
 * @param {number} roleId 用户角色id
 * @param {number} dirLevel 当前页面相对于 app/ 目录的层级，
 * 例：
 * login.html 位于 app/ 下， 相对于 app/* 目录同级，则 dirLevel 值为 0；
 * orderlist.html 位于 app/order 下， 相对于 app/* 为子级目录，dirLevel 值为 1；
 */
function getPageUrlWithPosition(roleId, dirLevel){
    try {
        if(dirLevel < 0) {
            // 目录层级不能为负数
            throw 'dirLevel: 为 ' + dirLevel + ' ,dirLevel 不能为负数';
        }
    } catch(err) {
        throw err;
    }
    if(typeof ROLE_EMUN[roleId] == 'undefined') {
        // 角色id 不在 ROLE_EMUN 枚举中
        return false;
    }
    var pageUrl = (function(level){
        if(level == 0) {
            return './' + ROLE_EMUN[roleId].pageUrl;
        } else if (level > 0) {
            var temp = '';
            for(var i = 0; i < level; i++) {
                temp = temp.concat('../');
            }
            return temp + ROLE_EMUN[roleId].pageUrl;
        }
    }(dirLevel));
    return {
        windowId: ROLE_EMUN[roleId].windowId,
        pageUrl: pageUrl
    }
}