var vm = new Vue({
	el: '#app',
	data: {
		orderId: '',
		photoOutList: []
//		remark:''
	}
})
lf.ready(function(){
	vm.orderId = lf.window.currentWebview().orderNo;
	init();
})
mui('.mui-content').on('tap','#saveBtn',function(){
	var ifNum = true
	vm.photoOutList.forEach(function(val){
		var reg= /[^\d]/g;
		if(reg.test(val.shootNum)){
			lf.nativeUI.toast('拍摄张数请输入数字')
			ifNum = false
		}
	})
	if(ifNum){
		var params = {
			orderId:vm.orderId,
			mobileShotOutputVos :vm.photoOutList
		};
		lf.nativeUI.showWaiting()
		lf.net.getJSON('/order/saveShotOutput',params,function (data) {
			lf.nativeUI.closeWaiting()
			if(data.code == 200) {
				lf.nativeUI.toast('保存成功')
				lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
				lf.window.closeCurrentWebview();
			}else{
				lf.nativeUI.toast(data.msg)
			}
	    },function(res){
	    	lf.nativeUI.closeWaiting()
	    	lf.nativeUI.toast(res.msg)
	    })
	}

})

// 请求数据
function init(){
	var params = {
		"orderId":vm.orderId
	};
	lf.nativeUI.showWaiting()
	lf.net.getJSON('/order/getShotOutput',params,function (data) {
		lf.nativeUI.closeWaiting()
		if(data.code == 200) {
			data.data.forEach(function(val){
				var onePhoto = {
					id: val.id,
					journeyName: val.journeyName,
					shootNum: val.shootNum
				}
				vm.photoOutList.push(onePhoto)
			})
		}else{
			lf.nativeUI.toast(data.msg)
		}
    },function(res){
    	lf.nativeUI.closeWaiting()
    	lf.nativeUI.toast(res.msg)
    })
}


