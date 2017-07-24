var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		showAnswer:false,//是否显示搜索结果
		seachTest :'',//搜索关键字
		orderList: [],
		pageNos:[

		],
		pageNum: 10
	}
})
lf.ready(function() {
	initPull();
	//点击搜索按钮
	document.getElementById('searchBtn').addEventListener('tap',function(){
		vm.showAnswer = true;
		vm.pageNos[0]=1;
		var params = {
			searchText:vm.searchTest,
			status:'',
			currPage :vm.pageNos[0],
			pageSize : vm.pageNum

		}
		lf.nativeUI.showWaiting();
		lf.net.getJSON('/order/search',params,function(data){
				lf.nativeUI.closeWaiting();
				if(data.code == "200"){
				vm.orderList = data.data.result;
				console.log("orderList=="+JSON.stringify(data))
			}else{
				lf.nativeUI.toast(data.msg);
			}
		},function(error){
			lf.nativeUI.closeWaiting();
			lf.nativeUI.toast(error.msg);
		})
	})
})

function dodata(type, index, data) {
	if(type == 'up') {
		vm.orderList = vm.orderList.concat(data)
	} else {
		vm.orderList = data
	}
}
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
			vm.pageNos[index] = 0;
			mui(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						vm.pageNos[index] = 1;
						var params = {
							searchText:vm.searchTest,
							status:'',
							currPage:vm.pageNos[index],
							pageSize:vm.pageNum
						};
						lf.net.getJSON('/order/search',params,function (res) {
							self.endPullDownToRefresh();
							if(res.code == 200) {
								self.refresh(true);
								dodata('down', index, res.data.result)
							}else{
								vm.pageNos[index]--;
								lf.nativeUI.toast(res.msg)
							}
		                },function(res){
		                	vm.pageNos[index]--;
		                	self.endPullDownToRefresh();
		                	lf.nativeUI.toast(res.msg)
		                })
					}
				},
				up: {
					auto: true,
					callback: function() {
						var self = this;
						vm.pageNos[index]++;
						var params = {
							searchText:vm.searchTest,
							status:'',
							currPage:vm.pageNos[index],
							pageSize:vm.pageNum
						};
						lf.net.getJSON('/order/search',params,function (res) {
							self.endPullUpToRefresh(vm.pageNos[index] >= res.data.totalPages);
							if(res.code == 200) {
								dodata('up', index, res.data.result)
							}else{
								vm.pageNos[index]--;
								lf.nativeUI.toast(res.msg)
							}
		                },function(res){
		                	vm.pageNos[index]--;
		                	self.endPullUpToRefresh(vm.pageNos[index] >= res.data.totalPages);
		                	lf.nativeUI.toast(res.msg)
		                })
					}
				}
			});
		});
	});
}

