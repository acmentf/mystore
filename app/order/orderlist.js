var vm = new Vue({
	el: '#app',
	data: {
		orderList: [{
				orderNo: 'dd1',//订单编号
				status: '1',//订单状态 1：待确认 2：已确认 3：已取消 4：已指派 5：已录入 6：已分配 7：已完成
				tourGuide: '导游1号',//导游姓名
				tourNo: '1',//团号
				productName产品: '桂林山水文化',
				purchaser: '采购方1',//采购方
				totalPrice: 1000 //订单金额
			},
			{
				orderNo: 'dd2',//订单编号
				status: '3',//订单状态
				tourGuide: '导游1号',//导游姓名
				tourNo: '1',//团号
				productName产品: '桂林山水文化',
				purchaser: '采购方1',//采购方
				totalPrice: 1000 //订单金额
			},
			{
				orderNo: 'dd3',//订单编号
				status: '5',//订单状态
				tourGuide: '导游1号',//导游姓名
				tourNo: '1',//团号
				productName产品: '桂林山水文化',
				purchaser: '采购方1',//采购方
				totalPrice: 1000 //订单金额
			}
		]
	}
})
lf.ready(function() {
	initPull();
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
							vm.orderList = [
								{
									orderNo: 'dd1',//订单编号
									status: '3',//订单状态
									tourGuide: '导游1号',//导游姓名
									tourNo: '1',//团号
									productName产品: '桂林山水文化',
									purchaser: '采购方1',//采购方
									totalPrice: 1000 //订单金额
								},
								{
									orderNo: 'dd1',//订单编号
									status: '1',//订单状态
									tourGuide: '导游1号',//导游姓名
									tourNo: '1',//团号
									productName产品: '桂林山水文化',
									purchaser: '采购方1',//采购方
									totalPrice: 1000 //订单金额
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
							vm.orderList.push(
								{
									orderNo: 'dd1',//订单编号
									status: '5',//订单状态
									tourGuide: '导游1号',//导游姓名
									tourNo: '1',//团号
									productName产品: '桂林山水文化',
									purchaser: '采购方1',//采购方
									totalPrice: 1000 //订单金额
								}
							)
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
	});
}