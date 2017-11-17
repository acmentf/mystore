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
                res.data.forEach(function(item, id){
                    var index;
                    res.data[id].createTime = lf.util.timeStampToDate2(item.createTime);
                    sortArr.forEach(function(el, i){
                        if( el.purchaser == item.purchaser ){
                            return index = i;
                        }
                    });
    
                    if( index ){
                        sortArr[index].orderList.push(item);
                    } else {
                        sortArr.push({
                            purchaser: item.purchaser,
                            orderList: [].concat(item)
                        });
                    }
                });
    
                vm.purchaserOrderList = sortArr;
            }
        } else {
            lf.nativeUI.toast(res.msg);
        }
    });

    mui('body').on('tap', '.section-1-block', function(){
        // 跳转到任务完成详情
        var orderId = this.getAttribute('data-orderid');
        lf.window.openWindow('service-detail', './service-detail.html', {}, {
            orderId: orderId,
        })
    })
})