var vm = new Vue({
	el: '#app',
	data: {
		cut:1,
		orderId: '',
		id: '',
		shootPeoNum: '',
		shootNum: '',
		selectsNum: '',
		printsData: [
		{
			printsNum:'',
			printsSize:'',
			printsSizeName:''
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
mui('.mui-content').on('tap', '.printsSize', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		Vue.set(vm.printsData,index,{
			printsNum: vm.printsData[index].printsNum,
			printsSize: items[0].value,
			printsSizeName: items[0].text
		})
	});
})
mui('.mui-content').on('tap', '.givesSize', function() {
	userPicker.show(function(items) {
		vm.givesData.forEach(function(v){
			v.givesSize= items[0].text
		}) 
	});
})
mui('.mui-content').on('tap', '.salesSize', function() {
	userPicker.show(function(items) {
		vm.salesData.forEach(function(v){
			v.salesSize= items[0].text
		}) 
	});
})
mui('.mui-content').on('tap', '.selectDate', function(){
	picker.show(function(items) {
		vm.saleDate = items.value
	});
})
mui('.mui-content').on('tap', '.add-printsNum', function() { //添加打印张数
	vm.printsData.push({
			printsNum:'',
			printsSize:''
		})
})
mui('.mui-content').on('tap', '.add-givesNum', function() { //添加赠送张数
	vm.givesData.push({
			givesNum:'',
			givesSize:''
		})
})
mui('.mui-content').on('tap', '.add-salesNum', function() { //添加销售张数
	vm.salesData.push({
			salesNum:'',
			salesSize:''
		})
})
mui('.mui-content').on('tap', '.remove-icon', function(){
	var index = this.getAttribute('data-index');
	console.log(index , JSON.stringify(vm.printsData) )
	vm.printsData.splice(index,1)
})

mui('.mui-content').on('tap', '#save', function(){
	console.log(JSON.stringify(vm.printsData))
})
