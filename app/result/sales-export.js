var vm = new Vue({
	el: '#app',
	data: {
		id: '',
		userId: '',
		orderId: '',
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
		advanceAmount: '',
		payableAmount: '',
		buyers: '',
		total: ''
	},
	methods: {
		computedTotal:function() {
			this.total = Number(this.salesAmt) + Number(this.advanceAmount) + Number(this.payableAmount)
		}
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
		value: '6',
		text: '7寸'
	},
	{
		value: '5',
		text: '6寸'
	}]);
	var wv = lf.window.currentWebview()
	vm.orderId = wv.orderId
	loadResult()
	vm.userId = wv.userId
	console.log(JSON.stringify(lf.window.currentWebview()))
})
mui('.mui-content').on('tap', '.givesSize', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		Vue.set(vm.giveOrderXms,index,{
			fType:'2',
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
			fType:'3',
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
mui('.mui-bar').on('tap', '.save-btn', function(){
		var flag = true 
		vm.saleOrderXms.forEach(function(v){
			if(v.picNum){
				if(!v.picSize){
					lf.nativeUI.toast('请选择销售尺寸')
					flag = false;
				}
			}
			if(v.picSize){
				if(!v.picNum){
					lf.nativeUI.toast('请输入销售张数')
				flag = false
				}
			}
		})
		vm.giveOrderXms.forEach(function(v){
			if(v.picNum){
				if(!v.picSize){
					lf.nativeUI.toast('请选择赠送尺寸')
					flag = false;
				}
			}
			if(v.picSize){
				if(!v.picNum){
					lf.nativeUI.toast('请输入赠送张数')
				flag = false
				}
			}
		})
	var orderXms = vm.giveOrderXms.concat(vm.saleOrderXms)
	// 校验 是否输入了相同的尺寸
	var orderX = []
	var orderY = []
	for (var i = 0;i<orderXms.length; i++){
		if(orderXms[i].fType == 2){
			orderX[orderX.length] = orderXms[i].picSize
		}
		console.log(orderX)
	}
	for(var i=0;i<orderX.length;i++){
		for(var j = i+1;j<orderX.length;j++){
			if(orderX[i]==orderX[j]){
				lf.nativeUI.toast('请勿输入相同照片尺寸')
				flag =false
			}
		}
	}
	for (var i = 0;i<orderXms.length; i++){
		if(orderXms[i].fType == 3){
			orderY[orderY.length] = orderXms[i].picSize
		}
		console.log(orderY)
	}
	for(var i=0;i<orderY.length;i++){
		for(var j = i+1;j<orderY.length;j++){
			if(orderY[i]==orderY[j]){
				lf.nativeUI.toast('请勿输入相同照片尺寸')
				flag =false
			}
		}
	}
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
		flag: 2
	}
	if(flag){
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
	}
			
})
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
					vm.saleOrderXms = [{fType: '',id: '',orderId: '',picNum: '',picSize: '',picSizeName: '',price: ''}]
				}else{
					vm.saleOrderXms = res.data.orderX.saleOrderXms
				}
				if(!res.data.orderX.shotOrderXms||(res.data.orderX.shotOrderXms&&res.data.orderX.shotOrderXms.length == 0)){
					vm.giveOrderXms = [{fType: '',id: '',orderId: '',picNum: '',picSize: '',picSizeName: '',price: ''}]
				}else{
					vm.giveOrderXms = res.data.orderX.shotOrderXms
				}
				vm.id = res.data.orderX.id
				vm.buyers = res.data.orderX.buyers
				vm.salesAmt = res.data.orderX.salesAmt
				vm.advanceAmount = res.data.orderX.advanceAmount
				vm.payableAmount = res.data.orderX.payableAmount

				vm.total = vm.salesAmt + vm.advanceAmount + vm.payableAmount
	
			}
		}else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
}
