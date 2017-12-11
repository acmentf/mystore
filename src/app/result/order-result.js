var vm = new Vue({
	el: '#app',
	data: {
		userId:'',
		overTime: false,              //是否禁止点击
		id: '',                      //销售输出ID
	    orderId: '',                //订单ID
	    isOut: 1,                    //是否输出   1已输出   2未输出
	    saleRemark: '',        //备注
	    reason: '',   	//原因
	    noOutRemark: '',   // 为输出
		saleDate: '',      //销售时间
		serverPerNum: '', // 实际服务人数
	    buyers: '',                 //购买人数
		salesAmt: '',                //销售额
		selectsNum: '',				//选片张数
		shootNum: '',				//拍摄张数
		isAmend: false,     //修改弹窗
		amendReasons:'',   //修改原因
		amendPerNum:'',   //修改后服务人数
		fetchTime: "",  //预计服务时间
		serveInputDisabled: false,
		uploaderFiles: [],
	    printOrderXms: [             //打印张数
	        {
	        	fType: '1',
				id: '',
				orderId: '',
				picNum: '',
				picSize: '',
				picSizeName: '',
				price: ''           //1 打印 2赠送3销售
	        }
	    ]
	},
	methods: {
		// 点击修改
		remove: function (index) {
			this.uploaderFiles.splice(index, 1)
		},
		createImgUpload: function (path) {
			var self = this
			lf.nativeUI.showWaiting()
			var task = plus.uploader.createUpload(SERVER_BAS_URL +  '/file/uploadFile', { method:'POST'}, function ( res, status ) {
				lf.nativeUI.closeWaiting()
				if ( status === 200 ) {
					try{
						var response = JSON.parse(res.responseText)
						if (response.code === '200') {
							self.uploaderFiles.push({
								fileSize: response.data.fileSize,
								name: response.data.fileName,
								url: response.data.fileUrl
							})
						} else {
							mui.toast(response.msg)
						}
					}catch(e) {
						mui.toast('上传失败')
					}
				} else {
					mui.toast('上传失败')
				}
			});
			task.addFile( path, {key:'filename'} );
			task.start();
		},
		galleryImg: function () {
			var self = this
			plus.gallery.pick( function(path){
				plus.io.resolveLocalFileSystemURL( path, function( entry ) {
					entry.file( function(file){
						if (file.size / 1024 / 1024 > 10) {
							mui.toast('每张照片小于5')
							return false
						} else {
							self.createImgUpload(path)
						}
					} );
				}, function ( e ) {
					mui.toast( "Resolve file URL failed: " + e.message );
				} );
			}, function ( e ) {
			},{
				filter:'image'
			});
		},
		fileSelect: function () {
			if (this.uploaderFiles.length < 3) {
			//    this.galleryImg()
			this.selectPhoto()
			} else {
				mui.toast('最多可以上传3张照片')
			}
		},
		selectPhoto: function(e) {
			var files = e.target.files || e.dataTransfer.files
			if (!files.length) {
				return
			}
			var file = files[0]
			var filesize = file.size / (1024 * 1024)
			if (filesize > 10) {
				mui.toast('图片大小不能超过10M')
				return
			}
			var re = new RegExp('(jpg|png|jpeg)$')
			var filepath = e.target.value
			var filetype = filepath.substring(filepath.lastIndexOf('.') + 1).toLowerCase()

			if (!re.test(filetype.toLowerCase())) {
				mui.toast('请上传jpg,png格式照片')
				return
			}

			if (this.uploaderFiles.length >= 10) {
				mui.toast('最多可以上传10张照片')
				return
			}

			var params = {
				'file_name': 'filename',
				'file': file
			}
			lf.nativeUI.showWaiting()
			lf.net.upload('/file/uploadFile', params, (res) => {
				if (res.code == '200') {
					lf.nativeUI.closeWaiting()
					this.uploaderFiles.push({
						fileSize: res.data.fileSize,
						name: res.data.fileName,
						url: res.data.fileUrl
					})
				} else {
					lf.nativeUI.closeWaiting()
					mui.toast(res.msg)
				}
			}, (res) => {
				lf.nativeUI.closeWaiting()
				mui.toast(res.msg || '服务器异常')
			})
		},
	   amend:function(){
			if(!vm.isAmend){
			   vm.isAmend = !vm.isAmend;
			}
	   },
	   // 修改取消
	   cancelAmend:function(){
		   this.isAmend = !this.isAmend; 
		   this.amendReasons='';
		   this.amendPerNum='';
	   },
	   // 确认修改
	   confirmAmend:function(){
		  if(!this.amendPerNum){
			  mui.toast('请填写实际服务人数');
			  return
		  }else if(!this.amendReasons) {
			  mui.toast('请填写修改原因');
			  return
		  }else if(this.amendPerNum){
			  var importNum = this.amendPerNum;
			  var judgeNum = isNaN(importNum);
			  if(judgeNum){
				  mui.toast('实际服务人数请填写数字');
				  return
			  }
		  }
		   var params = {
				  serverPerNum: this.amendPerNum ,
				  serverPerNumBefore: this.serverPerNum,
				  remark: this.amendReasons,
				  orderId: this.orderId,
				  userId: this.userId
		   }
		   var isAmend = this.isAmend
		   var isDisabled = this.isDisabled
		  lf.nativeUI.showWaiting()
		  lf.net.getJSON('order/timeoutSave', params, function(res) {
				  lf.nativeUI.closeWaiting()
				  if(res.code == 200) {
					  lf.nativeUI.toast('修改成功');
					  vm.isAmend = false; 
					  vm.overTime = false;
					  vm.serverPerNum = vm.amendPerNum
				  } else {
					  lf.nativeUI.toast(res.msg);
				  }
		  }, function(res) {
				  lf.nativeUI.closeWaiting()
				  lf.nativeUI.toast(res.msg)
		  })           		
	   }
	},
	mounted: function () {
		this.$nextTick(function () {
			mui.previewImage()
		})
	}
})
var picker,userPicker,reasonPicker;
lf.ready(function(){
	vm.userId = window.Role.usercode
	var opts = {"type": "date"};
	picker = new mui.DtPicker(opts);
	userPicker = new mui.PopPicker();
	userPicker.setData([{
		value: '1',
		text: '16寸'
	}, {
		value: '2',
		text: '12寸'
	}, {
		value: '3',
		text: '10寸'
	}, {
		value: '4',
		text: '8寸'
	}, {
		value: '6',
		text: '7寸'
	}, {
		value: '5',
		text: '6寸'
	}]);
	reasonPicker = new mui.PopPicker();
	reasonPicker.setData(['天气原因','道路中断','旅行团未到指定地点','其他']);
	var wv = lf.window.currentWebview()
	vm.orderId = wv.orderId
	loadResult()
	console.log(JSON.stringify(lf.window.currentWebview()))
})
//尺寸选择器S
mui('.mui-content').on('tap', '.printsSize', function() {
	var index = this.getAttribute('data-index');
	userPicker.show(function(items) {
		Vue.set(vm.printOrderXms,index,{
			fType:'1',
			picNum: vm.printOrderXms[index].picNum,
			picSize: items[0].value,
			picSizeName: items[0].text
		})
	});
})
//时间选择器
mui('.mui-content').on('tap', '.selectDate', function(){
	picker.show(function(items) {
		vm.saleDate = items.value
	});
})
//原因选择
mui('.mui-content').on('tap','.select-reason',function(){
	reasonPicker.show(function(items) {
		vm.reason = items[0]
	})
})
//尺寸选择器E
mui('.mui-content').on('tap', '.add-printsNum', function() { //添加打印张数
	vm.printOrderXms.push({
			id: '',
			fType: '1',
			orderId: '',
			picNum: '',
			picSize: '',
			picSizeName: '',
			price: ''})
})
//移除S
mui('.mui-content').on('tap', '.remove-printsNum', function(){
	var index = this.getAttribute('data-index');
	vm.printOrderXms.splice(index,1)
})
//移除E
mui('.rusult').on('tap','.remove',function (e) {
	var index = +e.target.getAttribute('index')
	vm.remove(index)
})
//保存S

mui('.order-result').on('tap', '.save-btn', function(){
	var params,flag;
	if(vm.isOut==1){
		flag = true
//		if(vm.shootNum==''){
//			lf.nativeUI.toast('请输入拍摄张数')
//			flag = false
//			return
//		}
//		if(vm.selectsNum==''){
//			lf.nativeUI.toast('请输入选片张数')
//			flag = false
//			return
//		}
//		if(vm.printOrderXms[0].picSize ==''){
//			lf.nativeUI.toast('请填写打印的尺寸及张数')
//			flag = false
//			return
//		}
		if(!vm.serverPerNum){
			lf.nativeUI.toast('请填写实际服务人数')
			flag = false
			return
		}
		vm.printOrderXms.forEach(function(v){
			if(!v.picSize){
				lf.nativeUI.toast('请选择打印尺寸')
				flag = false;
				return
			}
			if(!v.picNum){
				lf.nativeUI.toast('请输入打印数张数')
				flag = false
				return
			}
		})
		var orderX = []
		for (var i = 0;i<vm.printOrderXms.length; i++){
			if(vm.printOrderXms[i].fType == 1){
				orderX[orderX.length] = vm.printOrderXms[i].picSize
			}
			console.log(orderX)
		}
		for(var i=0;i<orderX.length;i++){
			for(var j = i+1;j<orderX.length;j++){
				if(orderX[i]==orderX[j]){
					lf.nativeUI.toast('请勿输入相同照片尺寸')
					flag =false
					return
				}
			}
		}
		params = {
			userId:vm.userId,
			id: vm.id,
			orderId:vm.orderId,
			isOut: vm.isOut,
			orderXms:vm.printOrderXms,
			selectsNum: vm.selectsNum,			
			shootNum: vm.shootNum,
			saleRemark:vm.saleRemark,
			serverPerNum: vm.serverPerNum,
			attachmentOutputUrl: vm.uploaderFiles,
			flag: 1
		}
		
	}else{
		flag = true
		if(!vm.reason||(vm.reason&&vm.reason.length == 0)){
			lf.nativeUI.toast('请选择原因');
			return
		}
		if(vm.reason == '其他'&&vm.noOutRemark==""){
			lf.nativeUI.toast('请在备注中填写其他原因');
			return
		}
		if(vm.reason == '其他'){
			vm.reason = vm.noOutRemark
			return
		}
		params = {
			id: vm.id,
			userId:vm.userId,
			orderId:vm.orderId,
			isOut: vm.isOut,
			noOutReason:vm.reason,
			flag: 1
		}
	}
	if(flag){
		lf.nativeUI.showWaiting()
		lf.net.getJSON('order/saveShotOutput', params, function(res) {
			lf.nativeUI.closeWaiting()
			if(res.code == 200) {
				lf.nativeUI.toast(vm.$t('save_success'));
				lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
				lf.window.closeCurrentWebview();
			} else {
				lf.nativeUI.toast(res.msg);
			}
		}, function(res) {
			lf.nativeUI.closeWaiting()
			lf.nativeUI.toast(res.msg)
		})
	}
})
function loadResult(){
	var params={
		orderId:vm.orderId
	}
	lf.net.getJSON('/order/getShotOutput', params, function (res){
		if(res.code == 200){
			console.log(JSON.stringify(res.data.orderX))
			console.log(JSON.stringify(res.data.order))
			if(res.data.orderX == null){
				return
			}else{
				if(!res.data.orderX.printOrderXms || (res.data.orderX.printOrderXms&&res.data.orderX.printOrderXms.length == 0)){
					vm.printOrderXms = [{fType: '',id: '',orderId: '',picNum: '',picSize: '',picSizeName: '',price: ''}]
				}else{
					vm.printOrderXms = res.data.orderX.printOrderXms
				}
				if (res.data.attachmentOutputUrl) {
					vm.uploaderFiles = JSON.parse(res.data.attachmentOutputUrl)
				}
				vm.selectsNum = res.data.orderX.selectsNum
				vm.shootNum = res.data.orderX.shootNum
				vm.serverPerNum = res.data.orderX.serverPerNum
				vm.id = res.data.orderX.id
				vm.reason = res.data.orderX.noOutReason
				vm.saleRemark = res.data.orderX.saleRemark
				vm.isOut = res.data.orderX.isOut == null ? 1 : res.data.orderX.isOut 
			}
			if(res.data.order == null){
				return	
			}else{
				// 判断是否超时
				if (res.data.isTimeover == 2 || res.data.order.status == 7) {
					vm.overTime = true
					vm.serveInputDisabled = true
				}
			}
		}else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
}




