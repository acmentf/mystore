var vm = new Vue({
	el: '#app',
	data: {
		state:{
			value: '',
			text: ''
		},
		orderDate:'',
		teamOutDate: '',
		searchText: '',
		currPage: 1,
		pageSize: 10
	}
})
lf.ready(function(){
	var opts = {"type": "date"};
	picker = new mui.DtPicker(opts);
	userPicker = new mui.PopPicker();
	userPicker.setData([{
		value: '1',
		text: '处理中'
	}, {
		value: '2',
		text: '已完成'
	}, {
		value: '3',
		text: '已取消'
	}]);
	})
mui('.mui-content').on('tap', '.order-state', function() {
	userPicker.show(function(items) {
	vm.state.value = items[0].value
	vm.state.text = items[0].text
	})
})
mui('.mui-content').on('tap', '.order-date', function(){
	picker.show(function(items) {
		vm.orderDate = items.value
		console.log(vm.orderDate )
	});
	
})
mui('.mui-content').on('tap', '.team-out-date', function(){
	picker.show(function(items) {
		vm.teamOutDate = items.value
		console.log(vm.teamOutDate)
	});
	
})

//点击搜索
mui('.mui-content').on('tap','#search-btn', function(){
	lf.window.openWindow('order/search-result.html','../order/search-result.html',{},{
		searchText: vm.searchText,
		stateValue: vm.state.value,
		orderDate: vm.orderDate,
		teamOutDate: vm.teamOutDate,
		currPage: vm.currPage,
		pageSize: vm.pageSize
	})
})
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