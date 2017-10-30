var deviceWidth = document.documentElement.clientWidth
//if(deviceWidth > 640) deviceWidth = 640
document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
window.onresize = function() {
	var deviceWidth = document.documentElement.clientWidth
//	if(deviceWidth > 640) deviceWidth = 640
	document.documentElement.style.fontSize = deviceWidth / 7.5 + 'px'
}

//角色 id 枚举
var ROLE_EMUN = {
    // 总经办
    officeManager: {
        id: 15,
        windowId: 'officeManager',
        pageUrl: 'statistics/daily-paper.html',
        // pageUrl: 'market-expansion/market-expansion.html',
    },
    // 渠道
    commissioner: {
        id: 16,
        windowId: 'market-expansion',
        pageUrl: 'market-expansion/market-expansion.html',
    },
    // 城市经理
    cityManager: {
        id: 12,
        windowId: 'daily-manage',
        pageUrl: 'daily-manage/daily-manage.html'
    }
}