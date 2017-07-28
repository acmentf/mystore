var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		msgList:  [],
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