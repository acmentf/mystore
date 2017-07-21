var vm = new Vue({
	el: '#trackinfo',
	data: {
		shootTime: '2014-01-01',
		time: 0,
		timeName0: '全天',
		timeName1: '上午',
		timeName2: '下午',
		timeName3: '晚上',
		shootInfoForms: [{ "journeyName": "长沙", "periodType": 0, "shootTime": 1500048000000 }],
		trackInfo: {
			"busCardNo": "0000",
			"fetchPhotoScene": "麓谷",
			"fetchPhotoTime": 1502985600000,
			"groupDays": "2",
			"groupRoute": "第1天 【凤凰古城】\n\n07:00 汽车: 长沙火车站阿波罗广场集合，7：30左右 出发前往湘西，开始愉快的凤凰之旅，经宁乡、益阳、常德、沅陵、\n行程距离：450.00公里 行驶时间：390分钟\n第2天 【凤凰古城】\n  \n14:30 汽车: 根据旅行社安排中午12:00至15:00左右返回长沙（车行6个半小时左右），遇到旺季可能堵车，请勿购\n行程距离：450.00公里 行驶时间：390分钟",
			"groupType": "跟团游",
			"id": 126,
			'personCount': 1,
			"orderId": 126,
			"personCount": 10,
			"preReservedSeats": 10
		}
	}
})
var picke = null;
lf.ready(function() {
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
	console.log('index:' + index)
	initDateChoose(index);
})
mui('.shoot-info').on('tap', '.addshootinfo', function() { //添加拍摄信息
	var obj = { journeyName: '', shootTime: '', periodType: 0 };
	vm.shootInfoForms.push(obj)
})
mui('.save').on('tap', '.save-trackinfo', function() { //保存跟踪信息
	var orderid = this.getAttribute('data-orderid');
	console.log(orderid)
	lf.window.openWindow('orderdetails','orderdetails.html',{},{
		orderId: orderid,
	})
})

mui('.group-info').on('tap', '.time', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		console.log(JSON.stringify(items[0]));

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
		console.log(index)
		console.log('选择结果: ' + rs.text)
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