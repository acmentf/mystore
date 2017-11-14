var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            date: '',
            detailList: [
                
            ]
        }
    }
});

lf.ready(function() {
    var date = Utils.getPageParams("group-plan-completion").date;
    vm.date = date;
    lf.nativeUI.showWaiting();
    lf.net.getJSON('/purchaser/getPurchaserPlanDetail', {
        date: date,
        userId: window.Role.usercode
    }, function(res) {
        lf.nativeUI.closeWaiting();
        if(res.code == 200) {
            if(res.data.length == 0) {
                lf.nativeUI.toast('没有详细数据');
            } else {
                vm.detailList = res.data;
            }
        } else {
            lf.nativeUI.toast(res.msg);
        }
    });


    mui('body').on('tap', '#backToLast', function(){
        debugger
        // lf.window.openWindow('market-expansion','../market-expansion/market-expansion.html',{},{
        //     date: date
        // })        
    });
})