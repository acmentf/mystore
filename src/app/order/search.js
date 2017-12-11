var vm = new Vue({
	el: '#app',
	data: {
		state:{
			value: '',
			text: ''
		},
		stateAction:{
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
var picker,userPicker,actionPicker;
lf.ready(function(){
	var opts = {"type": "date"};
	picker = new mui.DtPicker(opts);

	userPicker = new mui.PopPicker();
	userPicker.setData([{
		value: '',
		text: vm.$t('please_select')
	},{
		value: '1',
		text: vm.$t('processing')
	}, {
		value: '7',
		text: vm.$t('completed')
	}, {
		value: '3',
		text: vm.$t('cancelled')
	}]);

	actionPicker = new mui.PopPicker();
	actionPicker.setData([{
		value: '',
		text: vm.$t('please_select')
	},{
		value: '0',
		text: vm.$t('active_status.operating')
	}, {
		value: '11',
		text: vm.$t('active_status.assigning')
	}, {
		value: '22',
		text: vm.$t('active_status.outputting')
	},{
		value: '33',
		text: vm.$t('active_status.selling')
	},{
		value: '44',
		text: vm.$t('active_status.completing')
	},{
		value: '55',
		text: vm.$t('active_status.service_complete')
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

// 点击重置
mui('.mui-content').on('tap', '#reset-btn', function() {
	vm.searchText = ''
	vm.state.value = ''
	vm.state.text = vm.$t('please_select')
	vm.orderTimeBegin = ''
	vm.orderTimeEnd = ''
	vm.startBeginTime = ''
	vm.startEndTime = ''
	vm.stateAction.value = ''
	vm.stateAction.text = vm.$t('please_select')
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
		pageSize: vm.pageSize,
		actionStatus: vm.stateAction.value
	})
})