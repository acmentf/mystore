var vm = new Vue({
	el: '#app',
	data: {
		orderList: [
			[{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170722115554627470bc174c063d0f.png","id":242,"orderNo":"10100000001729","productId":101,"productName":"长沙三日游","purchaser":"途忆旅拍","status":1,"totalPrice":20000,"tourGuide":"1","tourId":242,"tourNo":"1"},{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170722115554627470bc174c063d0f.png","id":241,"orderNo":"10100000001728","productId":101,"productName":"长沙三日游","purchaser":"王巍巍测试旅行社","status":7,"totalPrice":20000,"tourGuide":"姓名","tourId":241,"tourNo":"123456"},{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170721175644598b0797964b0ad86c.png","id":238,"orderNo":"10100000001725","productId":99,"productName":"桂林的产品1","purchaser":"钱多多旅行社","status":1,"totalPrice":10000,"tourGuide":"小熊","tourId":238,"tourNo":"TY2017070602"},{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170721175644598b0797964b0ad86c.png","id":239,"orderNo":"10100000001726","productId":99,"productName":"桂林的产品1","purchaser":"钱多多旅行社","status":6,"totalPrice":15000,"tourGuide":"小威","tourId":239,"tourNo":"TY2017070603"},{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170721175644598b0797964b0ad86c.png","id":240,"orderNo":"10100000001727","productId":99,"productName":"桂林的产品1","purchaser":"钱多多旅行社","status":1,"totalPrice":5000,"tourGuide":"小威","tourId":240,"tourNo":"TY2017070604"},{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170721175644598b0797964b0ad86c.png","id":235,"orderNo":"10100000001721","productId":99,"productName":"桂林的产品1","purchaser":"钱多多旅行社","status":2,"totalPrice":10000,"tourGuide":"小熊","tourId":235,"tourNo":"TY2017070602"},{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170721175644598b0797964b0ad86c.png","id":237,"orderNo":"10100000001723","productId":99,"productName":"桂林的产品1","purchaser":"钱多多旅行社","status":1,"totalPrice":5000,"tourGuide":"小威","tourId":237,"tourNo":"TY2017070604"},{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170721175644598b0797964b0ad86c.png","id":236,"orderNo":"10100000001722","productId":99,"productName":"桂林的产品1","purchaser":"钱多多旅行社","status":1,"totalPrice":15000,"tourGuide":"小威","tourId":236,"tourNo":"TY2017070603"},{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170719112001966152fa82db2abeb7.png","id":234,"orderNo":"10100000001717","productId":82,"productName":"权限测试专用产品","purchaser":"钱多多旅行社","status":4,"totalPrice":50000,"tourGuide":"小熊","tourId":234,"tourNo":"TY2017070602"},{"covecoverImage":"http://img.test.fingercrm.cn/shoot_product_publicity_20170719112001966152fa82db2abeb7.png","id":233,"orderNo":"10100000001713","productId":82,"productName":"权限测试专用产品","purchaser":"钱多多旅行社","status":3,"totalPrice":50000,"tourGuide":"小熊","tourId":233,"tourNo":"TY2017070602"}],
			[],
			[],
			[],
			[]
		],
		pageNos:[
			
		],
		pageNum: 10
	}
})
lf.ready(function() {
	return 
	initPull();
	var status = lf.window.currentWebview().status;
	var gallery = mui('.mui-slider');
	switch (status){
		case '1':
			gallery.slider().gotoItem(1,0);
			break;
		case '2':
			gallery.slider().gotoItem(2,0);
			break;
		case '3':
			gallery.slider().gotoItem(4,0);
			break;
		case '4':
			gallery.slider().gotoItem(3,0);
			break;
		default:
			break;
	}
})
document.getElementById('searchDiv').addEventListener('tap',function(){
	lf.window.openWindow('ordersearch.html', 'ordersearch.html')
})

mui('.order-ul').on('tap', '.nr', function() {
	var id = this.getAttribute('data-id');
	lf.window.openWindow('orderdetails.html', 'orderdetails.html', {}, {
		orderNo: id
	})
})

mui('.order-ul').on('tap', '.gzxx', function() {
	var id = this.getAttribute('data-id');
	lf.window.openWindow('trackinfo.html', 'trackinfo.html', {}, {
		orderNo: id
	})
})
mui('.order-ul').on('tap', '.zxxx', function() {
	var id = this.getAttribute('data-id');
	lf.window.openWindow('order-entering/result.html', '../order-entering/result.html', {}, {
		orderNo: id
	})
})
//			mui.init();
function dodata(type, index, data) {
	if(type == 'up') {
		Vue.set(vm.orderList, index, vm.orderList[index].concat(data))
	} else {
		Vue.set(vm.orderList, index, data)
	}
}
function getType(index){
	var r = "";
	switch (index){
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
	return r;
}
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
			vm.pageNos[index] = 0;
			mui(pullRefreshEl).pullToRefresh({
				down: {
					callback: function() {
						var self = this;
						vm.pageNos[index] = 1;
						var params = {
							status:getType(index),
							currPage:vm.pageNos[index],
							pageSize:vm.pageNum
						};
						lf.net.getJSON('/order/search',params,function (res) {
							self.endPullDownToRefresh();
							if(res.code == 200) {
								self.refresh(true);
								dodata('down', index, res.data.result)
							}else{
								vm.pageNos[index]--;
								lf.nativeUI.toast(res.msg)
							}
		                },function(res){
		                	vm.pageNos[index]--;
		                	self.endPullDownToRefresh();
		                	lf.nativeUI.toast(res.msg)
		                })
					}
				},
				up: {
					auto: true,
					callback: function() {
						var self = this;
						vm.pageNos[index]++;
						var params = {
							status:getType(index),
							currPage:vm.pageNos[index],
							pageSize:vm.pageNum
						};
						lf.net.getJSON('/order/search',params,function (res) {
							self.endPullUpToRefresh(vm.pageNos[index] >= res.data.totalPages);
							if(res.code == 200) {
								dodata('up', index, res.data.result)
							}else{
								vm.pageNos[index]--;
								lf.nativeUI.toast(res.msg)
							}
		                },function(res){
		                	vm.pageNos[index]--;
		                	self.endPullUpToRefresh(vm.pageNos[index] >= res.data.totalPages);
		                	lf.nativeUI.toast(res.msg)
		                })
					}
				}
			});
		});
	});
}