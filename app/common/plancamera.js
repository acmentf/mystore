var vm = new Vue({
	el: '#app',
	data: {
		orderId: '',
		lineSight: [
//		{
//				id:1,
//				journeyName:'场景名称1',
//				photographer:[
//				],
//				photographerName:[
//				]
//			},
//			{
//				id:2,
//				journeyName:'场景名称2',
//				photographer:[
//				],
//				photographerName:[]
//			}
		],
	},
	computed: {
	}
})
lf.ready(function() {
	initPull();
	var wv = lf.window.currentWebview();
	vm.orderId = wv.orderNo;
	var params = {
		orderId: vm.orderId
	}
	lf.nativeUI.showWaiting()
	lf.net.getJSON('/order/getJourneyPhotographer',params,function (res) {
		lf.nativeUI.closeWaiting();
		if(res.code == 200) {
			if(res.data&&res.data.length > 0){
				var rs = dodata(res.data);
				vm.lineSight = rs;	
			}else{
				lf.nativeUI.toast('暂无拍摄地点，请先录入拍摄信息',{duration:'long'})
			}
		}else{
			lf.nativeUI.toast(res.msg)
		}
    },function(res){
    	lf.nativeUI.closeWaiting();
    	lf.nativeUI.toast(res.msg)
    })
})

function dodata(data){
	var rs = [];
	var photographer = null;
	var photographerName = null;
	var obj = null;
	for(var i in data){
		obj = new Object();
		obj.id  = data[i].id;
		obj.journeyName  = data[i].journeyName;
		
		if(data[i].photographers&&data[i].photographers.length > 0){
			photographer = new Array();
			photographerName = new Array();
			for(var j in data[i].photographers){
				photographer.push(data[i].photographers[j].id)
				photographerName.push(data[i].photographers[j].name)
			}
			obj.photographer = photographer;
			obj.photographerName = photographerName;
		}else{
			obj.photographer = [];
			obj.photographerName = [];
		}
		rs.push(obj);
	}
	return rs;
}
mui('.plancamera-content').on('tap','.mui-icon-extra-addpeople',function(){
	var i = this.getAttribute('data-index')
	lf.window.openWindow('chooseuser','chooseuser.html',{},{
		type: 2,
		index: i,
		list: vm.lineSight[i].photographer
	})
})
document.getElementById('saveBtn').addEventListener('tap',function(){
	var lineSightDTOS = [];
	var obj = null;
	vm.lineSight.forEach(function(v){
		obj = new Object()
		obj.id = v.id
		obj.photographerIdStr = v.photographer
		obj.photographer = v.photographerName.join(',')
		lineSightDTOS.push(obj)
	})
	var params = {
		orderId: vm.orderId,
		lineSightDTOS: lineSightDTOS
	}
	lf.nativeUI.showWaiting()
	lf.net.getJSON('/order/assignOrderPhotographer',params,function (res) {
		lf.nativeUI.closeWaiting();
		if(res.code == 200) {
			lf.event.fire(lf.window.currentWebview().opener(),'orderdetails');
			lf.window.closeCurrentWebview();
		}else{
			lf.nativeUI.toast(res.msg)
		}
    },function(res){
    	lf.nativeUI.closeWaiting();
    	lf.nativeUI.toast(res.msg)
    })
})
lf.event.listener('addPhotographer',function(e){
	var list = e.detail.list;
	var index = e.detail.index;
	var temp = null;
	vm.lineSight[index].photographer = [];
	vm.lineSight[index].photographerName = [];
	list.forEach(function(v){
		temp = v.split('-')
		vm.lineSight[index].photographer.push(Number(temp[0]))
		vm.lineSight[index].photographerName.push(temp[1])
	})
})
//			mui.init();
//阻尼系数
function initPull() {
	var deceleration = mui.os.ios ? 0.003 : 0.0009;
	mui('.mui-scroll-wrapper').scroll({
		bounce: false,
		indicators: true, //是否显示滚动条
		deceleration: deceleration
	});
	mui.ready(function() {
		//循环初始化所有下拉刷新，上拉加载。
		mui.each(document.querySelectorAll('.mui-slider .mui-scroll'), function(index, pullRefreshEl) {
			mui(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							vm.msgList = [{
									title: 'title1',
									desc: '1',
									time: '08:08',
									url: '../images/shuijiao.jpg'
								},
								{
									title: 'title2',
									desc: '2',
									time: '08:08',
									url: '../images/shuijiao.jpg'
								}
							]
							self.endPullDownToRefresh();
						}, 1000);
					}
				},
				up: {
					callback: function() {
						var self = this;
						setTimeout(function() {
							vm.msgList.push({
								title: 'title3',
								desc: '3',
								time: '08:08',
								url: '../images/shuijiao.jpg'
							})
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
	});
}