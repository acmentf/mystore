var vm = new Vue({
	el: '#app',
	data: {
		currentRoleId:'',
		forindex: 0,
		orderNo:null,
		forStatus:'check',//check是查看，edit是直接能编辑的
		orderId:null,
		operatorHeader: ['团信息', '行程信息', '拍摄信息'],
		journeyList: [], // 拍摄景点多选列表
		journeyListed: [], // 已选择拍摄景点列表
		currentJourneyIndex: '', // 当前选择的景点
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
			preProps:'',//前置属性,
			prePropsValue: ''
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
		lineName: ''
	},
	methods: {
		selectJourneyName: function(e, i, journeyName){
			e.preventDefault()
			e.stopPropagation()

			if(vm.forStatus == 'check') return

			if (vm.shootInfos[i].isConfirmShot == 1) return
			
			vm.currentJourneyIndex = i
			var _selectedList = journeyName.split(',')
			
			var params = {
				pageSize: 1000,
				currPage: 1,
				pageCount: 0,
				isShoot: 1,
				lineNameLike: vm.lineName
			} 

			lf.nativeUI.showWaiting()

			lf.net.getJSON('/sight/list', params, function(res) {
				lf.nativeUI.closeWaiting()

				if (res.code === '200') {
					document.querySelector('.select-journey-wrapper').style.display = 'block'
					document.getElementsByTagName("body")[0].setAttribute("style","overflow:hidden")
					
					res.data.data.forEach(function(item, index) {
						if (!item.sightName) return

						var isSelected = _selectedList.indexOf(item.sightName) != -1

						if (isSelected) {
							vm.journeyListed.push(item.sightName)
						}
						
						var obj = {
							text: item.sightName,
							selected: isSelected
						}
						vm.journeyList.push(obj)
					})

				} else {
					mui.alert(res.msg)
				}
			})
		},
		selectSingleJourney: function(name, index) {
			this.journeyListed.push(name)
			this.journeyList[index].selected = true

		},
		cancelSingleJourney: function(name, index) {
			var i = this.journeyListed.indexOf(name);
			if(i != -1) {
				this.journeyListed.splice(i, 1);
				this.journeyList[index].selected = false
			}

		},
		confirmSelectJourney: function() {
			document.querySelector('.select-journey-wrapper').style.display = 'none'
			document.getElementsByTagName("body")[0].setAttribute("style","")

			this.shootInfos[this.currentJourneyIndex].journeyName = this.journeyListed.toString()

			this.journeyListed = []
			this.journeyList = []
		}
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

//前置属性
mui('#app').on('tap', '#showPropsPicker', function() {
	if(vm.forStatus == 'edit'){
		var index = this.getAttribute('data-index');
		var userPicker = new mui.PopPicker();
		userPicker.setData([{
			value: 0,
			text: '非前置团'
		}, {
			value: 1,
			text: '前置团'
		}]);
		userPicker.show(function(items) {
			vm.groupInfo.preProps = items[0].text
			vm.groupInfo.prePropsValue = items[0].value
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
	var index = this.getAttribute('data-index');
	if (vm.shootInfos[index].isConfirmShot == 1) return
	if(vm.forStatus == 'edit'){
		var index = this.getAttribute('data-index');
		var optionsJson = this.getAttribute('data-options') || '{}';
		var options = JSON.parse(optionsJson);
		var picker = new mui.DtPicker(options);
		picker.show(function(rs) {
			function getNowDate() {
				var t = new Date()
				return t.getFullYear() + '/' + t.getMonth() + '/' + t.getDay()
			}
			
			// 无法拍摄状态下，不能选今天以前的日期
			var isChangeDate = new Date(rs.text.replace(/-/g, '/')) >= new Date(getNowDate())

			if (vm.shootInfos[index].isConfirmShot == 2) {
				if (isChangeDate) {
					vm.shootInfos[index].shootTime = rs.text
				} else {
					lf.nativeUI.toast('无法拍摄状态下，不能选今天以前的日期')
				}
			} else {
				vm.shootInfos[index].shootTime = rs.text
			}

			picker.dispose();
		});
	}
}, false);

//拍摄时段
mui('#app').on('tap', '.pssd', function() {
	var index = this.getAttribute('data-index');
	if (vm.shootInfos[index].isConfirmShot == 1) return
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
		shootState: '尚未拍摄',
		isConfirmShot: -1,
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
	var index = this.getAttribute('data-index');
	if (vm.shootInfos[index].isConfirmShot == 1) return
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
	var flag = false
	vm.shootInfos.forEach(function(v,i){
		if(!v.shootTime){
			lf.nativeUI.toast('拍摄日期不能为空');
			flag = true
		}
	})
	if (flag) return

	if(vm.marchInfo.preReservedSeats){
			if(!/^[0-9]*$/.test(vm.marchInfo.preReservedSeats)){
			lf.nativeUI.toast('预留座位数只能填写数字');
			flag = true
		}
	}

	if(!vm.marchInfo.fetchPhotoTime) {
		lf.nativeUI.toast('销售日期必填');
		return
	}

	if(vm.groupInfo.prePropsValue === null) {
		lf.nativeUI.toast('前置属性必填');
		return
	}

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
				tourGuidePhone : vm.groupInfo.tourGuidePhone,//导游电话
				isPreTour :vm.groupInfo.prePropsValue,//前置属性
				prePrice :vm.groupInfo.prePrice * 100,//前置金额
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
	console.log(JSON.stringify(params.order))
	lf.nativeUI.showWaiting()
	lf.net.getJSON('order/saveOrderTrackInfo', params, function(data) {
		lf.nativeUI.closeWaiting()
		if(data.code == 200) {
			lf.nativeUI.toast('保存成功');
			vm.forStatus = 'check'

			lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
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
	vm.lineName = lf.window.currentWebview().lineName
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
			console.log(JSON.stringify(data.data))

			if (data.data.isPreTour !== null) {
				var _pre = data.data.isPreTour == 0 ? '非前置团' : '前置团'
			} else {
				var _pre = ''
			}
			var _prePrice = ''
			if (data.data.prePrice) {
				_prePrice = (data.data.prePrice / 100).toFixed(2)
			} else {
				_prePrice = (data.data.unitPrice / 100).toFixed(2)
			}
			vm.orderId = data.data.orderId
			vm.groupInfo={
				areaName :data.data.areaName,//区域
				assignNames : data.data.assignNames,//导游姓名
				lineName :data.data.lineName,//线路名称
				groupType :data.data.groupType,//团性质
				personCount : data.data.personCount,//团人数
				preProps : _pre,//前置属性
				prePropsValue : data.data.isPreTour,//前置属性
				prePrice : _prePrice,//前置金额
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
			var getShootState = function (state) {
				if (state == 0) {
					return '尚未确认'
				} else if (state == 1) {
					return '确认拍摄'
				} else if (state == 2) {
					return '无法拍摄'
				}
			}
			data.data.lineSight.forEach(function(v){
				v.shootTime = lf.util.timeStampToDate2(v.shootTime)
				var forLine = {
					id : v.id,
					journeyName :v.journeyName,
					shootTime : v.shootTime,
					periodType :v.periodType,
					remark :v.remark,
					isConfirmShot :v.isConfirmShot
				}
				var forGrapherName = []
				var forGrapherId = []
				v.photographers.forEach(function(value){
					forGrapherId.push(value.id+'')
					forGrapherName.push(value.name)
				})
				forLine.photographers = forGrapherId
				forLine.photographerNames = forGrapherName
				forLine.shootState = getShootState(v.isConfirmShot)
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
