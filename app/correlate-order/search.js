var vm = new Vue({
	el: '#app',
	data: {
		state:{
			value: '',
			text: '请选择'
		},
		stateAction:{
			value: '',
			text: '请选择'
		},
		startTime:'',
		endTime:'',
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
		value: '',
		text: '请选择'
	},{
		value: '1',
		text: '处理中'
	}, {
		value: '7',
		text: '已完成'
	}, {
		value: '3',
		text: '已取消'
	}]);

	actionPicker = new mui.PopPicker();
	actionPicker.setData([{
		value: '',
		text: '请选择'
	},{
		value: '0',
		text: '待计调'
	}, {
		value: '11',
		text: '待分配'
	}, {
		value: '22',
		text: '待输出'
	},{
		value: '33',
		text: '待销售'
	},{
		value: '44',
		text: '待完成'
	},{
		value: '55',
		text: '已完成'
	}]);
})


mui('.mui-content').on('tap', '.order-state', function() {
	userPicker.show(function(items) {
	vm.state.value = items[0].value
	vm.state.text = items[0].text
	})
})
mui('.mui-content').on('tap', '.order-action-state', function() {
	actionPicker.show(function(items) {
		vm.stateAction.value = items[0].value
		vm.stateAction.text = items[0].text
	})
})


mui('.mui-content').on('tap', '.order-date-begin', function(){
	picker.show(function(items) {
		vm.startTime  = items.value
	});
	
})
mui('.mui-content').on('tap', '.order-date-end', function(){
	picker.show(function(items) {
		vm.endTime = items.value
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
		startTime : vm.startTime,
		endTime: vm.endTime,
		startBeginTime: vm.startBeginTime,
		startEndTime: vm.startEndTime,
		currPage: vm.currPage,
		pageSize: vm.pageSize,
		actionStatus: vm.stateAction.value
	})
})