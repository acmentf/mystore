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
})

document.getElementById('searchBtn').addEventListener('tap',function(){
	console.log('search')
})
//			mui.init();
