if (mui.os.plus) {
    lf.ready(function () {
        var pageParams = {
            passBack:null,
            //订单Id
            orderId:'',
            //拍摄明细ID
            photoId:[]
        }
        function setPageParams(params) {
            mui.each(pageParams,function (key) {
                if(key in params){
                    pageParams[key] = params[key]||''
                }
            })
            init()
        }
        var currentWebview = lf.window.currentWebview();
        setPageParams(currentWebview)
        // mui.plusReady(function(){
        //     var currentWebview = lf.window.currentWebview();
        //     setPageParams(currentWebview)
        // });
        window.addEventListener('pageParams',function(event){
            setPageParams(event.detail)
        });
    
        var vmTableView = new Vue({
            el: '#app-table-view',
            data: function () {
                return {
                    indexedList:[]
                }
            },
            methods: {
                init:function (indexedList) {
                    var c = ''
                    var list = [];
                    (indexedList || []).map(function (item) {
                        return {
                            value:item.id+'',
                            tags:(item.pyname || '').toUpperCase(),
                            text:item.name || '',
                            phone:item.phone || '',
                            roleName:item.roleName || '',
                            state:false,
                            selected:!!item.assignState
                        }
                    }).sort(function (a, b) {
                        return a.tags.localeCompare(b.tags)
                    }).forEach(function (item) {
                        if(item.tags[0] !== c){
                            c = item.tags[0]
                            list.push({
                                group:c,
                                text:c
                            })
                        }
                        list.push(item)
                    })
                    this.indexedList = list
                    this.$nextTick(function () {
                        initSelectIndexEvent()
                    })
                },
                select:function (index) {
                    this.indexedList[index].selected = true
                },
                cancel:function (index) {
                    this.indexedList[index].selected = false
                }
            },
            mounted: function () {
                initTableViewEvent(this)
            }
        });
        function init() {
            lf.nativeUI.showWaiting()
            lf.net.getJSON('/order/getAllPhotographer', {
                orderId:pageParams.orderId
            }, function (res) {
                lf.nativeUI.closeWaiting()
                if (res.code === '200') {
                    console.log(JSON.stringify(res,null,2))
                    vmTableView.init(res.data)
                } else {
                    mui.toast(res.msg)
                }
            }, function () {
                lf.nativeUI.closeWaiting()
                mui.toast(res.msg || '服务器异常')
            })
        }
        function save() {
            var photographerIdStr = []
            var photographer = []
            var photoIds = Array.isArray(pageParams.photoId) ? pageParams.photoId : pageParams.photoId ? [pageParams.photoId]:[]
    
            vmTableView.indexedList.filter(function(item) {
                return item.selected
            }).forEach(function (item) {
                photographerIdStr.push(item.value.split('|')[0]||'')
                photographer.push(item.text)
            })
            if(photoIds.length){
                lf.nativeUI.showWaiting()
                lf.net.getJSON('/order/assignOrderPhotographer', {
                    orderId:pageParams.orderId,
                    lineSightDTOS: photoIds.map(function (id) {
                        return {
                            id:id,
                            photographerIdStr:photographerIdStr
                        }
                    }),
                    photographer:photographer
                }, function (res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        mui.toast('分配成功')
                        sendSelectAssignUser()
                    } else {
                        mui.toast(res.msg)
                    }
                }, function () {
                    lf.nativeUI.closeWaiting()
                    mui.toast(res.msg || '服务器异常')
                })
            }else {
                sendSelectAssignUser()
            }
            function sendSelectAssignUser() {
                lf.event.fire(lf.window.currentWebview().opener(),'selectAssignUser',{
                    passBack:pageParams.passBack,
                    userList:vmTableView.indexedList.filter(function (item) {
                        return item.selected
                    }).map(function (item) {
                        return {
                            id:item.value,
                            name:item.text,
                            phone:item.phone,
                            roleName:item.roleName
                        }
                    })
                });
                lf.window.closeCurrentWebview();
            }
        }
        function initSelectIndexEvent() {
            var header = document.querySelector('header.mui-bar');
            var list = document.getElementById('list');
            //calc hieght
            list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
            //create
            window.indexedList = new mui.IndexedList(list);
        }
        function initTableViewEvent(vm){
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
            mui('.designate-select-staff').on('tap','.btn-select',function (e) {
                var index = +e.target.getAttribute('index')
                vm.select(index)
            }).on('tap','.btn-cancel',function (e) {
                var index = +e.target.getAttribute('index')
                vm.cancel(index)
            })
        }
    })
    
} else {

    var ready = function () {
        var pageParams = {
            passBack:null,
            //订单Id
            orderId:'',
            //拍摄明细ID
            photoId:[]
        }
     
        window.addEventListener('pageParams',function(event){
            setPageParams(event.detail)
        });
    
        var vmTableView = new Vue({
            el: '#app-table-view',
            data: function () {
                return {
                    indexedList:[]
                }
            },
            methods: {
                init:function (indexedList) {
                    var c = ''
                    var list = [];
                    (indexedList || []).map(function (item) {
                        return {
                            value:item.id+'',
                            tags:(item.pyname || '').toUpperCase(),
                            text:item.name || '',
                            phone:item.phone || '',
                            roleName:item.roleName || '',
                            state:false,
                            selected:!!item.assignState
                        }
                    }).sort(function (a, b) {
                        return a.tags.localeCompare(b.tags)
                    }).forEach(function (item) {
                        if(item.tags[0] !== c){
                            c = item.tags[0]
                            list.push({
                                group:c,
                                text:c
                            })
                        }
                        list.push(item)
                    })
                    this.indexedList = list
                    this.$nextTick(function () {
                        initSelectIndexEvent()
                    })
                },
                select:function (index) {
                    console.log(789);
                    this.indexedList[index].selected = true
                },
                cancel:function (index) {
                    this.indexedList[index].selected = false
                }
            },
            mounted: function () {
                initTableViewEvent(this)
            }
        });
        
        function init() {
            lf.nativeUI.showWaiting()
            lf.net.getJSON('/order/getAllPhotographer', {
                orderId:window.iframeParams.orderId
            }, function (res) {
                lf.nativeUI.closeWaiting()
                if (res.code === '200') {
                    console.log(JSON.stringify(res,null,2))
                    vmTableView.init(res.data)
                } else {
                    mui.toast(res.msg)
                }
            }, function () {
                lf.nativeUI.closeWaiting()
                mui.toast(res.msg || '服务器异常')
            })
        }
        function save() {
            var photographerIdStr = []
            var photographer = []
            var photoIds = Array.isArray(pageParams.photoId) ? pageParams.photoId : pageParams.photoId ? [pageParams.photoId]:[]
    
            vmTableView.indexedList.filter(function(item) {
                return item.selected
            }).forEach(function (item) {
                photographerIdStr.push(item.value.split('|')[0]||'')
                photographer.push(item.text)
            })
            if(photoIds.length){
                lf.nativeUI.showWaiting()
                lf.net.getJSON('/order/assignOrderPhotographer', {
                    orderId:window.iframeParams.orderId,
                    lineSightDTOS: photoIds.map(function (id) {
                        return {
                            id:id,
                            photographerIdStr:photographerIdStr
                        }
                    }),
                    photographer:photographer
                }, function (res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        mui.toast('分配成功')
                        sendSelectAssignUser()
                    } else {
                        mui.toast(res.msg)
                    }
                }, function () {
                    lf.nativeUI.closeWaiting()
                    mui.toast(res.msg || '服务器异常')
                })
            }else {
                sendSelectAssignUser()
            }
            function sendSelectAssignUser() {
                window.parent.document.querySelector('.assign-staff-wrapper').style.display = 'none'
                window.parent.getAssignStaff({
                    passBack:window.iframeParams.passBack,
                    pIndex:window.iframeParams.pIndex,
                    userList:vmTableView.indexedList.filter(function (item) {
                        return item.selected
                    }).map(function (item) {
                        return {
                            id:item.value,
                            name:item.text,
                            phone:item.phone,
                            roleName:item.roleName
                        }
                    })
                })
            }
        }
        function initSelectIndexEvent() {
            var header = document.querySelector('header.mui-bar');
            var list = document.getElementById('list');
            //calc hieght
            list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
            //create
            window.indexedList = new mui.IndexedList(list);
        }
        function initTableViewEvent(vm){
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
            mui('.designate-select-staff').on('tap','.btn-select',function (e) {
                console.log(123);
                var index = +e.target.getAttribute('index')
                vm.select(index)
            }).on('tap','.btn-cancel',function (e) {
                console.log(456);
                var index = +e.target.getAttribute('index')
                vm.cancel(index)
            })
        }
        init()
    }
    
    window.init = function(pageParams) {
        window.iframeParams = pageParams
        lf.ready(ready)
    }
}

