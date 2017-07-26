var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		msgList:  [{"clientId":null,"createdTime":1501036558000,"data":{"orderNo":"10100000001757","orderId":300,"type":1},"descption":"订单编号10100000001757已被熊威-桂林执行主管确认","id":594,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null},{"clientId":null,"createdTime":1501033806000,"data":{"orderNo":"10100000001751","type":1,"orderId":287},"descption":"订单编号10100000001751已被张波确认","id":555,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null},{"clientId":null,"createdTime":1501033787000,"data":{"orderNo":"10100000001755","orderId":298,"type":1},"descption":"熊威-桂林执行主管已将订单编号10100000001755取消","id":548,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null},{"clientId":null,"createdTime":1501033780000,"data":{"orderNo":"10100000001756","orderId":299,"type":1},"descption":"订单编号10100000001756已被熊威-桂林执行主管确认","id":541,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null},{"clientId":null,"createdTime":1501033748000,"data":{"orderNo":"10100000001751","orderId":287,"type":1},"descption":"熊威-桂林执行主管已将订单编号10100000001751取消","id":526,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null},{"clientId":null,"createdTime":1501033748000,"data":{"orderNo":"10100000001751","orderId":287,"type":1},"descption":"熊威-桂林执行主管已将订单编号10100000001751取消","id":534,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null},{"clientId":null,"createdTime":1501033404000,"data":{"orderNo":"10100000001752","orderId":288,"type":1},"descption":"订单编号10100000001752已被熊威-桂林执行主管确认","id":517,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null},{"clientId":null,"createdTime":1501032072000,"data":{"orderNo":"10100000001753","orderId":297,"type":1},"descption":"订单编号10100000001753已录入跟踪信息","id":503,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null},{"clientId":null,"createdTime":1501032037000,"data":{"orderNo":"10100000001753","orderId":297,"type":1},"descption":"订单编号10100000001753已录入跟踪信息","id":487,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null},{"clientId":null,"createdTime":1501032014000,"data":{"orderNo":"10100000001753","orderId":297,"type":1},"descption":"订单编号10100000001753已录入跟踪信息","id":471,"pushResult":null,"pushResultStatus":null,"status":0,"title":"订单消息","type":1,"updatedTime":null,"userId":165,"yn":null}],
		pageNo: 0,
		pageNum: 10
	},
	computed: {
	},
	methods: {
		dateChange:function(data){
			if(data){
				var date = new Date(data);
				return date.format('yyyy-MM-dd')
			}else{
				return '';
			}
		}
	}
})
lf.ready(function() {
	initPull();
})

document.getElementById('searchBtn').addEventListener('tap',function(){
	console.log('search')
	findData();
})

mui('.mui-content').on('tap','.message-li',function(){
	var id = this.getAttribute('data-id');
	lf.window.openWindow('orderdetails.html', '../order/orderdetails.html', {}, {
		orderNo: id
	})
})

function findData(){
	vm.pageNo = 1;
	var params = {
		searchText: vm.searchText,
		currPage:vm.pageNo,
		pageSize:vm.pageNum
	};
	lf.net.getJSON('/information/queryPage',params,function (res) {
		if(res.code == 200) {
			vm.msgList = doData(res.data.result)
		}else{
			lf.nativeUI.toast(res.msg)
		}
    },function(res){
    	lf.nativeUI.toast(res.msg)
    })
}

function doData(data){
	data.forEach(function(v){
		v.data = JSON.parse(v.data);
	})
	console.log(JSON.stringify(data))
	return data;
}

//			mui.init();
//阻尼系数
function initPull() {
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	mui.ready(function() {
		//循环初始化所有下拉刷新，上拉加载。
		mui.each(document.querySelectorAll('.mui-slider .mui-scroll'), function(index, pullRefreshEl) {
			mui(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						vm.pageNo = 1;
						var params = {
							searchText: vm.searchText,
							currPage:vm.pageNo,
							pageSize:vm.pageNum
						};
						lf.net.getJSON('/information/queryPage',params,function (res) {
							self.endPullDownToRefresh();
							if(res.code == 200) {
								self.refresh(true);
								vm.msgList = res.data.result
							}else{
								lf.nativeUI.toast(res.msg)
							}
		                },function(res){
		                	self.endPullDownToRefresh();
		                	lf.nativeUI.toast(res.msg)
		                })
					}
				},
				up: {
					auto: true,
					callback: function() {
						var self = this;
						vm.pageNo++;
						var params = {
							searchText: vm.searchText,
							currPage:vm.pageNo,
							pageSize:vm.pageNum
						};
						lf.net.getJSON('/information/queryPage',params,function (res) {
							if(res.code == 200) {
								self.endPullUpToRefresh(vm.pageNo >= res.data.totalPages);
								vm.msgList = vm.msgList.concat(doData(res.data.result))
							}else{
								self.endPullUpToRefresh();
								vm.pageNo--;
								lf.nativeUI.toast(res.msg)
							}
		                },function(res){
		                	vm.pageNos[index]--;
		                	self.endPullUpToRefresh();
		                	lf.nativeUI.toast(res.msg)
		                })
					}
				}
			});
		});
	});
}