
lf.ready(function () {
    var pageParams = {
        //订单Id
        orderId: ''
    }
    function setPageParams(params) {
        mui.each(pageParams,function (key) {
            if(key in params){
                pageParams[key] = params[key]||''
            }
        })
        //后台接口无法初始化执行人
        //vm.init()
    }
    mui.plusReady(function(){
        var currentWebview = lf.window.currentWebview();
        setPageParams(currentWebview)
    });
    window.addEventListener('pageParams',function(event){
        setPageParams(event)
    });
    window.addEventListener('selectUser',function(event){
       if(event && event.passPack && event.userList){
           vm[event.passPack] = vm[event.passPack].concat(event.userList.map(function (item) {
               return {
                   name:item.text,
                   phone:item.phone,
                   area:item.area,
                   operator:item.operator
               }
           }))
       }
    });

   var vm = new Vue({
        el: '#app',
        data: function () {
            return {
                executorList:[
                    {
                        name:'欧阳小小',
                        phone:'13264752368',
                        area:'西北区',
                        operator:'执行人'
                    },
                    {
                        name:'欧阳小小',
                        phone:'13264752368',
                        area:'西北区',
                        operator:'执行人'
                    }
                ],
                outputList:[],
                salesList:[],
                emptyTip: '没有指派执行人，请点击“+ 指派”按钮指派'
            }
        },
        methods: {
            init:function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('/order/getAllExecutor', {}, function (res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.executorList = res.data.executorList || []
                        self.outputList = res.data.outputList || []
                        self.salesList = res.data.salesList || []
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
        }
    });
    mui('.designate-designate').on('tap','.btn-designate',function (e) {
        var type = e.target.getAttribute('data-type')
        lf.window.openWindow('designate/allocation-staff.html','allocation-staff.html',{},{
            passPack: type,
            orderId: pageParams.orderId
        })
    })
})
