var vm = new Vue({
	el: '#app',
	data: {
		orderId: ''
	}
})

lf.ready(function(){
	vm.orderId = lf.window.currentWebview().orderNo;
	init();
})

document.getElementById('save').addEventListener('tap',function(){
	lf.net.getJSON()
})

// 请求数据
function init(){
	lf.net.getJSON()
}


