var vm = null

lf.ready(function () {
    var mask = mui.createMask();
    vm = new Vue({
        el: '#app',
        data: function () {
            return {
                // 代表作品 图片数组
                imgs: [],
                // 拍摄总结  string
                summary: ''
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                mui.previewImage()
            })
        }
    });
})
