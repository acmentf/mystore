var vm = new Vue({
	el: '#app',
	data: {
		searchText: '',
		msgList: [{
				title: 'title1',
				descption: '消息内容1',//消息内容
				createdTime: '08:08',//消息创建时间
//				url: '../../images/shuijiao.jpg',
				type: 1,//消息类型,
				status:1 //1已读，0未读
			},
			{
				title: 'title1',
				descption: '消息内容1',//消息内容
				createdTime: '08:08',//消息创建时间
//				url: '../../images/shuijiao.jpg',
				type: 2,//消息类型
				status:0 //1已读，0未读
			},
			{
				title: 'title1',
				descption: '消息内容1',//消息内容
				createdTime: '08:08',//消息创建时间
//				url: '../../images/shuijiao.jpg',
				type: 1,//消息类型,
				status:1 //1已读，0未读
			}

		]
	},
	computed: {
	}
})
lf.ready(function() {
	initPull();
})

document.getElementById('searchBtn').addEventListener('tap',function(){
	console.log('search')
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
									descption: '消息内容1',//消息内容
									createdTime: '08:08',//消息创建时间
					//				url: '../../images/shuijiao.jpg',
									type: 1,//消息类型,
									status:1 //1已读，0未读
								},
								{
									title: 'title1',
									descption: '消息内容1',//消息内容
									createdTime: '08:08',//消息创建时间
					//				url: '../../images/shuijiao.jpg',
									type: 1,//消息类型,
									status:1 //1已读，0未读
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
								descption: '消息内容1',//消息内容
								createdTime: '08:08',//消息创建时间
				//				url: '../../images/shuijiao.jpg',
								type: 2,//消息类型,
								status:1 //1已读，0未读
							})
							self.endPullUpToRefresh();
						}, 1000);
					}
				}
			});
		});
	});
}