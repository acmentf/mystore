var vm = new Vue({
	el: '#app',
	data: {
		cause:''
	},
	methods: {
		
	}
})
lf.ready(function(){
	var opts = {"type": "date"};
	picker = new mui.DtPicker(opts);
	userPicker = new mui.PopPicker();
	userPicker.setData(['景点禁售','其他']);
})
mui('.group-info').on('tap', '.select-cause', function() {
	userPicker.show(function(items) {
		vm.cause = items
	});
})