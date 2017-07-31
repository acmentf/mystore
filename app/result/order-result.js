var vm = new Vue({
	el: '#app',
	data: {
		orderId: '',
		id: '',
		shootPeoNum: '',
		shootNum: '',
		selectsNum: '',
		printsData: [
		{
			printsNum:'',
			printsSize:''
		}
		],
		givesData: [
		{
			givesNum:'',
			givesSize:''
		}],
		salesData: [
		{
			salesNum:'',
			salesSize:''
		}],
		salesAmt: '',
		buyers: '',
		receiveNum: '',
		saleDate: '',
	},
	methods: {
		
	}
})
lf.ready(function(){
	var opts = {"type": "date"};
	picker = new mui.DtPicker(opts);
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
mui('.group-info').on('tap', '.printsSize', function() {
	userPicker.show(function(items) {
		vm.printsData.forEach(function(v){
			v.printsSize= items[0].text
		}) 
	});
})
mui('.group-info').on('tap', '.givesSize', function() {
	userPicker.show(function(items) {
		vm.givesData.forEach(function(v){
			v.givesSize= items[0].text
		}) 
	});
})
mui('.group-info').on('tap', '.salesSize', function() {
	userPicker.show(function(items) {
		vm.salesData.forEach(function(v){
			v.salesSize= items[0].text
		}) 
	});
})
mui('.group-info').on('tap', '.selectDate', function(){
	picker.show(function(items) {
		vm.saleDate = items.value
	});
})
mui('.group-info').on('tap', '.add-printsNum', function() { //添加打印张数
	
})
mui('.group-info').on('tap', '.add-givesNum', function() { //添加赠送张数
	
})
mui('.group-info').on('tap', '.add-salesNum', function() { //添加销售张数
	
})