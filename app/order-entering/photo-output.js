var vm = new Vue({
	el: '#app',
	data: {
		orderId: '',
		photoOutList: []
	}
})

lf.ready(function(){
	vm.orderId = lf.window.currentWebview().orderNo;
	init();
})

document.getElementById('save').addEventListener('tap',function(){

})

// 请求数据
function init(){
	var params = {
		"orderId":vm.orderId
	};
	lf.nativeUI.showWaiting()
	lf.net.getJSON('/order/queryOrderShootResult',params,function (res) {
		lf.nativeUI.closeWaiting()
		if(res.code == 200) {
			lf.nativeUI.toast('操作成功')

		}else{
			lf.nativeUI.toast(res.msg)
		}
    },function(res){
    	lf.nativeUI.closeWaiting()
    	lf.nativeUI.toast(res.msg)
    })
}


