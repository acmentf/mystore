var vm = new Vue({
	el: '#app',
	data: {
		index:null,
		type:0,
		searchText: '',
		personList: [{
				id:1,
				name:'张三'
			},
			{
				id:2,
				name:'李四'
			}
		],
		photographer:[],// 已选人员
		pick:'',
		pickList:[]
	},
	computed: {
	}
})
lf.ready(function() {
	var wv = lf.window.currentWebview();
	initPull();
	vm.type = wv.type;
	console.log('list:'+JSON.stringify(wv.list))
	vm.pickList = wv.list
	
	if(vm.type == 1){
		document.getElementById('header-title').innerHTML = '执行人'	
	}else{
		document.getElementById('header-title').innerHTML = '摄影师'
	}
	if(wv.index){
		vm.index = wv.index;	
	}
})

document.getElementById('searchBtn').addEventListener('tap',function(){
	console.log('search')
})
document.getElementById('saveBtn').addEventListener('tap',function(){
	console.log(JSON.stringify(vm.pick))// 获取单选值
	
	console.log(JSON.stringify(list))
	if(vm.type == 2){
		console.log(JSON.stringify(vm.pickList))// 获取多选值
		var list = [];
		vm.pickList.forEach(function(v){
			console.log(v)
			for(var i in vm.personList){
				if(vm.personList[i].id == v){
					list.push(v+'-'+vm.personList[i].name);
					break
				}
			}
		})
		lf.event.fire(lf.window.currentWebview().opener(),'addPhotographer',{
			index: vm.index,
			list: list
		})
		lf.window.closeCurrentWebview();
	}
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
}