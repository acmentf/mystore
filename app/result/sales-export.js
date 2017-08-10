var vm = new Vue({
	el: '#app',
	data: {
		giveOrderXms: [{
			fType: '',
			id: '',
			orderId: '',
			picNum: '',
			picSize: '',
			picSizeName: '',
			price: ''
		}],
		saleOrderXms: [{
			fType: '',
			id: '',
			orderId: '',
			picNum: '',
			picSize: '',
			picSizeName: '',
			price: ''
		}],
		salesAmt: '',
		buyers: '',
		saleRemark: '',
		saleDate: '',
		reason:''
	}
})
lf.ready(function(){
	userPicker = new mui.PopPicker();
	userPicker.setData([{
		value: '1',
		text: '16寸'
	}, {
		value: '2',
		text: '12寸'
	}, {
		value: '3',
		text: '10寸'
	}, {
		value: '4',
		text: '8寸'
	}, {
		value: '5',
		text: '6寸'
	}]);
})
mui('.mui-content').on('tap', '.givesSize', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		Vue.set(vm.giveOrderXms,index,{
			picNum: vm.giveOrderXms[index].picNum,
			picSize: items[0].value,
			picSizeName: items[0].text
		})
	});
})
mui('.mui-content').on('tap', '.salesSize', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		Vue.set(vm.saleOrderXms,index,{
			picNum: vm.saleOrderXms[index].picNum,
			picSize: items[0].value,
			picSizeName: items[0].text
		})
	});
})
mui('.mui-content').on('tap', '.add-givesNum', function() { //添加赠送张数
	vm.giveOrderXms.push({fType: '',
			id: '',
			orderId: '',
			picNum: '',
			picSize: '',
			picSizeName: '',
			price: ''})
})
mui('.mui-content').on('tap', '.add-salesNum', function() { //添加销售张数
	vm.saleOrderXms.push({fType: '',
			id: '',
			orderId: '',
			picNum: '',
			picSize: '',
			picSizeName: '',
			price: ''})
})
mui('.mui-content').on('tap', '.remove-salesNum', function(){
	var index = this.getAttribute('data-index');
	vm.saleOrderXms.splice(index,1)
})
mui('.mui-content').on('tap', '.remove-givesNum', function(){
	var index = this.getAttribute('data-index');
	vm.giveOrderXms.splice(index,1)

})