var vm = new Vue({
	el: '#trackinfo',
	data: {
		"0": [{
				"createTime": 1502380800000,
				"creator": 1,
				"id": 1,
				"logSource": 1,
				"orderId": 1,
				"orderNo": "1",
				"orderPreStatus": 0,
				"orderStatus": 0,
				"remark": "未完成"
			},
			{
				"createTime": 1502380800000,
				"creator": 1,
				"id": 2,
				"logSource": 1,
				"orderId": 1,
				"orderNo": "1",
				"orderPreStatus": 0,
				"orderStatus": 0,
				"remark": "未完成1"
			}
		],
		"1": [{
				"createTime": 1502380800000,
				"creator": 1,
				"id": 3,
				"logSource": 1,
				"orderId": 1,
				"orderNo": "1",
				"orderPreStatus": 0,
				"orderStatus": 1,
				"remark": "已完成计调1"
			},
			{
				"createTime": 1502380800000,
				"creator": 1,
				"id": 4,
				"logSource": 1,
				"orderId": 1,
				"orderNo": "1",
				"orderPreStatus": 1,
				"orderStatus": 1,
				"remark": "已完成计调2"
			}
		]
	}
})
var picker = null;
lf.ready(function() {
	vm.assignRole = window.Role.hasAuth('assign'); // 指派按钮的key

})