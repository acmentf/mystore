var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		showAnswer:false,//是否显示搜索结果
		seachTest :'',//搜索关键字
//		orderList: [{
//				orderNo: 'dd1',//订单编号
//				status: '5',//订单状态
//				tourGuide: '导游1号',//导游姓名
//				tourNo: '1',//团号
//				productName产品: '桂林山水文化',
//				purchaser: '采购方1',//采购方
//				totalPrice: 1000 //订单金额
//			},
//			{
//				orderNo: 'dd2',//订单编号
//				status: '5',//订单状态
//				tourGuide: '导游2号',//导游姓名
//				tourNo: '2',//团号
//				productName产品: '桂林山水文化',
//				purchaser: '采购方2',//采购方
//				totalPrice: 2000 //订单金额
//			},
//			{
//				orderNo: 'dd3',//订单编号
//				status: '5',//订单状态
//				tourGuide: '导游3号',//导游姓名
//				tourNo: '3',//团号
//				productName产品: '桂林山水文化',
//				purchaser: '采购方3',//采购方
//				totalPrice: 3000 //订单金额
//			}
//		]
		orderList: []
	}
})
lf.ready(function() {

	//点击搜索按钮
	document.getElementById('searchBtn').addEventListener('tap',function(){
		console.log('search:'+ vm.searchText)
		vm.showAnswer = true;
		var params = {
			seachTest :vm.seachTest,
			currPage :1,
			pageSize : 10

		}
		console.log("params="+JSON.stringify(params))
		var url = 'baseUrl +/order/search';
		lf.net.getJSON(url,params,function(data){
			console.log("data="+JSON.stringify(data))
			console.log("url="+JSON.stringify(url))
			if(data.code == "200"){
			vm.orderList = data.result;
			}else{
				mui.alert(data.msg)
			}
		},function(error){
			mui.alert(error.msg, '错误');
		})
	})
})
//

