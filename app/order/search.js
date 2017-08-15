var vm = new Vue({
	el: '#app',
	data: {
		state:{
			value: '',
			text: ''
		},
		orderTimeBegin:'',
		orderTimeEnd:'',
		startBeginTime: '',
		startEndTime: '',
		searchText: '',
		currPage: 0,
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


mui('.mui-content').on('tap', '.order-date-begin', function(){
	picker.show(function(items) {
		vm.orderTimeBegin = items.value
		console.log(vm.orderTimeBegin)
	});
	
})
mui('.mui-content').on('tap', '.order-date-end', function(){
	picker.show(function(items) {
		vm.orderTimeEnd = items.value
		console.log(vm.orderTimeEnd)
	});
})

mui('.mui-content').on('tap', '.team-date-begin', function(){
	picker.show(function(items) {
		vm.startBeginTime = items.value
		console.log(vm.startBeginTime )
	});
	
})
mui('.mui-content').on('tap', '.team-date-end', function(){
	picker.show(function(items) {
		vm.startEndTime = items.value
		console.log(vm.startEndTime)
	});
})

//点击搜索
mui('.mui-content').on('tap','#search-btn', function(){
	lf.window.openWindow('search-result.html','search-result.html',{},{
		searchText: vm.searchText,
		status: vm.state.value,
		orderTimeBegin: vm.orderTimeBegin,
		orderTimeEnd: vm.orderTimeEnd,
		startBeginTime: vm.startBeginTime,
		startEndTime: vm.startEndTime,
		currPage: vm.currPage,
		pageSize: vm.pageSize
	})
})