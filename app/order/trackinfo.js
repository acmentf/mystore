var vm = new Vue({
	el: '#trackinfo',
	data: {
		shootTime: '2014-01-01',
		time: 0,
		timeName0: '全天',
		timeName1: '上午',
		timeName2: '下午',
		timeName3: '晚上',
		shootInfoForms: [{ id: '', "journeyName": "", "periodType": 0, "shootTime": '' }],
		trackInfo: {},
		currentOrderId: ''
	}
})
var picke = null;
lf.ready(function() {
	var orderNo = lf.window.currentWebview().orderNo;
	var params = {
		orderNo: orderNo
	};
	lf.net.getJSON('order/getOrderTrackInfo', params, function(data) {
		if(data.code == 200) {
			vm.trackInfo = data.data;
			vm.shootInfoForms = data.data.lineSight;
			vm.shootInfoForms.forEach(function(v, i) {
				v.shootTime = lf.util.timeStampToDate2(v.shootTime)
			})
			if(data.data.fetchPhotoTime) {
				vm.trackInfo.fetchPhotoTime = lf.util.timeStampToDate2(data.data.fetchPhotoTime)
			} else {
				vm.trackInfo.fetchPhotoTime = ''
			}
			vm.currentOrderId = data.data.orderId; //记录订单Id
		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	});
	//				initDateChoose()
	//				lf.window.closeCurrentWebview();
	var opts = { "type": "date" }
	picker = new mui.DtPicker(opts); //拍摄时间选择
	userPicker = new mui.PopPicker(); //具体时间选择 全天上午下午晚上
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
})
mui('.group-info').on('tap', '.shootTime', function() {
	var index = this.getAttribute('data-index');
	initDateChoose(index);
})
mui('.shoot-info').on('tap', '.addshootinfo', function() { //添加拍摄信息
	var obj = { journeyName: '', shootTime: '', periodType: 0 };
	vm.shootInfoForms.push(obj)
})
mui('.save').on('tap', '.save-trackinfo', function() { //保存跟踪信息
	var params = {
		orderId: vm.currentOrderId,
		lineSightList: vm.shootInfoForms,
		order: {
			fetchPhotoTime: vm.trackInfo.fetchPhotoTime,
			fetchPhotoScene: vm.trackInfo.fetchPhotoScene
		},
		tourGroups: {
			id: vm.trackInfo.id,
			personCount: vm.trackInfo.personCount,
			groupType: vm.trackInfo.groupType,
			groupRoute: vm.trackInfo.groupRoute,
			groupDays: vm.trackInfo.groupDays,
			preReservedSeats: vm.trackInfo.preReservedSeats,
			busCardNo: vm.trackInfo.busCardNo
		}
	}
	var emptyFalg = false;
	for(var i = 0; i < vm.shootInfoForms.length; i++) {
		if(vm.shootInfoForms[i].journeyName == '') {
			lf.nativeUI.toast('请填写拍摄地点！');
			emptyFalg = true
		} else if(vm.shootInfoForms[i].shootTime == '') {
			lf.nativeUI.toast('请填写拍摄时间！');
			emptyFalg = true
		}
	}
	if(!emptyFalg) {
		lf.net.getJSON('order/saveOrderTrackInfo', params, function(data) {
			if(data.code == 200) {
				lf.nativeUI.toast('保存成功！');
				/*lf.window.openWindow('order/orderdetails.html','../order/orderdetails.html',{},{
					orderId: vm.currentOrderId
				})*/
				lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
				lf.window.closeCurrentWebview();
			} else {
				lf.nativeUI.toast(data.msg);
			}
		}, function(erro) {
			lf.nativeUI.toast(erro.msg);
		});
	}

})

mui('.group-info').on('tap', '.time', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
	vm.shootInfoForms[index].periodType = items[0].value
		//返回 false 可以阻止选择框的关闭
		//return false;
	});

})

function initDateChoose(index) {
	//					var optionsJson = this.getAttribute('data-options') || '{}';
	//					var options = JSON.parse(optionsJson);
	//					var id = this.getAttribute('id');
	/*
	 * 首次显示时实例化组件
	 * 示例为了简洁，将 options 放在了按钮的 dom 上
	 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
	 */
	picker.show(function(rs) {
		/*
		 * rs.value 拼合后的 value
		 * rs.text 拼合后的 text
		 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
		 * rs.m 月，用法同年
		 * rs.d 日，用法同年
		 * rs.h 时，用法同年
		 * rs.i 分（minutes 的第二个字母），用法同年
		 */
		vm.shootInfoForms[index].shootTime = rs.text
		/* 
		 * 返回 false 可以阻止选择框的关闭
		 * return false;
		 */
		/*
		 * 释放组件资源，释放后将将不能再操作组件
		 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
		 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
		 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
		 */
		//						picker.dispose();
	});
}