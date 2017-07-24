var vm = new Vue({
	el: '#app',
	data: {
		orderList: [
			[],
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

mui('.order-ul').on('tap', '.qdbtn', function() {
	var id = this.getAttribute('data-id')
	//确认，取消
	lf.nativeUI.confirm("", "你确认要执行订单",  ["确定","取消"] ,function(e){
 		console.log( (e.index==0)?"Yes!":"No!" );
 		if(e.index == 0){
 			
 		}
  	});
})
mui('.order-ul').on('tap', '.qxbtn', function() {
	var id = this.getAttribute('data-id')
	//确认，取消
	lf.nativeUI.confirm("", "你确认要取消订单",  ["确定","取消"] ,function(e){
 		console.log( (e.index==0)?"Yes!":"No!" );
 		if(e.index == 0){
 			
 		}
  	});
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
							if(res.code == 200) {
								self.endPullUpToRefresh(vm.pageNos[index] >= res.data.totalPages);
								dodata('up', index, res.data.result)
							}else{
								self.endPullUpToRefresh();
								vm.pageNos[index]--;
								lf.nativeUI.toast(res.msg)
							}
		                },function(res){
		                	vm.pageNos[index]--;
		                	self.endPullUpToRefresh();
		                	lf.nativeUI.toast(res.msg)
		                })
					}
				}
			});
		});
	});
}