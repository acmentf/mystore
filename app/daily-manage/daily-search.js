var vm = new Vue({
    el: '#app',
    data: {
        startTime: '',
        finishTime: ''
    }
})
lf.ready(function(){
    mui('#app').on('tap', '.startTime', function () { //选择日报开始日期
        var opts = { "type": "date" };
        picker = new mui.DtPicker(opts);
        picker.setSelectedValue(vm.startTime)
        picker.show(function (select) {
            vm.startTime = select.value
        })
    })
    mui('#app').on('tap', '.finishTime', function () { //选择日报结束日期
        var opts = { "type": "date" };
        picker = new mui.DtPicker(opts);
        picker.setSelectedValue(vm.finishTime)
        picker.show(function (select) {
            vm.finishTime = select.value
        })
    })
    // 点击备注
    mui("body").on("tap", ".remark", function(){
        lf.window.openWindow('daily-remark', "daily-remark.html",{},{})
    })
});