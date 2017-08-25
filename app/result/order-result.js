var vm = new Vue({
	el: '#app',
	data: {
		id: '',                      //销售输出ID
	    orderId: '',                //订单ID
	    isOut: 1,                    //是否输出   1已输出   2未输出
	    saleRemark: '',        //备注
	    reason: '',   	//原因
	    noOutRemark: '',   // 为输出
	    saleDate: '',      //销售时间
	    buyers: '',                 //购买人数
		salesAmt: '',                //销售额
		selectsNum: '',				//选片张数
		shootNum: '',				//拍摄张数
	    printOrderXms: [             //打印张数
	        {
	        	fType: '1',
				id: '',
				orderId: '',
				picNum: '',
				picSize: '',
				picSizeName: '',
				price: ''           //1 打印 2赠送3销售
	        }
	    ]
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
		value: '6',
		text: '7寸'
	}, {
		value: '5',
		text: '6寸'
	}]);
	reasonPicker = new mui.PopPicker();
	reasonPicker.setData(['天气原因','道路中断','旅行团未到指定地点','其他']);
	var wv = lf.window.currentWebview()
	vm.orderId = wv.orderId
	loadResult()
	console.log(JSON.stringify(lf.window.currentWebview()))
})
//尺寸选择器S
mui('.mui-content').on('tap', '.printsSize', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		Vue.set(vm.printOrderXms,index,{
			fType:'1',
			picNum: vm.printOrderXms[index].picNum,
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
	vm.printOrderXms.push({
			id: '',
			fType: '1',
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
//移除E

//保存S

mui('.order-result').on('tap', '.save-btn', function(){
	var params
	if(vm.isOut==1){
		flag = true
//		if(vm.shootNum==''){
//			lf.nativeUI.toast('请输入拍摄张数')
//			flag = false
//			return
//		}
//		if(vm.selectsNum==''){
//			lf.nativeUI.toast('请输入选片张数')
//			flag = false
//			return
//		}
//		if(vm.printOrderXms[0].picSize ==''){
//			lf.nativeUI.toast('请填写打印的尺寸及张数')
//			flag = false
//			return
//		}
		vm.printOrderXms.forEach(function(v){
			if(v.picNum){
				if(!v.picSize){
					lf.nativeUI.toast('请选择打印尺寸')
					flag = false;
					return
				}
			}
			if(v.picSize){
				if(!v.picNum){
				lf.nativeUI.toast('请输入打印数张数')
				flag = false
				return
				}
			}
		})
		var orderX = []
		for (var i = 0;i<vm.printOrderXms.length; i++){
			if(vm.printOrderXms[i].fType == 1){
				orderX[orderX.length] = vm.printOrderXms[i].picSize
			}
			console.log(orderX)
		}
		for(var i=0;i<orderX.length;i++){
			for(var j = i+1;j<orderX.length;j++){
				if(orderX[i]==orderX[j]){
					lf.nativeUI.toast('请勿输入相同照片尺寸')
					flag =false
					return
				}
			}
		}
		params = {
		id: vm.id,
		orderId:vm.orderId,
		isOut: vm.isOut,
		orderXms:vm.printOrderXms,
		selectsNum: vm.selectsNum,			
		shootNum: vm.shootNum,
		saleRemark:vm.saleRemark,
		flag: 1
	}
		
	}else{
		flag = true
		if(!vm.reason||(vm.reason&&vm.reason.length == 0)){
			lf.nativeUI.toast('请选择原因');
			return
		}
		if(vm.reason == '其他'&&vm.noOutRemark==""){
			lf.nativeUI.toast('请在备注中填写其他原因');
			return
		}
		if(vm.reason == '其他'){
			vm.reason = vm.noOutRemark
			return
		}
		params = {
		id: vm.id,
		orderId:vm.orderId,
		isOut: vm.isOut,
		noOutReason:vm.reason,
		flag: 1

	}
	}
	if(flag){
		console.log(JSON.stringify(params));
		lf.nativeUI.showWaiting()
		lf.net.getJSON('order/saveShotOutput', params, function(res) {
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
	lf.net.getJSON('/order/getShotOutput', params, function (res){
		if(res.code == 200){
			console.log(JSON.stringify(res.data.orderX))
			if(res.data.orderX == null){
				return
			}else{
				if(!res.data.orderX.printOrderXms || (res.data.orderX.printOrderXms&&res.data.orderX.printOrderXms.length == 0)){
					vm.printOrderXms = [{fType: '',id: '',orderId: '',picNum: '',picSize: '',picSizeName: '',price: ''}]
				}else{
					vm.printOrderXms = res.data.orderX.printOrderXms
				}
				vm.selectsNum = res.data.orderX.selectsNum
				vm.shootNum = res.data.orderX.shootNum
				vm.id = res.data.orderX.id
				vm.reason = res.data.orderX.noOutReason
				vm.saleRemark = res.data.orderX.saleRemark
				vm.isOut = res.data.orderX.isOut == null ? 1 : res.data.orderX.isOut 
			}
		}else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
}




