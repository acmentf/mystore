
lf.ready(function () {
    var pageParams = {
    }
    function setPageParams(params) {
        mui.each(pageParams,function (key) {
            if(key in params){
                pageParams[key] = params[key]||''
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
        },
        mounted: function () {

        }
    });
    mui('.designate-designate').on('tap','',function () {

    })
})
