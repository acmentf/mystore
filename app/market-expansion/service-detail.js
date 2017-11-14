// var emun = {
//     0: "待计调",
//     11: "待分配",
//     22: "待输出",
//     33: "待销售",
//     44: "待完成",
//     55: "已完成"
// }
Vue.filter('status1', function(actionStatus){
    // 计调状态
    if(actionStatus > 0) {
        return '已计调';
    }
    return '待计调';
});
Vue.filter('status2', function(actionStatus){
    // 摄影师分配状态
    if(actionStatus > 11) {
        return '已分配';
    }
    return '待分配';
});
Vue.filter('status3', function(actionStatus){
    // 输出状态
    if(actionStatus > 22) {
        return '已输出';
    }
    return '待输出';
});
Vue.filter('status4', function(actionStatus){
    // 销售状态
    if(actionStatus > 33) {
        return '已销售';
    }
    return '待销售';
});
Vue.filter('status5', function(actionStatus){
    // 状态
    if(actionStatus > 44) {
        return '已完成';
    }
    return '待完成';
});
Vue.filter('photoStatus', function(status) {
    var emun = {
        0: '未确认拍摄',
        1: '确认拍摄',
        2: '无法拍摄'
    }
    return emun[status];
});
Vue.filter('lengthTo8', function(value, length){
    if(value) {
        if(value.length > length) {
            return value.substr(0, length) +'...'
        } else {
            return value
        }
    }
});
var vm = new Vue({
    el: '#app',
    data: function () {
        return {
            // 执行状态
            actionStatus: 0,
            // 执行人
            executeManagerRole: '',
            // 摄影主管
            photoManagerRole: '',
            // 输出人
            outputRole: '',
            // 实际服务人数
            serverPerNum: '',
            // 拍摄张数
            shootNum: '',
            // 选片张数
            selectNum: '',
            // 打印张数
            printNum: '',
            // 销售人
            saleRole: '',
            // 实销张数
            salesNum: '',
            // 实销人数
            salesPerNum: '',
            // 应收金额
            payableAmount: '',
            // 预付金额
            advanceAmount: '',
            // 实销金额
            salesAmt: '',
            // 摄影师列表
            photographerList: []
        }
    }
});

lf.ready(function () {
    mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, //是否显示滚动条
        deceleration: mui.os.ios ? 0.003 : 0.0009
    });
    var orderId;
    orderId = lf.window.currentWebview().orderId;
    lf.nativeUI.showWaiting();
    lf.net.getJSON('/order/purchaserOrderDetail', {
        orderId: orderId,
    }, function (res) {
        lf.nativeUI.closeWaiting();
        if (res.code == 200) {
            var strArr = [// 执行状态
                "actionStatus",
                // 执行人
                "executeManagerRole",
                // 摄影主管
                "photoManagerRole",
                // 输出人
                "outputRole",
                // 实际服务人数
                "serverPerNum",
                // 拍摄张数
                "shootNum",
                // 选片张数
                "selectNum",
                // 打印张数
                "printNum",
                // 销售人
                "saleRole",
                // 实销张数
                "salesNum",
                // 实销人数
                "salesPerNum",
                // 应收金额
                "payableAmount",
                // 预付金额
                "advanceAmount",
                // 实销金额
                "salesAmt",
                // 摄影师列表
                "photographerList"
            ];
            strArr.forEach(function(item) {
                vm[item] = res.data[item];
            });
        } else {
            lf.nativeUI.toast(res.msg);
        }
    }, function(error) {
        lf.nativeUI.closeWaiting()
        lf.nativeUI.toast(error.msg);
    });
})