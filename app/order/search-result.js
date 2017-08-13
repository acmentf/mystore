var vm = new Vue({
	el: '#app',
	data: {
	    totalCount: 1,
	    totalPages: 1,
	    result: [
	        {
            id: 123,
            orderNo: '12312321',
            status: 1,
            tourGuide: "张三",
            tourNo: "UA32123",
            productName: "测试产品名称测试产品名称测试产品名称测试产品名称测试产品名称测试产品名称测试产品名称测试产品名称测试产品名称",
            purchaser: "金豆云旅游",
            totalPrice: 200,
            tourId: 123,
			actionStatus:0
	        }
	    ]
	}
})
lf.ready(function(){
	findData()
})
var wv = lf.window.currentWebview()
	console.log(wv)
	function findData(){
	//处理搜索
	var params = {
		searchText: vm.searchText,
		status: vm.state.value,
		currPage: vm.currPage,
		pageSize : vm.pageSize,
		orderDate: vm.orderDate,
		teamOutDate: vm.teamOutDate
	}
	console.log(JSON.stringify(params))
	lf.nativeUI.showWaiting();
	lf.net.getJSON('/order/search',params,function(data){
		lf.nativeUI.closeWaiting();
		if(data.code == "200"){
			console.log(data.data)
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