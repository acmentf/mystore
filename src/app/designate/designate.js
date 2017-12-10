lf.ready(function () {
    var pageParams = {
        //订单Id
        orderId: ''
    }

    function setPageParams(params) {
        mui.each(pageParams, function (key) {
            if (key in params) {
                pageParams[key] = params[key] || ''
            }
        })
    }
    var currentWebview = lf.window.currentWebview();
    setPageParams(currentWebview)

    // mui.plusReady(function () {
    //     var currentWebview = lf.window.currentWebview();
    //     setPageParams(currentWebview)
    // });
    window.addEventListener('pageParams', function (event) {
        setPageParams(event.detail)
    });
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
                emptyTip: ""
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
                    mui.toast(res.msg || self.$t('toast_server_exception'))
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
        mounted: function () {
            this.emptyTip = this.$t('no_list_assigner')
        }
    });

    vm.init()

    mui('.designate-designate').on('tap', '.btn-designate', function (e) {
        var type = e.target.getAttribute('data-type')
        lf.window.openWindow('designate/allocation-staff.html', 'allocation-staff.html', {}, {
            passBack: type,
            orderId: pageParams.orderId,
            quikOrderTag: lf.window.currentWebview().quikOrderTag
        })
    })
})