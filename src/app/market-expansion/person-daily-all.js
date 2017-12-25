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
const NO_SURE = '77'; //已确认
var vm = new Vue({
    el: '#app',
    data: function() {
        return {
            date: '',
            purchaserOrderList: [
                
            ],
            userId:'',
            userName: '',
            isOpen:false,
            updateData:null,
            serverPerNum:'',//服务人数（服务前）
            amendPerNum:'',//服务人数（服务后）
            amendReasons:'', //修改原因
            isSelected:-1,
            resultData:[],//发送后台确认业绩数据
            isAll:false,
            totalLength:''
        }
    },
    methods: {
        //全选
        all(){
            if (!this.isAll){
                this.resultData = [];
                this.$refs.objectDiv.forEach(e=>{
                    e.classList.add("selected");
                    this.isAll = true;
                })
                this.purchaserOrderList.forEach(e=>{
                    e.orderList.forEach(i=>{
                      console.log(i);
                      this.resultData.push(i);
                    })
                })
                console.log( this.resultData);
            }else{
                this.$refs.objectDiv.forEach(e=>{
                    e.classList.remove("selected");
                    this.isAll = false;
                }) 
                this.resultData = [];
            }
            
        },
        currentIndex(num){
            console.log('menuItem'+num);
            return 'menuItem'+num
        },
        formatDate: function(date) {
            return new Date(date).format('yyyy-MM-dd');
        },
        //修改订单状态
        save(){
            if ( !this.resultData.length) {
                lf.nativeUI.toast('请选择订单');
                return false;
            }
           let params = [];
           this.resultData.forEach(e=>{
                params.push({
                    "orderId":e.orderId,        //订单id
                    "orderNo":e.orderNo, //订单编号
                    "orderState":4    //订单状态
                })
           })
           console.log(params);
           lf.net.getJSON('order/updateOrderStateBatch', {orders:params}, function(res) {
                console.log(res)
                lf.nativeUI.closeWaiting()
                if(res.code == 200) {
                    lf.nativeUI.toast('修改成功');
                    setTimeout(()=>{
                        lf.window.openWindow('person-daily-detail','./person-daily-detail.html',{},{
                            userId: vm.userId,
                            date: vm.date,
                            userName:vm.userName
                        }) 
                    },1500)          
                } else {
                    lf.nativeUI.toast(res.msg);
                }
            }, function(res) {
                lf.nativeUI.closeWaiting()
                lf.nativeUI.toast(res.msg)
            })  
        },
        //打开修改窗口
        _open(order){
            console.log('order',order);
            this.isOpen = true;
            this.updateData = order;
          },
           //取消修改
        cancelAmend(){
            this.isOpen = false;
            this.restoreData();
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
         //数据还原
         restoreData(){
            this.amendPerNum = '';
            this.amendReasons = '';
         },
        //单选订单
        _select(event,order){
            let isClass = event.currentTarget.classList.contains("selected")
            if (!isClass) {
                event.currentTarget.classList.add('selected');
                let flag = true;
                this.resultData.forEach(e=>{
                    if (order.orderId === e.orderId) {
                        flag = false;
                        return false ;
                    }
                })
                if (flag) {
                    this.resultData.push(order);
                }
                if (this.totalLength === this.resultData.length ) {
                    this.isAll = true;
                }
            }else{
                event.currentTarget.classList.remove('selected')
                this.isAll = false;
                this.resultData.forEach((e,index)=>{
                    if (order.orderId === e.orderId) {
                        this.resultData.splice(index, 1);
                        return false ;
                    }
                })
                
            }
            console.log( this.resultData);
            
        },
        show(item,type){
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
          }
    },
    created(){
     fetchData();
    },
});
// 获取数据
function fetchData() {
    lf.ready(function() {
        mui('.mui-scroll-wrapper').scroll({
            bounce: false,
            indicators: true, //是否显示滚动条
            deceleration: mui.os.ios ? 0.003 : 0.0009
        });
        
        var date, userId, userName;
        date = lf.window.currentWebview().date;
        userId = lf.window.currentWebview().userId;
        userName = lf.window.currentWebview().userName;
        vm.userName = userName;
        vm.userId = userId;
        vm.date = date;
        lf.nativeUI.showWaiting();
        lf.net.getJSON('/plan/queryPurchaserOrderList', {
            saleDate: date,
            userId: userId,
             flag:3
        }, function(res) {
            lf.nativeUI.closeWaiting();
            if(res.code == 200) {
                if(res.data.length == 0) {
                    lf.nativeUI.toast('没有详细数据');
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
        
                    vm.purchaserOrderList = sortArr;
                    //获取总订单数
                    let middleArr = [];

                    vm.purchaserOrderList.forEach(e=>{
                        e.orderList.forEach(i=>{
                          console.log(i);
                          middleArr.push(i);
                        })
                    })
                    vm.totalLength = middleArr.length;
                    
                }
            } else {
                lf.nativeUI.toast(res.msg);
            }
        });
    
        // mui('body').on('tap', '.content-top,.content-bottom', function(){
        //     // 跳转到任务完成详情
        //     var orderId = this.getAttribute('data-orderid');
        //     lf.window.openWindow('service-detail', './service-detail.html', {}, {
        //         orderId: orderId,
        //     })
        // })
    })
}

