var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		showAnswer:false,//是否显示搜索结果
		seachTest :'',//搜索关键字
		orderList: [],
	}
})
lf.ready(function() {
	initPull();
	//点击搜索按钮
	document.getElementById('searchBtn').addEventListener('tap',function(){
		console.log('search:'+ vm.searchText)
		vm.showAnswer = true;
		var params = {
			searchText:vm.searchTest,
			status:'',
			currPage :1,
			pageSize : 10

		}
		lf.nativeUI.showWaiting();
		lf.net.getJSON('/order/search',params,function(data){
				lf.nativeUI.closeWaiting();
				if(data.code == "200"){
				vm.orderList = data.data.result;
//				console.log("orderList=="+vm.orderList.length)
			}else{
				lf.nativeUI.toast(data.msg);
			}
		},function(error){
			lf.nativeUI.closeWaiting();
			lf.nativeUI.toast(error.msg);
		})
	})
})

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
						setTimeout(function() {
							vm.orderList = [
								{
									orderNo: 'dd1',//订单编号
									status: '3',//订单状态
									tourGuide: '导游1号',//导游姓名
									tourNo: '1',//团号
									productName产品: '桂林山水文化',
									purchaser: '采购方1',//采购方
									totalPrice: 1000 //订单金额
								},
								{
									orderNo: 'dd1',//订单编号
									status: '1',//订单状态
									tourGuide: '导游1号',//导游姓名
									tourNo: '1',//团号
									productName产品: '桂林山水文化',
									purchaser: '采购方1',//采购方
									totalPrice: 1000 //订单金额
								}
							]
							self.endPullDownToRefresh();
						}, 1000);
					}
				},
				up: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							vm.orderList.push(
								{
									orderNo: 'dd1',//订单编号
									status: '5',//订单状态
									tourGuide: '导游1号',//导游姓名
									tourNo: '1',//团号
									productName产品: '桂林山水文化',
									purchaser: '采购方1',//采购方
									totalPrice: 1000 //订单金额
								}
							)
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
	});
}

