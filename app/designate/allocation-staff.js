lf.ready(function () {
    var pageParams = {
        passPack:''
    }
    function setPageParams(params) {
        mui.each(pageParams,function (key) {
            if(key in params){
                pageParams[key] = params[key]||''
            }
        })
        //init()
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
                    {
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
                    },
                    {
                        value:'AAT',
                        tags:'ALeTai',
                        text:'阿勒泰机场',
                        phone:'13264752368',
                        area:'西北区',
                        operator:'执行人',
                        state:true,
                        selected:false
                    }
                ]
            }
        },
        methods: {
            init:function (indexedList) {
                this.indexedList = indexedList || []
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
        lf.net.getJSON('', {}, function (res) {
            lf.nativeUI.closeWaiting()
            if (res.code === '200') {
                vmTableView.init(res.data.indexedList)
            } else {
                mui.toast(res.msg)
            }
        }, function () {
            lf.nativeUI.closeWaiting()
            mui.toast(res.msg)
        })
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
            var checkedValues = [];

            vm.indexedList.forEach(function(item) {
                if (item.selected) {
                    checkedValues.push(item.text);
                }
            });
            if (checkedValues.length > 0) {
                mui.alert('你选择了: ' + checkedValues);
                lf.event.fire(lf.window.currentWebview().opener(),'selectUser',{
                    passPack:pageParams.passPack,
                    userList:vm.indexedList.filter(function (item) {
                        return item.selected
                    })
                });
                lf.window.closeCurrentWebview();
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
