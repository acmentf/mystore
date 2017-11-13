lf.ready(function () {
    var pageParams = {
        orderId: '',
        photographerId: ''
    }

    var query = Utils.getPageParams('summaryDetails');
    pageParams.orderId = query.orderId;
    pageParams.photographerId = query.photographerId;

    var vm = new Vue({
        el: '#app',
        data: function () {
            return {
                // 代表作品 图片数组
                imgs: [],
                // 拍摄总结  string
                summary: ''
            }
        },
        methods:{
            init:function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('/order/getOrderPhotographer', {
                    orderId: pageParams.orderId,
                    photographerId: pageParams.photographerId
                }, function (res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.imgs = res.data.imgs || []
                        self.summary = res.data.summary || ''
                    } else {
                        mui.toast(res.msg)
                    }
                }, function () {
                    lf.nativeUI.closeWaiting()
                    mui.toast(res.msg)
                })
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                mui.previewImage()
            })
        }
    });
})
