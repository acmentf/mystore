lf.ready(function() {
    var vm = new Vue({
        el: '#app',
        data: {
        }
    })
    // 销售明细
    mui('body').on('tap', '.sale-detail', function() { 
        lf.window.openWindow('/sale-detail/saledetail.html ', '../sale-detail/saledetail.html', {}, {
        })
    })
    mui('body').on('tap', '#menu', function() {
        console.log(111)
        var mask = mui.createMask(function(){

        });
    })
})