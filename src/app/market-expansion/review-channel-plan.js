Vue.filter('dateFormatter', function(date){
    var reg = /^NaN/;
    var result = new Date(date).format('yyyy-MM-dd');
    if(!reg.test(result)) {
        return result;
    } else {
        return '';
    }
});

Vue.filter('dayFormatter', function(date){
    var dayArr = ['日', '一', '二', '三', '四', '五', '六'];
    var timeStamp = new Date(date);
    return timeStamp.format('yyyy-MM-dd') + ' 星期' + dayArr[timeStamp.getDay()];
});
Vue.filter('toFixed2', function(value) {
    return Number(value).toFixed(2);
});

var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            userId: lf.window.currentWebview().userId,
            userName: lf.window.currentWebview().userName,
            planList: []
        }
    }
});

lf.ready(function(){
    var getPlanList = function() {
        lf.nativeUI.showWaiting();

        lf.net.getJSON('/purchaser/getPurchaserPlan', {
            date: new Date().format('yyyy-MM-dd'),
            userId: vm.userId
        }, function(res){
            lf.nativeUI.closeWaiting();

            if(res.code == 200) {
                vm.planList = res.data;
            } else {
                lf.nativeUI.toast(res.msg);
            }
        }, function(erro) {
            lf.nativeUI.closeWaiting();
            lf.nativeUI.toast(erro.msg);
        })
    }

    getPlanList()
})