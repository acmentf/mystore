Vue.filter('dateFormatter', function(date){
    var reg = /^NaN/;
    var result = new Date(date).format('yyyy-MM-dd');
    if(!reg.test(result)) {
        return result;
    } else {
        return '';
    }
});
Vue.filter('actionStatusFormat', function(val){
    var emum = {
        0: "待计调", 11: "待分配", 22: "待输出", 33: "待销售", 44: "已确认销售", 55: "已完成"
    }
    return emum[val];
});

Vue.filter('lengthTo8', function(value, length){
    if(value) {
        if(value.length > length) {
            return value.substr(0, length) +'...'
        } else {
            return value
        }
    }
});
// actionStatus状态
const NO_SURE = 77; //已确认
const IS_COMPLAtE = 55; //服务完成
var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            date: '',
            changeTagNum:0,
            purchaserOrderList1: [], //未确认
            purchaserOrderList2: [], //未确认
            userName: '',
            isComplate:false,
            isOpen:false,
            updateData:null,
            serverPerNum:'',//服务人数（服务前）
            amendPerNum:'',//服务人数（服务后）
            amendReasons:'' //修改原因
        }
    },
    watch:{
        
    },
    methods: {
        //判断是否有服务完成的订单
        _isComplate(sortArr){
            var isClick = false;
            sortArr.forEach(e=>{
                e.orderList.forEach(i=>{
                    if (i.actionStatus === IS_COMPLAtE ){
                        isClick = true;
                        this.isComplate = true;
                        return false;
                    }
                })
            })
        },
        //打开修改窗口
        _open(order){
          console.log('order',order);
          this.isOpen = true;
          this.updateData = order;
        },
        //数据还原
        restoreData(){
            this.amendPerNum = '';
            this.amendReasons = '';
         },
        //取消修改
        cancelAmend(){
            this.isOpen = false; 
        },
       //确认修改
       confirmAmend:function(){
            if(!this.amendPerNum){
                mui.toast('请填写实际服务人数');
                return
            }else if(!this.amendReasons) {
                mui.toast('请填写修改原因');
                return
            }else if(this.amendPerNum){
                var importNum = this.amendPerNum;
                var judgeNum = isNaN(importNum);
                if(judgeNum){
                    mui.toast('实际服务人数请填写数字');
                    return
                }else if (importNum < 0){
                    mui.toast('实际服务人数不能为负数');
                    return
                }else if (importNum > this.updateData.personCount && importNum > this.updateData.serverPerNum ){
                    mui.toast('实际服务人数超出范围');
                    return
                }
            }
            var params = {
                    serverPerNum: this.amendPerNum ,
                    serverPerNumBefore: this.updateData.serverPerNum,
                    remark: this.amendReasons,
                    orderId: this.updateData.orderId,
                    userId: this.userId
            }
            //  var isAmend = this.isAmend
            //  var isDisabled = this.isDisabled
            lf.nativeUI.showWaiting()
            lf.net.getJSON('order/timeoutSave', params, function(res) {
                    lf.nativeUI.closeWaiting()
                    if(res.code == 200) {
                        lf.nativeUI.toast('修改成功');
                        vm.isOpen = false; 
                        vm.restoreData();
                        fetchData();
                    } else {
                        lf.nativeUI.toast(res.msg);
                    }
            }, function(res) {
                    lf.nativeUI.closeWaiting()
                    lf.nativeUI.toast(res.msg)
            })           		
        },
        formatDate: function(date) {
            return new Date(date).format('yyyy-MM-dd');
        },
        _show(item,type){
          var isShow = false;
          item.orderList.forEach(e=>{
            if (!type) {
                if (e.actionStatus !== NO_SURE) {
                    isShow = true;
                    return false;
                }
            }else{
                if (e.actionStatus === NO_SURE) {
                    isShow = true;
                    return false;
                }
            }
          }) 
          return isShow;
        },
        a:function(){
            console.log(1111);
        }
    },
    mounted() {
        fetchData(1); //获取未确认订单
        fetchData(2); //获取已确认订单
    }
});
function fetchData(type) {
    lf.ready(function() {
        mui('.mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: false, //是否显示滚动条
            deceleration: mui.os.ios ? 0.003 : 0.0009
        });
        var date, userId, userName;
        date = lf.window.currentWebview().date;
        userId = lf.window.currentWebview().userId;
        userName = lf.window.currentWebview().userName;
        vm.userName = userName;
        vm.date = date;
        lf.nativeUI.showWaiting();
        // 接口调用
        lf.net.getJSON('/plan/queryPurchaserOrderList', {
            saleDate: date,
            userId: userId,
            flag:type
        }, function(res) {
            lf.nativeUI.closeWaiting();
            if(res.code == 200) {
                if(res.data.length == 0) {
                    if (type === 1) {
                        lf.nativeUI.toast('没有详细数据');
                        vm.isComplate = false
                    };
                } else {
                    var sortArr = [];
                    for(var i = 0; i < res.data.length; i++) {
                        var item = res.data[i];
                        item.createTime = lf.util.timeStampToDate2(item.createTime);
                        item.orderShow = (function(item){
                            if(!item.saleDate) {
                                return true;
                            } else {
                                return item.saleDate == date;
                            }
                        }(item));
    
                        if (!item.orderShow) {
                            // 如果当前订单 orderShow 为 false，直接进入下一次循环；
                            // 保证了 sortArr 下，所有的 旅行社组别 里，都是可显示的订单。
                            continue;
                        }
    
                        var index = undefined;
                        for(var j = 0; j < sortArr.length; j++) {
                            if(sortArr[j].purchaser == item.purchaser) {
                                index = j;
                                break;
                            }
                        }
                        if(index === undefined) {
                            sortArr.push({
                                purchaser: item.purchaser,
                                orderList: [].concat(item)
                            });
                        } else {
                            sortArr[index].orderList.push(item);
                        }
                    }
                    console.log('sortArr',sortArr);
                    if (type ===1) {
                        vm.purchaserOrderList1 = sortArr;
                        vm._isComplate(sortArr);
                    }else{
                        vm.purchaserOrderList2 = sortArr;
                    }
                    
                }
            } else {
                lf.nativeUI.toast(res.msg);
            }
        });
        mui('body').on('tap', '.content-top,.content-bottom', function(e){
            // 跳转到任务完成详情
            var orderId = this.getAttribute('data-orderid');
            lf.window.openWindow('service-detail', './service-detail.html', {}, {
                orderId: orderId,
            })
        });
        console.log('vm.isComplate',vm.isComplate);
        
        mui('body').on('tap', '.filterAll', function(){
            // 跳转到任务完成详情
            if (!vm.isComplate) return false;
            lf.window.openWindow('person-daily-all', './person-daily-all.html',{},{
                userId: userId,
                date: date,
                userName: userName
            })
        })
    })
}

