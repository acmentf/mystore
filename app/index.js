var vm = new Vue({
	el: '#app',
	data: {
		pendingSum: 0,
		completedSum: 0,
		cancelSum: 0,
		assignmentSum: 0,
		countNoRead: 0,
	}
})
lf.ready(function() {
	/*var a = lf.window.currentWebview().a
	var b =lf.window.currentWebview().b
	lf.event.fire(lf.window.currentWebview().opener(),'test',{
		a:1,b:2
	})*/
	var params = {};
	lf.net.getJSON('order/statistics', params, function(data) {
		if(data.code == 200) {
				vm.pendingSum = data.data.pendingSum;
				vm.completedSum = data.data.completedSum;
				vm.cancelSum = data.data.cancelSum;
				vm.assignmentSum = data.data.assignmentSum;
				vm.countNoRead  = data.data.countNoRead;
			
		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	})
})

mui('.content').on('tap', '.mod', function() {
	var status = this.getAttribute('data-status')
	lf.window.openWindow('order/orderlist.html', 'order/orderlist.html', {}, {
		status: status
	})
})

mui('.toolbar').on('tap', '.search', function() {
	lf.window.openWindow('order/ordersearch.html', 'order/ordersearch.html')
})

mui('.toolbar').on('tap', '.message', function() {
	lf.window.openWindow('message/message.html', 'message/message.html')
	vm.countNoRead = 0;
})