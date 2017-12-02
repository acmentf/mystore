var vm = new Vue({
	el: '#app',
	data: {
		id: '',
		userId: '',
		orderId: '',
		giveOrderXms: [],
		saleOrderXms: [{
			fType: '',
			id: '',
			orderId: '',
			picNum: '',
			picSize: '',
			picSizeName: '',
			// 产品类型
			remark: ''
		}],
		saleDate: '',
		salesAmt: '',
		advanceAmount: '',
		payableAmount: '',
		buyers: '',
		total: ''
	},
	computed: {
		saleRemoveIconShow() {
			return this.saleOrderXms.length > 1;
		}
	},
	methods: {
		computedTotal:function() {
			var _total = Number(this.salesAmt) + Number(this.advanceAmount) + Number(this.payableAmount)
			this.total = _total.toFixed(2)
		}
	}
})
var userPicker,picker;
let sizesEmun = [
		{
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
			value: '6',
			text: '7寸'
		},
		{
			value: '5',
			text: '6寸'
		}
	];
let salesTypeEmun = [
		{
			value: '相片',
			text: '相片'
		},
		{
			value: '相框',
			text: '相框'
		},
		{
			value: '相片+相框',
			text: '相片+相框'
		},
		{
			value: '电子片',
			text: '电子片'
		}
	];
lf.ready(function(){
	userPicker = new mui.PopPicker();
	var wv = lf.window.currentWebview()
	vm.orderId = wv.orderId
	loadResult()
	vm.userId = wv.userId
	console.log(JSON.stringify(lf.window.currentWebview()))
})
mui('.mui-content').on('tap', '.gives-size', function() {
	var index = this.getAttribute('data-index');
	let currentItem = {...vm.giveOrderXms[index]};
	userPicker.setData(sizesEmun);
	userPicker.show(function(selectedItem) {
		currentItem.picSize = selectedItem[0].value;
		currentItem.picSizeName = selectedItem[0].text;
		Vue.set(vm.giveOrderXms,index,currentItem)
	});
})

// 选择赠送类型
mui('.mui-content').on('tap', '.gives-type', function() {
	let index = this.getAttribute('data-index');
	let currentItem = {...vm.giveOrderXms[index]};
	userPicker.setData(salesTypeEmun);
	userPicker.show(function(selectedItem) {
		currentItem.remark = selectedItem[0].value;
		Vue.set(vm.giveOrderXms,index,currentItem)
	})
});

mui('.mui-content').on('tap', '.sales-size', function() {
	var index = this.getAttribute('data-index');
	let currentItem = {...vm.saleOrderXms[index]};
	userPicker.setData(sizesEmun);
	userPicker.show(function(selectedItem) {
		currentItem.picSize = selectedItem[0].value;
		currentItem.picSizeName = selectedItem[0].text;
		Vue.set(vm.saleOrderXms,index,currentItem)
	});
});
// 选择销售类型
mui('.mui-content').on('tap', '.sales-type', function() {
	console.log(index)
	let index = this.getAttribute('data-index');
	let currentItem = {...vm.saleOrderXms[index]};
	userPicker.setData(salesTypeEmun);
	userPicker.show(function(selectedItem) {
		currentItem.remark = selectedItem[0].value;
		Vue.set(vm.saleOrderXms,index,currentItem)
	})
});

mui('.mui-content').on('tap', '.add-givesNum', function() { //添加赠送张数
	vm.giveOrderXms.push({
		fType: 2,
		id: '',
		orderId: '',
		picNum: '',
		picSize: '',
		picSizeName: '',
		remark: ''
	})
})
mui('.mui-content').on('tap', '.add-salesNum', function() { //添加销售张数
	vm.saleOrderXms.push({
		fType: 3,
		id: '',
		orderId: '',
		picNum: '',
		picSize: '',
		picSizeName: '',
		remark: ''
	})
});

mui('.mui-content').on('tap', '.remove-salesNum', function(){
	var index = this.getAttribute('data-index');
	vm.saleOrderXms.splice(index,1)
})
mui('.mui-content').on('tap', '.remove-givesNum', function(){
	var index = this.getAttribute('data-index');
	vm.giveOrderXms.splice(index,1)
})
mui('.mui-content').on('tap', '.saleDate', function () { //选择销售日期
	var inputs = document.getElementsByTagName("input")
	for(var i=0;i<inputs.length;i++){
		inputs[i].blur();
	}
	var opts = { "type": "datetime" };
	picker = new mui.DtPicker(opts);
	picker.setSelectedValue(vm.saleDate)
	picker.show(function (select) {
		vm.saleDate = select.value
	})
})
mui('.mui-bar').on('tap', '.save-btn', function(){
	if(!vm.saleDate){
		lf.nativeUI.toast('请选择销售时间')
		return;
	}

	var reg = /^[1-9]\d*$/
	for (let i = 0; i < vm.saleOrderXms.length; i++) {
		let item = vm.saleOrderXms[i];
		if(!item.remark) {
			lf.nativeUI.toast('请选择销售类型');
			return;
		}
		if(!item.picSize) {
			lf.nativeUI.toast('请选择销售尺寸');
			return;
		}
		if(!reg.test(item.picNum)){
			if(item.picNum == 0) {

			} else {
				lf.nativeUI.toast('请输入正确的销售张数');
				return;
			}
		}
	}

	for (let i = 0; i < vm.giveOrderXms.length; i++) {
		let item = vm.giveOrderXms[i];
		if(!item.remark) {
			lf.nativeUI.toast('请选择赠送类型');
			return;
		}
		if(!item.picSize) {
			lf.nativeUI.toast('请选择赠送尺寸');
			return;
		}
		if(!reg.test(item.picNum)) {
			if(item.picNum == 0) {
				
			} else {
				lf.nativeUI.toast('请输入正确的赠送张数');
				return;
			}
		}
	}

	// 通过 saleOrderXmsCopy 去重校验 vm.saleOrderXms 是否选择了相同销售类型与销售尺寸;
	let saleOrderXmsCopy = vm.saleOrderXms.map((item) => {
		return `remark:${item.remark},picSize:${item.picSize},picSizeName:${item.picSizeName}`;
	});
	let tempSaleOrderXms = [];
	for(let i = 0; i < saleOrderXmsCopy.length; i ++) {
		if(tempSaleOrderXms.indexOf(saleOrderXmsCopy[i]) == -1) {
			tempSaleOrderXms.push(saleOrderXmsCopy[i]);
		} else {
			lf.nativeUI.toast('请勿选择相同的销售类型与销售尺寸');
			return;
		}
	}

	// 通过 giveOrderXmsCopy 去重校验 vm.giveOrderXms 是否选择了相同赠送类型与赠送尺寸;
	let giveOrderXmsCopy = vm.giveOrderXms.map((item) => {
		return `remark:${item.remark},picSize:${item.picSize},picSizeName:${item.picSizeName}`;
	});

	let tempGiveOrderXms = [];
	for(let i = 0; i < giveOrderXmsCopy.length; i ++) {
		if(tempGiveOrderXms.indexOf(giveOrderXmsCopy[i]) == -1) {
			tempGiveOrderXms.push(giveOrderXmsCopy[i]);
		} else {
			lf.nativeUI.toast('请勿选择相同的赠送类型与赠送尺寸');
			return;
		}
	}
	
	let orderXms = vm.saleOrderXms.concat(vm.giveOrderXms);

	// 传参
	var params ={
		id: vm.id,
		userId: vm.userId,
		orderId: vm.orderId,
		salesAmt: vm.salesAmt,
		advanceAmount: vm.advanceAmount,
		payableAmount: vm.payableAmount,
		buyers: vm.buyers,
		orderXms: orderXms,
		flag: 2,
		saleDate:new Date(vm.saleDate.replace(/-/g, '/'))
	}
	lf.nativeUI.showWaiting()
	lf.net.getJSON('order/saveSalesOutput', params, function (res){
		lf.nativeUI.closeWaiting()
		if(res.code == 200){
			lf.nativeUI.toast('保存成功！');
			lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
			lf.window.closeCurrentWebview();
		}else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
})
function timeStampToDate(timestamp) { //时间戳转换成正常日期格式
	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
	var time = new Date(timestamp);
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	var date = time.getDate();
	var hours = time.getHours();
	var minutes = time.getMinutes();
	return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes);
}
function loadResult(){
	var params={
		orderId:vm.orderId
	}
	lf.net.getJSON('/order/getSalesOutput', params, function (res){
		if(res.code == 200){
			console.log(JSON.stringify(res.data.orderX))
			if(res.data == null){
				return
			}else{
				if( !res.data.orderX.saleOrderXms ||(res.data.orderX.saleOrderXms&&res.data.orderX.saleOrderXms.length == 0)){
					vm.saleOrderXms = [{fType: 3,id: '',orderId: '',picNum: '',picSize: '',picSizeName: '', remark: ''}]
				}else{
					vm.saleOrderXms = res.data.orderX.saleOrderXms
				}
				if(!res.data.orderX.giveOrderXms||(res.data.orderX.giveOrderXms&&res.data.orderX.giveOrderXms.length == 0)){
					// vm.giveOrderXms = [{fType: '2',id: '',orderId: '',picNum: '',picSize: '',picSizeName: '', remark: ''}]
					vm.giveOrderXms = [];
				}else{
					vm.giveOrderXms = res.data.orderX.giveOrderXms
				}
				vm.id = res.data.orderX.id
				vm.buyers = res.data.orderX.buyers
				vm.salesAmt = res.data.orderX.salesAmt
				vm.advanceAmount = res.data.orderX.advanceAmount
				vm.payableAmount = res.data.orderX.payableAmount
				if(res.data.orderX.saleDate){
					vm.saleDate = timeStampToDate(res.data.orderX.saleDate)
				}
				vm.total = (vm.salesAmt + vm.advanceAmount + vm.payableAmount).toFixed(2)
	
			}
		}else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
}
