var vm = new Vue({
	el: '#app',
	data: {
		currentRoleId:'',
		forindex: 0,
		orderNo:null,
		forStatus:'check',//check是查看，edit是直接能编辑的
		orderId:null,
		operatorHeader: ['团信息', '行程信息', '拍摄信息'],
		shootInfos:[{
			id:null,
			photographers:[],
			journeyName :'',
			shootTime : '',
			periodType :'',
			remark :'',
			photographerNames :''
		}], //存放所有拍摄信息
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


//团队性质
mui('#app').on('tap', '#showUserPicker', function() {
	if(vm.forStatus == 'edit'){
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
	}
})

// 出团日期
mui('#app').on('tap', '#chutuan', function() {
	if(vm.forStatus == 'edit'){
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			vm.marchInfo.startTime = rs.text;
			vm.marchInfo.startTimeValue = rs.value;
			picker.dispose();
		});
	}
}, false);

//取片日期
mui('#app').on('tap', '#qupian', function() {
	if(vm.forStatus == 'edit'){
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			vm.marchInfo.fetchPhotoTime = rs.text;
			vm.marchInfo.fetchPhotoTime = rs.value;
			picker.dispose();
		});
	}

}, false);

//拍摄日期
mui('#app').on('tap', '.psrq', function() {
	if(vm.forStatus == 'edit'){
		var index = this.getAttribute('data-index');
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			vm.shootInfos[index].shootTime = rs.text;
			picker.dispose();
		});
	}
}, false);

//拍摄时段
mui('#app').on('tap', '.pssd', function() {
	if(vm.forStatus == 'edit'){
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
			vm.shootInfos[index].periodType = items[0].value
		}, false);
	}
})

//添加拍摄按钮
mui('#app').on('tap', '.addshootinfo', function() {
	if(vm.forStatus == 'edit'){
		var shootObj = {
		id:null,
		photographers:[],
		journeyName :'',
		shootTime : '',
		periodType :'',
		remark :'',
		photographerNames :''}
		vm.shootInfos.push(shootObj)
	}
}, false);
//删除拍摄信息
mui('#app').on('tap', '.superscript-xx', function() {
	if(vm.forStatus == 'edit'){
		if(vm.shootInfos.length<=1){
			lf.nativeUI.toast('至少保留一组拍摄信息')
			return;
		}
		var index = this.getAttribute('data-index');
		vm.shootInfos.splice(index,1)
	}
}, false);
//选择摄影师
mui('#app').on('tap', '.fpsys', function() {
	if(vm.currentRoleId!==5){
		return
	}
	var index = this.getAttribute('data-index');
	if(vm.forStatus == 'edit'){
		lf.window.openWindow('designate/assign-staff.html', '../designate/assign-staff.html',{},{
	        //订单Id
	        orderId:vm.orderId,
	        //摄影师ID
	        passBack:vm.shootInfos[index].photographers
		})
	}
	var idx = 0
	var forgraphersId=[{idx:[]}]
	var forgraphersNames = [{idx:[]}]
	lf.event.listener('selectAssignUser',function(e){
		e.detail.userList.forEach(function(val){
			forgraphersId[idx].idx.push(val.id)
			forgraphersNames[idx].idx.push(val.name)
		})

		vm.shootInfos[index].photographers = forgraphersId[idx].idx
		vm.shootInfos[index].photographerNames = forgraphersNames[idx].idx
		idx ++
	})
}, false);


//修改
mui('.mui-bar-nav').on('tap', '.edit',function(){
	vm.forStatus = 'edit'
})
//保存
mui('.mui-bar-nav').on('tap', '.save',function(){
	vm.shootInfos.forEach(function(v,i){
		if(v.shootTime == ''){
			lf.nativeUI.toast('拍摄日期不能为空');
			return 
		}
	})
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
	lf.nativeUI.showWaiting()
	lf.net.getJSON('order/saveOrderTrackInfo', params, function(data) {
		lf.nativeUI.closeWaiting()
		if(data.code == 200) {
			lf.nativeUI.toast('保存成功');
			vm.forStatus = 'check'
		} else {
//			lf.nativeUI.toast(data.msg);
			lf.nativeUI.toast(data.code);
		}
	}, function(erro) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(erro.msg);
	});
})

lf.ready(function() {
//	vm.currentRole = window.Role.userrole;
	if(window.Role.currentPositions.length>0){
			vm.currentRoleId = window.Role.currentPositions[0].roleId;
			console.log("当前用户的角色id"+vm.currentRoleId)
	}
	renderTrackInfo();
})

//读取页面信息
function renderTrackInfo(){
	vm.orderNo = lf.window.currentWebview().orderNo;
	vm.forindex = lf.window.currentWebview().type;
	vm.forStatus = lf.window.currentWebview().status;
	console.log('orderNo111-=='+vm.orderNo)
	var params = {
		orderNo: vm.orderNo
	};
	lf.nativeUI.showWaiting()
	lf.net.getJSON('order/getOrderTrackInfo', params, function(data) {
		lf.nativeUI.closeWaiting()
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
			if(data.data.lineSight && data.data.lineSight.length>0){
				vm.shootInfos = []
			}
			data.data.lineSight.forEach(function(v){
				v.shootTime = lf.util.timeStampToDate2(v.shootTime)
				var forLine = {
					id : v.id,
					journeyName :v.journeyName,
					shootTime : v.shootTime,
					periodType :v.periodType,
					remark :v.remark,
				}
				var forGrapherName = []
				var forGrapherId = []
				v.photographers.forEach(function(value){
					forGrapherId.push(value.id+'')
					forGrapherName.push(value.name)
				})
				forLine.photographers = forGrapherId
				forLine.photographerNames = forGrapherName
				vm.shootInfos.push(forLine)
			})
		} else {
			lf.nativeUI.toast(data.msg);
		}
	}, function(erro) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(erro.msg);
	});
}

lf.event.listener('orderdetails',function(e){
	console.log('e.detail==='+e.detail)
	renderTrackInfo();
	lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {
		orderNo : orderNo
	})
})
