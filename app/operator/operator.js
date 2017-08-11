var vm = new Vue({
	el: '#app',
	data: {
		status:1,
		orderHeader: ['团信息', '行程信息', '拍摄信息'],
		shootInfos:[{info:[]}], //存放所有拍摄信息
		pullObjects: [],
		isRead: false, //是否可以编辑
		teamProperty: '', //团队性质
		goDate: '', //出团日期
		getPhotoDate: '', //取片日期
		shootDate:'',//拍摄日期
		ShootInterval:'',//拍摄时段
		intervalRemark:'',//备注时段

	}
})

function getType(index) {
	var r = "";
	console.log(index);
	if(vm.currentRole == 2) {
		switch(index) {
			case 1:
				r = 1;
				break;
			case 2:
				r = 2;
				break;
			case 3:
				r = 3;
				break;
			default:
				break;
		}
	} else {
		switch(index) {
			case 1:
				r = 1;
				break;
			case 2:
				r = 2;
				break;
			case 3:
				r = 4;
				break;
			case 4:
				r = 3;
				break;
			default:
				break;
		}
	}
	console.log('r:' + r);
	return r;
}

//团队性质
mui('#app').on('tap', '#showUserPicker', function() {
	var index = this.getAttribute('data-index');
	var userPicker = new mui.PopPicker();
	userPicker.setData([{
		value: 'ywj',
		text: '自由组团'
	}, {
		value: 'aaa',
		text: '摄影团'
	}]);
	userPicker.show(function(items) {
		vm.teamProperty = items[0]
		//返回 false 可以阻止选择框的关闭
		//return false;
	}, false);

})

// 出团日期
mui('#app').on('tap', '#chutuan', function() {
	var optionsJson = this.getAttribute('data-options') || '{}';
	var options = JSON.parse(optionsJson);
	var picker = new mui.DtPicker(options);
	picker.show(function(rs) {
		vm.goDate = rs;
		picker.dispose();
	});
}, false);

//取片日期
mui('#app').on('tap', '#qupian', function() {
	var optionsJson = this.getAttribute('data-options') || '{}';
	var options = JSON.parse(optionsJson);
	var picker = new mui.DtPicker(options);
	picker.show(function(rs) {
		vm.getPhotoDate = rs;
		picker.dispose();
	});
}, false);

//拍摄日期
mui('#app').on('tap', '#psrq', function() {
	var optionsJson = this.getAttribute('data-options') || '{}';
	var options = JSON.parse(optionsJson);
	var picker = new mui.DtPicker(options);
	picker.show(function(rs) {
		vm.shootDate = rs;
		picker.dispose();
	});
}, false);

//拍摄时段
mui('#app').on('tap', '#pssd', function() {
	var index = this.getAttribute('data-index');
	var userPicker = new mui.PopPicker();
	userPicker.setData([{
		value: '0',
		text: '全天'
	}, {
		value: '1',
		text: '上午'
	}, {
		value: '2',
		text: '下午'
	}, {
		value: '3',
		text: '晚上'
	}]);
	userPicker.show(function(items) {
		vm.ShootInterval = items[0]
	}, false);

})

//时段备注
mui('#app').on('tap', '#sdbz', function() {
	var optionsJson = this.getAttribute('data-options') || '{}';
	var options = JSON.parse(optionsJson);
	var picker = new mui.DtPicker(options);
	picker.show(function(rs) {
		vm.intervalRemark = rs;
		picker.dispose();
	});
}, false);

//添加拍摄按钮
mui('#app').on('tap', '.addshootinfo', function() {
	let shootObj = {info:[]}
	vm.shootInfos.push(shootObj)
}, false);
//删除拍摄信息
mui('#app').on('tap', '.superscript-xx', function() {
	if(vm.shootInfos.length<=1){
		lf.nativeUI.toast('至少保留一组拍摄信息')
		return;
	}
	var index = this.getAttribute('data-index');
	vm.shootInfos.splice(index,1)
}, false);
//选择摄影师
mui('#app').on('tap', '.sys', function() {
	lf.window.openWindow('../order/ordersearch.html', 'ordersearch.html')
}, false);

lf.ready(function() {
	renderTrackInfo();
	document.querySelector('.mui-slider').addEventListener('slide', function(event) {
		vm.index = event.detail.slideNumber;

	});

	//	var status = lf.window.currentWebview().status;
	var status = 3
	var gallery = mui('.mui-slider');
	switch(status) {
		case '1':
			gallery.slider().gotoItem(1, 0);
			break;
		case '2':
			gallery.slider().gotoItem(2, 0);
			break;
		case '3':
			gallery.slider().gotoItem(3, 0);
			break;
		default:
			break;
	}

})

//读取页面信息
function renderTrackInfo(){
//	var orderNo = lf.window.currentWebview().orderNo;
	var params = {
		orderNo: 10100000002357
	};
	lf.net.getJSON('order/getOrderTrackInfo', params, function(data) {
		if(data.code == 200) {
			console.log('data==',data)
		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	});
}

lf.event.listener('orderdetails',function(e){
	renderTrackInfo();
	lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
})
//document.getElementById('searchDiv').addEventListener('tap',function(){
//	lf.window.openWindow('ordersearch.html', 'ordersearch.html')
//})

//mui('.order-ul').on('tap', '.nr', function() {
//	var id = this.getAttribute('data-id');
//	lf.window.openWindow('orderdetails.html', 'orderdetails.html', {}, {
//		orderNo: id
//	})
//})
//mui('.order-ul').on('tap', '.qdbtn', function() {
//	var id = this.getAttribute('data-id')
//	var no = this.getAttribute('data-no')
//	//确认，取消
//	lf.nativeUI.confirm("", "你确认要执行订单",  ["确定","取消"] ,function(e){
// 		if(e.index == 0){
// 			var params = {
//				"orderId":id,
//				"orderState": 2,
//				"orderNo": no
//			};
//			lf.nativeUI.showWaiting()
//			lf.net.getJSON('/order/updateOrderState',params,function (res) {
//				lf.nativeUI.closeWaiting()
//				if(res.code == 200) {
//					mui(vm.pullObjects[1]).pullToRefresh().pullDownLoading();
//					lf.nativeUI.toast('操作成功')
//				}else{
//					lf.nativeUI.toast(res.msg)
//				}
//          },function(res){
//          	lf.nativeUI.closeWaiting()
//          	lf.nativeUI.toast(res.msg)
//          })
// 		}
//	});
//})