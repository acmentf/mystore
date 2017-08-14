var vm = new Vue({
	el: '#app',
	data: {
		index :1,
		orderId:null,
		orderHeader: ['团信息', '行程信息', '拍摄信息'],
		shootInfos:[{}], //存放所有拍摄信息
		pullObjects: [],
		groupInfo:{//存放所有团信息
			groupType:'',//团队性质
			groupTypeValue:'',//团队性质的value
		},
		// 行程信息
		marchInfo:{
			startTime: '', // 出团日期
			startTimeValue: '' // 出团日期value
		},
		isRead: false, //是否可以编辑
		getPhotoDate: '', //取片日期
		shootDate:'',//拍摄日期
		ShootInterval:'',//拍摄时段
		intervalRemark:'',//备注时段
		timeName0: '全天',
		timeName1: '上午',
		timeName2: '下午',
		timeName3: '晚上',
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
		vm.groupInfo.groupType = items[0].text
		vm.groupInfo.groupTypeValue = items[0].value
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
		vm.marchInfo.startTime = rs.text;
		vm.marchInfo.startTimeValue = rs.value;
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
mui('#app').on('tap', '.psrq', function() {
	var index = this.getAttribute('data-index');
	var optionsJson = this.getAttribute('data-options') || '{}';
	var options = JSON.parse(optionsJson);
	var picker = new mui.DtPicker(options);
	picker.show(function(rs) {
		console.log(rs)
		vm.shootInfos[index].shootTime = rs.text;
		picker.dispose();
	});
}, false);

//拍摄时段
mui('#app').on('tap', '.pssd', function() {
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
		console.log(JSON.stringify(vm.shootInfos))
		vm.shootInfos[index].periodType = items[0].value
	}, false);

})

//时段备注
//mui('#app').on('tap', '.sdbz', function() {
//	var optionsJson = this.getAttribute('data-options') || '{}';
//	var options = JSON.parse(optionsJson);
//	var picker = new mui.DtPicker(options);
//	picker.show(function(rs) {
//		vm.intervalRemark = rs;
//		picker.dispose();
//	});
//}, false);

//添加拍摄按钮
mui('#app').on('tap', '.addshootinfo', function() {
	var shootObj = {
		id:null,
		photographerIds:[],
		journeyName :'',
		shootTime : '',
		periodType :'',
		remark :'',
		photographerNames :''}
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
mui('#app').on('tap', '.fpsys', function() {
	lf.window.openWindow('designate/assign-staff.html', '../designate/assign-staff.html')
}, false);

//保存
mui('.mui-bar-nav').on('tap', '.save',function(){
	var params = {
		orderId: vm.orderId,
		lineSightList : vm.shootInfos,
		order: {
//				areaName :vm.groupInfo.areaName,//区域
				assignNames : vm.groupInfo.lineName,//导游姓名
//				lineName : vm.groupInfo.lineName,//线路名称
				fetchPhotoTime :vm.marchInfo.fetchPhotoTime,//取片日期
				fetchPhotoScene :vm.marchInfo.fetchPhotoScene,//取片地点
				tourGuide : vm.groupInfo.tourGuide,//导游姓名
				tourGuidePhone : vm.groupInfo.tourGuidePhone//导游电话
		},
		tourGroups: {
				id: vm.marchInfo.id,
				groupType :vm.groupInfo.groupType,//团性质
				personCount : vm.groupInfo.personCount,//团人数
				startTime :vm.marchInfo.startTime,//出团日期
				groupDays : vm.marchInfo.groupDays,//行程天数
				preReservedSeats : vm.marchInfo.preReservedSeats,//摄影师预留座位
				busCardNo : vm.marchInfo.busCardNo,//车牌号码
				groupRoute : vm.marchInfo.groupRoute,//行程详情
				exeRemark : vm.marchInfo.exeRemark//备注信息
		}
	};

	lf.net.getJSON('order/saveOrderTrackInfo', params, function(data) {
		if(data.code == 200) {
			lf.nativeUI.toast('保存成功');
		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.toast(erro.msg);
	});
})

lf.ready(function() {
	renderTrackInfo();
})

//读取页面信息
function renderTrackInfo(){
//	var orderNo = lf.window.currentWebview().orderNo;
	var params = {
		orderNo: 10100000002385
	};
	lf.net.getJSON('order/getOrderTrackInfo', params, function(data) {
		if(data.code == 200) {
			if(data.data.startTime){
				data.data.startTime = lf.util.timeStampToDate2(data.data.startTime)
			}
			if(data.data.fetchPhotoTime){
				data.data.fetchPhotoTime = lf.util.timeStampToDate2(data.data.fetchPhotoTime)
			}
			if(data.data.startTime){
				data.data.startTime = lf.util.timeStampToDate2(data.data.startTime)
			}
			vm.orderId = data.data.orderId
			vm.groupInfo={
				areaName :data.data.areaName,//区域
				assignNames : data.data.assignNames,//导游姓名
				lineName :data.data.lineName,//线路名称
				groupType :data.data.groupType,//团性质
				personCount : data.data.personCount,//团人数
				tourGuide : data.data.tourGuide,//导游姓名
				tourGuidePhone : data.data.tourGuidePhone//导游电话
			}
			vm.marchInfo={
				id : data.data.id,
				startTime :data.data.startTime,//出团日期
				groupDays : data.data.groupDays,//行程天数
				fetchPhotoTime :data.data.fetchPhotoTime,//取片日期
				fetchPhotoScene :data.data.fetchPhotoScene,//取片地点
				preReservedSeats : data.data.preReservedSeats,//摄影师预留座位
				busCardNo : data.data.busCardNo,//车牌号码
				groupRoute : data.data.groupRoute,//行程详情
				exeRemark : data.data.exeRemark//备注信息
			}
			data.data.lineSight.forEach(function(val){
				val.shootTime = lf.util.timeStampToDate2(val.shootTime)
			})
			vm.shootInfos = []
			data.data.lineSight.forEach(function(v){
				var forLine = {
					id : v.id,
					journeyName :v.journeyName,
					shootTime : v.shootTime,
					periodType :v.periodType,
					remark :v.remark,
					photographerNames :v.photographerNames,
					photographerIds : v.photographerIds
				}
				vm.shootInfos.push(forLine)
			})
//			vm.shootInfos = data.data.lineSight
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
