Vue.filter('dateFormatter', function(date){
    var reg = /^NaN/;
    var result = new Date(date).format('yyyy-MM-dd');
    if(!reg.test(result)) {
        return result;
    } else {
        return '';
    }
});
Vue.filter('actionStatusFormat', function(val){
    var emum = {
        0: "待计调", 11: "待分配", 22: "待输出", 33: "待销售", 44: "已确认销售", 55: "已完成"
    }
    return emum[val];
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
    data: function() {
        return {
            date: '',
            purchaserOrderList: [
                
            ],
            userName: ''
        }
    },
    methods: {
        formatDate: function(date) {
            return new Date(date).format('yyyy-MM-dd');
        }
    }
});

lf.ready(function() {
    mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, //是否显示滚动条
        deceleration: mui.os.ios ? 0.003 : 0.0009
    });
    
    var date, userId, userName;
    date = lf.window.currentWebview().date;
    userId = lf.window.currentWebview().userId;
    userName = lf.window.currentWebview().userName;
    vm.userName = userName;
    
    vm.date = date;
    lf.nativeUI.showWaiting();
    lf.net.getJSON('/plan/queryPurchaserOrderList', {
        saleDate: date,
        userId: userId
    }, function(res) {
        lf.nativeUI.closeWaiting();
        if(res.code == 200) {
            if(res.data.length == 0) {
                lf.nativeUI.toast('没有详细数据');
            } else {
                var sortArr = [];
                for(let i = 0; i < res.data.length; i++) {
                    var item = res.data[i];
                    item.createTime = lf.util.timeStampToDate2(item.createTime);

                    item.orderShow = (function(item){
                        if(!item.saleDate) {
                            return true;
                        } else {
                            return item.saleDate == date;
                        }
                    }(item));

                    if (!item.orderShow) {
                        // 如果当前订单 orderShow 为 false，直接进入下一次循环；
                        // 保证了 sortArr 下，所有的 旅行社组别 里，都是可显示的订单。
                        continue;
                    }

                    var index = undefined;
                    for(var j = 0; j < sortArr.length; j++) {
                        if(sortArr[j].purchaser == item.purchaser) {
                            index = j;
                            break;
                        }
                    }
                    if(index === undefined) {
                        sortArr.push({
                            purchaser: item.purchaser,
                            orderList: [].concat(item)
                        });
                    } else {
                        sortArr[index].orderList.push(item);
                    }
                }
                console.log(sortArr);
    
                vm.purchaserOrderList = sortArr;
            }
        } else {
            lf.nativeUI.toast(res.msg);
        }
    });

    mui('body').on('tap', '.order-container', function(){
        // 跳转到任务完成详情
        var orderId = this.getAttribute('data-orderid');
        lf.window.openWindow('service-detail', './service-detail.html', {}, {
            orderId: orderId,
        })
    })
})