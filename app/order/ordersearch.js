var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		showAnswer:false,//是否显示搜索结果
		seachTest :'',//搜索关键字
		orderList: [],
		pageNos:[

		],
		his:[],
		pageNum: 10
	}
})
var HOT_SEARCH = 'HOT_SEARCH'
lf.ready(function() {
	initPull();
	
	//搜索记录
	var jl = lf.storage.get(HOT_SEARCH)
	console.log(jl)
	if(typeof jl != 'undefined'&& jl != null){
		vm.his = JSON.parse(jl)
	}
	//点击搜索按钮
	document.getElementById('searchBtn').addEventListener('tap',function(){
		findData();
	})
})

document.getElementById('clearBtn').addEventListener('tap',function(){
	lf.storage.removeItem(HOT_SEARCH)
	vm.his = [];
})

mui('.mui-content').on('tap','.hisbtn',function(){
	console.log(this.innerText)
	vm.searchText = this.innerText;
	findData();
})
function findData(){
	vm.pageNos[0]=1;
	
	//处理搜索
	if(vm.searchText){
		var flag = true;
		for(var i in vm.his){
			if(vm.his[i] == vm.searchText){
				flag = false;
				break;
			}
		}
		if(flag){
			vm.his.push(vm.searchText)
			lf.storage.put(HOT_SEARCH,JSON.stringify(vm.his))
		}
	}
	var params = {
		searchText:vm.searchText,
		status:'',
		currPage :vm.pageNos[0],
		pageSize : vm.pageNum

	}
	lf.nativeUI.showWaiting();
	lf.net.getJSON('/order/search',params,function(data){
		lf.nativeUI.closeWaiting();
		if(data.code == "200"){
			if(data.data.result.length > 0){
				vm.showAnswer = true;
				vm.orderList = data.data.result;
			}else{
				vm.orderList = [];
				vm.showAnswer = false;
				lf.nativeUI.toast('查询不到数据');
			}
		}else{
			lf.nativeUI.toast(data.msg);
		}
	},function(error){
		lf.nativeUI.closeWaiting();
		lf.nativeUI.toast(error.msg);
	})
}
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
							searchText:vm.searchText,
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
					callback: function() {
						var self = this;
						vm.pageNos[index]++;
						var params = {
							searchText:vm.searchText,
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

