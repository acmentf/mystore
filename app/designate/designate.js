lf.ready(function () {
    var pageParams = {
        //订单Id
        orderId: ''
    }

    var query = Utils.getPageParams('designate');
    pageParams.orderId = query.orderId;

    window.addEventListener('selectAllocationUser', function (event) {
        var detail = event.detail
        if (detail && detail.passBack && detail.userList) {
            lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails');
            vm.init()
            /* vm[detail.passBack] = vm[detail.passBack].concat(detail.userList.map(function (item) {
                 return {
                     id:item.id,
                     name:item.name,
                     phone:item.phone,
                     roleName:item.roleName
                 }
             }))*/
        }
    });
    var vm = new Vue({
        el: '#app',
        data: function () {
            return {
                executorList: [
                    /*{
                        name:'欧阳小小',
                        phone:'13264752368'
                    },
                    {
                        name:'欧阳小小',
                        phone:'13264752368'
                    }*/
                ],
                outputList: [],
                salesList: [],
                emptyTip: '没有指派执行人，请点击“+ 指派”按钮指派'
            }
        },
        methods: {
            init: function () {
                var self = this
                lf.nativeUI.showWaiting()
                lf.net.getJSON('/order/getAllExecutor', {
                    orderId: pageParams.orderId
                }, function (res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        self.initList(res.data || [])
                    } else {
                        mui.toast(res.msg)
                    }
                }, function () {
                    lf.nativeUI.closeWaiting()
                    mui.toast(res.msg || '服务器异常')
                })
            },
            initList: function (allExecutorList) {
                var list = []
                allExecutorList.forEach(function (item) {
                    !!item.assignState && list.push({
                        id: item.id,
                        name: item.name,
                        phone: item.phone,
                        roleName: item.roleName
                    })
                })
                this.executorList = list
            }
        },
        mounted: function () { }
    });
    mui('.designate-designate').on('tap', '.btn-designate', function (e) {
        var type = e.target.getAttribute('data-type')
        lf.window.openWindow('designate/allocation-staff.html', 'allocation-staff.html', {}, {
            passBack: type,
            orderId: pageParams.orderId,
            quikOrderTag: lf.window.currentWebview().quikOrderTag
        })
    })
})