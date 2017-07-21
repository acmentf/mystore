var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		showAnswer:false,//是否显示搜索结果
		orderList: [{
				orderNo: 'dd1',//订单编号
				status: '5',//订单状态
				tourGuide: '导游1号',//导游姓名
				tourNo: '1',//团号
				productName产品: '桂林山水文化',
				purchaser: '采购方1',//采购方
				totalPrice: 1000 //订单金额
			},
			{
				orderNo: 'dd2',//订单编号
				status: '5',//订单状态
				tourGuide: '导游2号',//导游姓名
				tourNo: '2',//团号
				productName产品: '桂林山水文化',
				purchaser: '采购方2',//采购方
				totalPrice: 2000 //订单金额
			},
			{
				orderNo: 'dd3',//订单编号
				status: '5',//订单状态
				tourGuide: '导游3号',//导游姓名
				tourNo: '3',//团号
				productName产品: '桂林山水文化',
				purchaser: '采购方3',//采购方
				totalPrice: 3000 //订单金额
			}
		]
	}
})
lf.ready(function() {
//	mui('.searchicon').on('tap',function(){
//		console.log(111)
//		vm.showAnswer = true;
//	})
	document.getElementById('searchBtn').addEventListener('tap',function(){
		console.log('search:'+ vm.searchText)
		vm.showAnswer = true;
	})
})
//

