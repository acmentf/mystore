lf.ready(function () {
    var pageParams = {
        passPack:'',
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
    mui.plusReady(function(){
        var currentWebview = lf.window.currentWebview();
        setPageParams(currentWebview)
    });
    window.addEventListener('pageParams',function(event){
        setPageParams(event)
    });

    var vmTableView = new Vue({
        el: '#app-table-view',
        data: function () {
            return {
                indexedList:[
                    /*{
                        group:'A',
                        text:'A'
                    },
                    {
                        value:'AKU',
                        tags:'AKeSu',
                        text:'阿克苏机场',
                        phone:'13264752368',
                        area:'西北区',
                        operator:'执行人',
                        state:true,
                        selected:false
                    },
                    {
                        value:'BPL',
                        tags:'ALaShanKou',
                        text:'阿拉山口机场',
                        phone:'13264752368',
                        area:'西北区',
                        operator:'执行人',
                        state:false,
                        selected:true
                    }*/
                ]
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
                        state:false,
                        selected:false
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
        lf.net.getJSON('/order/getAllPhotographer', {}, function (res) {
            lf.nativeUI.closeWaiting()
            if (res.code === '200') {
                // console.log(JSON.stringify(res,null,2))
                vmTableView.init(res.data)
            } else {
                mui.toast(res.msg)
            }
        }, function () {
            lf.nativeUI.closeWaiting()
            mui.toast(res.msg)
        })
    }
    function save() {
        lf.nativeUI.showWaiting()
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
                mui.toast(res.msg)
            })
        }else {
            sendSelectAssignUser()
        }
        function sendSelectAssignUser() {
            lf.event.fire(lf.window.currentWebview().opener(),'selectAssignUser',{
                passPack:pageParams.passPack,
                userList:vmTableView.indexedList.filter(function (item) {
                    return item.selected
                }).map(function (item) {
                    return {
                        id:item.id,
                        name:item.name,
                        phone:item.phone
                    }
                })
            });
            lf.window.closeCurrentWebview();
        }
    }
    function initTableViewEvent(vm){
        var header = document.querySelector('header.mui-bar');
        var list = document.getElementById('list');
        var operate = document.getElementById('operate');
        //calc hieght
        list.style.height = (document.body.offsetHeight - header.offsetHeight) + 'px';
        //create
        window.indexedList = new mui.IndexedList(list);

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
