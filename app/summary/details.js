lf.ready(function () {
    var pageParams = {
        orderId: '',
        photographerId: ''
    }
    function setPageParams(params) {
        mui.each(pageParams,function (key) {
            if(key in params){
                pageParams[key] = params[key]||''
                console.log('pageParams '+key+':'+params[key])
            }
        })
    }
    mui.plusReady(function(){
        var currentWebview = lf.window.currentWebview();
        setPageParams(currentWebview)
    });
    window.addEventListener('pageParams',function(event){
        setPageParams(event)
    });

    var vm = new Vue({
        el: '#app',
        data: function () {
            return {
                // 代表作品 图片数组
                imgs: ['http://img.fingercrm.cn/9fc9255b0875470cb6854aee0a4dcc14.jpg','http://img.fingercrm.cn/9fc9255b0875470cb6854aee0a4dcc14.jpg'],
                // 拍摄总结  string
                summary: '非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好非常好'
            }
        },
        created: function () {
            var self = this
            lf.nativeUI.showWaiting()
            lf.net.getJSON('/order/getOrderPhotographer', {
                orderId: pageParams.orderId,
                photographerId: pageParams.photographerId
            }, function (res) {
                lf.nativeUI.closeWaiting()
                if (res.code === '200') {
                    console.log(JSON.stringify(res))
                    self.imgs = res.data.imgs || []
                    self.summary = res.data.summary || ''
                } else {
                    mui.toast(res.msg)
                }
            }, function () {
                lf.nativeUI.closeWaiting()
                mui.toast(res.msg)
            })
        },
        mounted: function () {
            this.$nextTick(function () {
                mui.previewImage()
            })
        }
    });
})
