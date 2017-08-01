var vm = new Vue({
	el: '#app',
	data: {
//		saleStatus:1,
		isOut:1,
		orderId: '',
		id: '',
		printOrderXms: [
		{
			fType: '',
			id: '',
			orderId: '',
			picNum: '',
			picSize: '',
			picSizeName: '',
			price: ''
		}
		],
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
	reasonPicker = new mui.PopPicker();
	reasonPicker.setData(['景点禁售','其他']);
	var wv = lf.window.currentWebview()
	vm.orderId = wv.orderNo
	loadResult()
})
//尺寸选择器S
mui('.mui-content').on('tap', '.printsSize', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		Vue.set(vm.printOrderXms,index,{
			picNum: vm.printOrderXms[index].picNum,
			picSize: items[0].value,
			picSizeName: items[0].text
		})
	});
})
mui('.mui-content').on('tap', '.givesSize', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		Vue.set(vm.giveOrderXms,index,{
			picNum: vm.giveOrderXms[index].givesNum,
			picSize: items[0].value,
			picSizeName: items[0].text
		})
	});
})
mui('.mui-content').on('tap', '.salesSize', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		Vue.set(vm.saleOrderXms,index,{
			picNum: vm.saleOrderXms[index].salesNum,
			picSize: items[0].value,
			picSizeName: items[0].text
		})
	});
})
//时间选择器
mui('.mui-content').on('tap', '.selectDate', function(){
	picker.show(function(items) {
		vm.saleDate = items.value
	});
})
//原因选择
mui('.mui-content').on('tap','.select-reason',function(){
	reasonPicker.show(function(items) {
		vm.reason = items[0]
	})
})
//尺寸选择器E
mui('.mui-content').on('tap', '.add-printsNum', function() { //添加打印张数
	vm.printOrderXms.push({fType: '',
			id: '',
			orderId: '',
			picNum: '',
			picSize: '',
			picSizeName: '',
			price: ''})
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
//移除S
mui('.mui-content').on('tap', '.remove-printsNum', function(){
	var index = this.getAttribute('data-index');
	vm.printOrderXms.splice(index,1)
})
mui('.mui-content').on('tap', '.remove-salesNum', function(){
	var index = this.getAttribute('data-index');
	vm.saleOrderXms.splice(index,1)
})
mui('.mui-content').on('tap', '.remove-givesNum', function(){
	var index = this.getAttribute('data-index');
	vm.giveOrderXms.splice(index,1)

})
//移除E
mui('.mui-content').on('tap', '#save', function(){
//	var params1 = {
//		orderId:vm.orderId,
//		saleStatus:vm.saleStatus,
//		saleDate:vm.saleDate,
//		printOrderXms:vm.printOrderXms,
//		saleOrderXms:vm.saleOrderXms,
//		giveOrderXms:vm.giveOrderXms,
//		buyers:vm.buyers,
//		salesAmt:vm.salesAmt,
//		remark:vm.remark
//	}
//	var params2 = {
//		orderId:vm.orderId,
//		saleStatus:vm.saleStatus,
//		reason:vm.reason,
//		remark:vm.remark
//
//	}
	var params1 = {
		id: vm.id,
		orderId:vm.orderId,
		isOut: vm.isOut,
//		saleStatus:vm.saleStatus,
		saleDate:vm.saleDate,
		printOrderXms:vm.printOrderXms,
		saleOrderXms:vm.saleOrderXms,
		shotOrderXms:vm.giveOrderXms,
		buyers:vm.buyers,
		salesAmt:vm.salesAmt,
		saleRemark:vm.saleRemark
	}
	var params2 = {
		id: vm.id,
		orderId:vm.orderId,
		isOut: vm.isOut,
//		saleStatus:vm.saleStatus,
		noOutReason:vm.reason,
		saleRemark:vm.saleRemark

	}
	var params
	if(vm.isOut==1){
		params = params1
		var reg= /[^\d]/g;
		flag = true
		params.printOrderXms.forEach(function(v){
		if(reg.test(v.picNum)){
			lf.nativeUI.toast('请输入数字')
			flag = false
		}
		})
		params.saleOrderXms.forEach(function(v){
		if(reg.test(v.picNum)){
			lf.nativeUI.toast('请输入数字')
			flag = false
		}
		})
		params.shotOrderXms.forEach(function(v){
		if(reg.test(v.picNum)){
			lf.nativeUI.toast('请输入数字')
			flag = false
		}
		})
	}else{
		params = params2
		flag = true
		if(vm.reason == '其他'&&vm.saleRemark==""){
			lf.nativeUI.toast('请在备注中填写原因');
			return
		}
	}
	if(flag){
		lf.nativeUI.showWaiting()
		lf.net.getJSON('order/saveSalesOutput', params, function(res) {
		lf.nativeUI.closeWaiting()
		if(res.code == 200) {
			lf.nativeUI.toast('保存成功！');
			lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
			lf.window.closeCurrentWebview();
		} else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
	}
})
function loadResult(){
	var params={
		orderId:vm.orderId
	}
	lf.net.getJSON('/order/getSalesOutput', params, function (res){
		if(res.code == 200){
			if(res.data == null){
				return
			}else{
				if(res.data.salesOrderXms = []){
					vm.saleOrderXms = [{fType: '',id: '',orderId: '',picNum: '',picSize: '',picSizeName: '',price: ''}]
				}else{
					vm.saleOrderXms = res.data.salesOrderXms
				}
				if(res.data.shotOrderXms = []){
					vm.giveOrderXms = [{fType: '',id: '',orderId: '',picNum: '',picSize: '',picSizeName: '',price: ''}]
				}else{
					vm.giveOrderXms = res.data.shotOrderXms
				}
				if(res.data.printOrderXms = []){
					vm.printOrderXms = [{fType: '',id: '',orderId: '',picNum: '',picSize: '',picSizeName: '',price: ''}]
				}else{
					vm.printOrderXms = res.data.printOrderXms
				}
				vm.id = res.data.id
				vm.reason = res.data.reason
				vm.buyers = res.data.buyers
				vm.saleRemark = res.data.saleRemark
				vm.isOut = res.data.isOut
				vm.salesAmt = res.data.salesAmt
			}
		}else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
}




