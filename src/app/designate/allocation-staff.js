lf.ready(function() {
    var pageParams = {
        passBack: '',
        //订单Id
        orderId: ''
    }

    function setPageParams(params) {
        mui.each(pageParams, function(key) {
            if (key in params) {
                pageParams[key] = params[key] || ''
            }
        })
        init()
    }

    var currentWebview = lf.window.currentWebview();
    setPageParams(currentWebview)

    // mui.plusReady(function() {
    //     var currentWebview = lf.window.currentWebview();
    //     setPageParams(currentWebview)
    // });
    window.addEventListener('pageParams', function(event) {
        setPageParams(event.detail)
    });

    var vmTableView = new Vue({
        el: '#app-table-view',
        data: function() {
            return {
                indexedList: []
            }
        },
        methods: {
            init: function(indexedList) {
                var c = ''
                var list = [];
                (indexedList || []).map(function(item) {
                    return {
                        value: item.id + '',
                        tags: (item.pyname || '').toUpperCase(),
                        text: item.name || '',
                        phone: item.phone || '',
                        roleName: item.roleName || '',
                        state: false,
                        selected: !!item.assignState,
                        chartUrl: (function() {
                            var id = /[\|]/g.test(item.id) ? item.id.split('|')[0] : item.id
                            var name = /[\-]/g.test(item.id) ? item.name.split('-')[0] : item.name
                            // modifywebim
                            var host = "https://tuyi.uat.fingercrm.cn"
                            var query = `#/group?username=${window.Role.usercode}&ids=${id}&members=${name}`
                            var url = `${host}/html5/assets/webim/index.html${query}`

                            return url
                        })()
                    }
                }).sort(function(a, b) {
                    return a.tags.localeCompare(b.tags)
                }).forEach(function(item) {
                    if (item.tags[0] !== c) {
                        c = item.tags[0]
                        list.push({
                            group: c,
                            text: c
                        })
                    }
                    list.push(item)
                })
                this.indexedList = list
                this.$nextTick(function() {
                    initSelectIndexEvent()
                })
            },
            select: function(index) {
                this.indexedList[index].selected = true
            },
            cancel: function(index) {
                this.indexedList[index].selected = false
            }
        },
        mounted: function() {
            initTableViewEvent(this)
        }
    });

    function init() {
        if(lf.window.currentWebview().type==2){
            lf.nativeUI.showWaiting()
            lf.net.getJSON('/order/getAllPhotographer',{deptId:lf.window.currentWebview().deptId}, function(res) {
                lf.nativeUI.closeWaiting()
                if (res.code === '200') {
                    vmTableView.init(res.data)
                } else {
                    mui.toast(res.msg)
                }
            }, function() {
                lf.nativeUI.closeWaiting()
                mui.toast(res.msg || '服务器异常')
            })
            return
        }

        lf.nativeUI.showWaiting()
        lf.net.getJSON('/order/getAllExecutor', {
            orderId: pageParams.orderId
        }, function(res) {
            lf.nativeUI.closeWaiting()
            if (res.code === '200') {
                vmTableView.init(res.data)
            } else {
                mui.toast(res.msg)
            }
        }, function() {
            lf.nativeUI.closeWaiting()
            mui.toast(res.msg || '服务器异常')
        })
    }

    function save() {
        if (lf.window.currentWebview().quikOrderTag) { //如果从快速下单页面进来的
            var names = []
            var ids = []
            vmTableView.indexedList.forEach(function (item) {
                if(item.selected){
                    names.push(item.text)
                    ids.push(item.value)
                }
            })

            if (mui.os.plus) {
                lf.event.fire(lf.window.currentWebview().opener(), 'quikOrderSelectUsers', {
                    nameString: names.length>0?names.join(' '):'',
                    idString: ids.length>0?ids.join(','):'',
                    type:lf.window.currentWebview().type
                });
            } else {
                var quickOrderTempData=lf.window.currentWebview()
                if(lf.window.currentWebview().type==2){//如果是选摄影师
                    quickOrderTempData.shooter=names.length > 0 ? names.join(' ') : ''
                    quickOrderTempData.shooterId=ids.length > 0 ? ids.join(',') : ''
                    quickOrderTempData.fromAllocation=true
                }else{
                    quickOrderTempData.operator=names.length > 0 ? names.join(' ') : ''
                    quickOrderTempData.idString=ids.length > 0 ? ids.join(',') : ''
                    quickOrderTempData.fromAllocation=true
                }
                localStorage.setItem('allocation-staff.html',JSON.stringify(quickOrderTempData))
            }
            lf.window.closeCurrentWebview();
            return
        }

        lf.nativeUI.showWaiting()
        lf.net.getJSON('/order/assignOrderExecutor', {
            orderId: pageParams.orderId,
            assignId: vmTableView.indexedList.filter(function(item) {
                return item.selected
            }).map(function(item) {
                return item.value
            }).join(',')
        }, function(res) {
            lf.nativeUI.closeWaiting()
            if (res.code === '200') {
                mui.toast('指派成功')
                lf.event.fire(lf.window.currentWebview().opener(), 'selectAllocationUser', {
                    passBack: pageParams.passBack,
                    userList: vmTableView.indexedList.filter(function(item) {
                        return item.selected
                    }).map(function(item) {
                        return {
                            id: item.value,
                            name: item.text,
                            phone: item.phone,
                            roleName: item.roleName
                        }
                    })
                });
                lf.window.closeCurrentWebview();

            } else {
                mui.toast(res.msg || '服务器异常')
            }
        }, function() {
            lf.nativeUI.closeWaiting()
            mui.toast(res.msg)
        })
    }

    function initSelectIndexEvent() {
        var header = document.querySelector('header.mui-bar');
        var list = document.getElementById('list');
        //calc hieght
        list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);
    }

    function initTableViewEvent(vm) {
        var operate = document.getElementById('operate');

        operate.addEventListener('tap', function() {
            var bool = vm.indexedList.some(function(item) {
                return item.selected
            });
            if (bool) {
                save()
            } else {
                mui.alert('你没选择任何员工');
            }
        }, false);
        mui('.designate-select-staff').on('tap', '.btn-select', function(e) {
            var index = +e.target.getAttribute('index')
            vm.select(index)
        }).on('tap', '.btn-cancel', function(e) {
            var index = +e.target.getAttribute('index')
            vm.cancel(index)
        })

        mui('.designate-select-staff').on('tap','.btn-chat',function (e) {
            var href = e.target.getAttribute('href')
            lf.window._openWindow('chat', href,{},{},lf.window.currentWebview());
        })
    }
})