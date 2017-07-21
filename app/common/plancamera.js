var vm = new Vue({
	el: '#app',
	data: {
		lineSight: [{
				id:1,
				journeyName:'场景名称1',
				photographer:[
				],
				photographerName:[
				]
			},
			{
				id:2,
				journeyName:'场景名称2',
				photographer:[
				],
				photographerName:[]
			}
		],
	},
	computed: {
	}
})
lf.ready(function() {
	initPull();
})
mui('.plancamera-content').on('tap','.mui-icon-extra-addpeople',function(){
	var i = this.getAttribute('data-index')
	lf.window.openWindow('chooseuser','chooseuser.html',{},{
		type: 2,
		index: i,
		list: vm.lineSight[i].photographer
	})
})
document.getElementById('saveBtn').addEventListener('tap',function(){
	console.log('save')
})
lf.event.listener('addPhotographer',function(e){
	console.log(JSON.stringify(e.detail))
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