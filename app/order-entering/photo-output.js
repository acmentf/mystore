var vm = new Vue({
	el: '#app',
	data: {
		orderId: '',
		photoOutList: [],
		remark:''
	}
})
lf.ready(function(){
	vm.orderId = lf.window.currentWebview().orderNo;
	init();
})
mui('.mui-content').on('tap','#saveBtn',function(){
	var forNum = []
	vm.photoOutList.forEach(function(val){
		var reg= /[^\d]/g;
		if(reg.test(val.num)){
			lf.nativeUI.toast('拍摄张数请输入数字')
		}else{
			forNum.push(val.num)
		}
	})
	var params = {
		"orderId":vm.orderId,
		"num" :forNum,
		"remark": vm.remark
	};
	lf.nativeUI.showWaiting()
	lf.net.getJSON('/order/saveOrderShootResult',params,function (data) {
		lf.nativeUI.closeWaiting()
		if(data.code == 200) {

		}else{
			lf.nativeUI.toast(data.msg)
		}
    },function(res){
    	lf.nativeUI.closeWaiting()
    	lf.nativeUI.toast(res.msg)
    })
})

// 请求数据
function init(){
	var params = {
		"orderId":vm.orderId
	};
	lf.nativeUI.showWaiting()
	lf.net.getJSON('/order/queryOrderShootResult',params,function (data) {
		lf.nativeUI.closeWaiting()
		if(data.code == 200) {
			lf.nativeUI.toast('操作成功')
			vm.remark = data.data.remark
			vm.photoOutList = data.data.shootInfos
		}else{
			lf.nativeUI.toast(data.msg)
		}
    },function(res){
    	lf.nativeUI.closeWaiting()
    	lf.nativeUI.toast(res.msg)
    })
}


