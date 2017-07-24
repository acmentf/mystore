var vm = new Vue({
	el: '#app',
	data: {
		index:null,
		type:0,
		searchText: '',
		orderId:'',
		personList: [
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
	vm.orderId = wv.orderNo;
	
	if(vm.type == 1){
		document.getElementById('header-title').innerHTML = '执行人'	
		findZXR();
	}else{
		vm.pickList = wv.list
		document.getElementById('header-title').innerHTML = '摄影师'
		findSYS();
	}
	if(wv.index){
		vm.index = wv.index;	
	}
})

function findZXR(){
	var params = {
		name: vm.searchText
	}
	lf.nativeUI.showWaiting();
	lf.net.getJSON('/order/getAllExecutor',params,function (res) {
		lf.nativeUI.closeWaiting();
		if(res.code == 200) {
			vm.personList = res.data;
		}else{
			lf.nativeUI.toast(res.msg)
		}
    },function(res){
    	lf.nativeUI.closeWaiting();
    	lf.nativeUI.toast(res.msg)
    })
}
function findSYS(){
	var params = {
		name: vm.searchText
	}
	lf.nativeUI.showWaiting();
	lf.net.getJSON('/order/getAllPhotographer',params,function (res) {
		lf.nativeUI.closeWaiting();
		if(res.code == 200) {
			vm.personList = res.data;
		}else{
			lf.nativeUI.toast(res.msg)
		}
    },function(res){
    	lf.nativeUI.closeWaiting();
    	lf.nativeUI.toast(res.msg)
    })
}

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
	}else{// 执行人
		var params = {
			orderId: vm.orderId,
			assignId: vm.pick
		}
        lf.nativeUI.showWaiting();
		lf.net.getJSON('/order/assignOrderExecutor',params,function (res) {
			lf.nativeUI.closeWaiting();
			if(res.code == 200) {
				lf.event.fire(lf.window.currentWebview().opener(),'orderdetails')
				lf.window.closeCurrentWebview();
			}else{
				lf.nativeUI.toast(res.msg)
			}
        },function(res){
        	lf.nativeUI.closeWaiting();
        	lf.nativeUI.toast(res.msg)
        })
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