var vm = new Vue({
	el: '#app',
	data: {
		msgList: [{
				title: 'title1',
				desc: '1',
				time: '08:08',
				url: '../../images/shuijiao.jpg'
			},
			{
				title: 'title2',
				desc: '2',
				time: '08:08',
				url: '../../images/shuijiao.jpg'
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