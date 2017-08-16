lf.ready(function () {
    var pageParams = {
        orderId: '',
        userId:'',
        photographerId: ''
    }
    function setPageParams(params) {
        mui.each(pageParams,function (key) {
            if(key in params){
                pageParams[key] = params[key]||''
            }
        })
        vm.init()
    }
    mui.plusReady(function(){
        var currentWebview = lf.window.currentWebview();
        setPageParams(currentWebview)
    });
    window.addEventListener('pageParams',function(event){
        setPageParams(event.detail)
    });

    var vm = new Vue({
        el: '#app',
        data: function () {
            return {
                photographer:'',
                areaName:'',
                createDate:'',
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
                    userId:pageParams.userId,
                    photographerId: pageParams.photographerId
                }, function (res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.photographer = res.data.photographer || ''
                        self.areaName = res.data.areaName || ''
                        self.createDate = res.data.createDate || ''
                        self.imgs = res.data.imgs || []
                        self.summary = res.data.summary || ''
                    } else {
                        mui.toast(res.msg)
                    }
                }, function () {
                    lf.nativeUI.closeWaiting()
                    mui.toast(res.msg || '服务器异常')
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