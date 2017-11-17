var vm = new Vue({
	el: '#app',
	data: {
		pendingSum: 0,
		completedSum: 0,
		cancelSum: 0,
		assignmentSum: 0,
		countNoRead: 0,
		stationDate: [],
		stationPickerDate: [],
		currentStationName: '',
		currentRole: ''
	}
})
lf.ready(function() {
	/*var a = lf.window.currentWebview().a
	var b =lf.window.currentWebview().b
	lf.event.fire(lf.window.currentWebview().opener(),'test',{
		a:1,b:2
	})*/

	getStaticList();
	vm.currentStationName = window.Role.userroleName
	vm.stationDate = window.Role.positions;
	vm.currentRole = window.Role.userrole;
	vm.stationDate.forEach(function(v, i) {
		var obj = { id: '', text: '' };
		obj.value = v.id;
		obj.text = v.name;
		vm.stationPickerDate.push(obj);
	})
	stationPicker = new mui.PopPicker(); //具体时间选择 全天上午下午晚上
	stationPicker.setData(vm.stationPickerDate);

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

mui('.toolbar').on('tap', '.icon-tuichu', function() {
	lf.nativeUI.confirm("操作提示", "确定要退出当前用户吗?", ["确定", "取消"], function(e) {
		if(e.index == 0) {
			window.Role.logout();
			GLOBAL_SHOOT.restart();
		}
	});
})

mui('.toolbar').on('tap', '.ico-loop', function() { //角色转换
	stationPicker.show(function(items) {
		var params = {
			positionId: items[0].value
		};
		lf.nativeUI.showWaiting();
		lf.net.getJSON('user/switchPosition', params, function(data) {
			if(data.code == 200) {
				//window.Role.logout();
				//GLOBAL_SHOOT.restart();
				lf.nativeUI.closeWaiting();
				var obj = {
					usercode: data.data.id,
					username: data.data.name,
					phone: data.data.phone,
					companyId: data.data.companyId,
					userrole: data.data.positions[0].type,
					userroleName: data.data.positions[0].name,
					tonken: data.data.token,
					loginsign: '1',
					auths: data.data.auths,
					positions: data.data.userPositionList
				}
				window.Role.save(obj)
				vm.currentStationName = window.Role.userroleName
				lf.nativeUI.toast('切换成功');
				getStaticList();
				vm.currentRole = window.Role.userrole;
			} else {
				lf.nativeUI.closeWaiting();
				lf.nativeUI.toast(data.msg);
			}
		}, function(erro) {
			lf.nativeUI.closeWaiting();
			lf.nativeUI.toast(erro.msg);
		})

	});
})

function getStaticList(){
	var params = {};
	lf.net.getJSON('order/statistics', params, function(data) {
		if(data.code == 200) {
			vm.pendingSum = data.data.pendingSum;
			vm.completedSum = data.data.completedSum;
			vm.cancelSum = data.data.cancelSum;
			vm.assignmentSum = data.data.assignmentSum;
			vm.countNoRead = data.data.countNoRead;

		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	})
}

lf.event.listener('indexdata',function(e){
	getStaticList();
})