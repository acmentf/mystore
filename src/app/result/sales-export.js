var vm = new Vue({
	el: '#app',
	data: {
		id: '',
		userId: '',
		orderId: '',
		uploaderFiles: [],
		giveOrderXms: [],
		saleOrderXms: [{
			fType: '',
			id: '',
			orderId: '',
			picNum: '',
			picSize: '',
			picSizeName: '',
			// 产品类型
			remark: ''
		}],
		saleDate: '',
		salesAmt: '',
		advanceAmount: '',
		payableAmount: '',
		buyers: '',
		total: '',
		saleHandleData:[],
		salesTypeEmun:[],
		sizesEmun:[]
	},
	computed: {
		saleRemoveIconShow() {
			return this.saleOrderXms.length > 1;
		}
	},
	methods: {
		computedTotal:function() {
			var _total = Number(this.salesAmt) + Number(this.advanceAmount) + Number(this.payableAmount)
			this.total = _total.toFixed(2)
		},
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
		}
	},
	mounted: function () {
		this.$nextTick(function () {
			mui.previewImage()
		});
		
	}
})
var userPicker,picker;
let sizesEmun = [
		
	];
//获取销售类型数据
function getSalesTypeEmun (){
	vm.saleHandleData.forEach(e=>{
		vm.salesTypeEmun.push({
			value: e.type,
			text: e.type,
			id: e.id
		})
	})
}

lf.ready(function(){
	userPicker = new mui.PopPicker();
	var wv = lf.window.currentWebview()
	vm.orderId = wv.orderId
	loadResult()
	vm.userId = wv.userId
	//console.log(JSON.stringify(lf.window.currentWebview()))
    getUpdateData();
})
//赠送张数尺寸
mui('.mui-content').on('tap', '.gives-size', function() {
	var index = this.getAttribute('data-index');
	let currentItem = {...vm.giveOrderXms[index]};
	userPicker.setData(sizesEmun);
	userPicker.show(function(selectedItem) {
		currentItem.picSize = selectedItem[0].value;
		currentItem.picSizeName = selectedItem[0].text;
		Vue.set(vm.giveOrderXms,index,currentItem)
	});
})

// 选择赠送类型
mui('.mui-content').on('tap', '.gives-type', function() {
	let index = this.getAttribute('data-index');
	let currentItem = {...vm.giveOrderXms[index]};
	userPicker.setData(salesTypeEmun);
	userPicker.show(function(selectedItem) {
		currentItem.remark = selectedItem[0].value;
		Vue.set(vm.giveOrderXms,index,currentItem)
	})
});
//选择销售尺寸
mui('.mui-content').on('tap', '.sales-size', function() {
	vm.sizesEmun = [];
	var index = this.getAttribute('data-index');
	let currentItem = {...vm.saleOrderXms[index]};
	if (!vm.sizesEmun.length) {
		vm.saleHandleData.forEach(e=>{
			if (e.type === currentItem.remarkName) {
				e.sizeData.forEach(i=>{
					vm.sizesEmun.push({
						value:i.id,
						text:i.size,
						unitPrice:i.unitPrice
					})
				})
			}
		})
	}
	userPicker.setData(vm.sizesEmun);
	userPicker.show(function(selectedItem) {
		currentItem.picSize = selectedItem[0].value;
		currentItem.picSizeName = selectedItem[0].text;
		currentItem.unitPrice = selectedItem[0].unitPrice;
		//对应价格
		Vue.set(vm.saleOrderXms,index,currentItem)
		
	});
	
});
// 选择销售类型
mui('.mui-content').on('tap', '.sales-type', function() {
	let index = this.getAttribute('data-index');
	let currentItem = {...vm.saleOrderXms[index]};
	userPicker.setData(vm.salesTypeEmun);
	userPicker.show(function(selectedItem) {
		console.log(selectedItem);
		currentItem.remark = selectedItem[0].id;
		currentItem.remarkName = selectedItem[0].value;
		currentItem.picSizeName = '';
		currentItem.picNum = '';
		Vue.set(vm.saleOrderXms,index,currentItem);
		console.log('saleOrderXms',vm.saleOrderXms);
		//currentItem.picSizeName = selectedItem[0].text;
		vm.sizesEmun = [];
	})
});
mui('.sales-export').on('tap','.remove',function (e) {
	var index = +e.target.getAttribute('index')
	vm.remove(index)
})
mui('.mui-content').on('tap', '.add-givesNum', function() { //添加赠送张数
	vm.giveOrderXms.push({
		fType: 2,
		id: '',
		orderId: '',
		picNum: '',
		picSize: '',
		picSizeName: '',
		remark: ''
	})
})
mui('.mui-content').on('tap', '.add-salesNum', function() { //添加销售张数
	vm.saleOrderXms.push({
		fType: 3,
		id: '',
		orderId: '',
		picNum: '',
		picSize: '',
		picSizeName: '',
		remark: ''
	})
});

mui('.mui-content').on('tap', '.remove-salesNum', function(){
	var index = this.getAttribute('data-index');
	vm.saleOrderXms.splice(index,1)
})
mui('.mui-content').on('tap', '.remove-givesNum', function(){
	var index = this.getAttribute('data-index');
	vm.giveOrderXms.splice(index,1)
})
mui('.mui-content').on('tap', '.saleDate', function () { //选择销售日期
	var inputs = document.getElementsByTagName("input")
	for(var i=0;i<inputs.length;i++){
		inputs[i].blur();
	}
	var opts = { "type": "datetime" };
	picker = new mui.DtPicker(opts);
	picker.setSelectedValue(vm.saleDate)
	picker.show(function (select) {
		vm.saleDate = select.value
	})
})
mui('.mui-bar').on('tap', '.save-btn', function(){
	if(!vm.saleDate){
		lf.nativeUI.toast('请选择销售时间')
		return;
	}
	var reg = /^[0-9]\d*$/
	console.log('vm.saleOrderXms',vm.saleOrderXms);
	for (let i = 0; i < vm.saleOrderXms.length; i++) {
		let item = vm.saleOrderXms[i];
		if(!item.remark) {
			lf.nativeUI.toast('请选择销售物');
			return;
		}
		if(!item.picSize) {
			lf.nativeUI.toast('请选择规格');
			return;
		}
		if(!reg.test(item.picNum)){
			lf.nativeUI.toast('请输入正确的销售张数');
			return;
		}
	}

	for (let i = 0; i < vm.giveOrderXms.length; i++) {
		let item = vm.giveOrderXms[i];
		if(!item.remark) {
			lf.nativeUI.toast('请选择赠送类型');
			return;
		}
		if(!item.picSize) {
			lf.nativeUI.toast('请选择赠送尺寸');
			return;
		}
		if(!reg.test(item.picNum)) {
			lf.nativeUI.toast('请输入正确的赠送张数');
			return;
		}
	}

	// 通过 saleOrderXmsCopy 去重校验 vm.saleOrderXms 是否选择了相同销售类型与销售尺寸;
	let saleOrderXmsCopy = vm.saleOrderXms.map((item) => {
		return `remark:${item.remark},picSize:${item.picSize},picSizeName:${item.picSizeName}`;
	});
	let tempSaleOrderXms = [];
	for(let i = 0; i < saleOrderXmsCopy.length; i ++) {
		if(tempSaleOrderXms.indexOf(saleOrderXmsCopy[i]) == -1) {
			tempSaleOrderXms.push(saleOrderXmsCopy[i]);
		} else {
			lf.nativeUI.toast('请勿选择相同的销售类型与销售尺寸');
			return;
		}
	}

	// 通过 giveOrderXmsCopy 去重校验 vm.giveOrderXms 是否选择了相同赠送类型与赠送尺寸;
	let giveOrderXmsCopy = vm.giveOrderXms.map((item) => {
		return `remark:${item.remark},picSize:${item.picSize},picSizeName:${item.picSizeName}`;
	});
	let tempGiveOrderXms = [];
	for(let i = 0; i < giveOrderXmsCopy.length; i ++) {
		if(tempGiveOrderXms.indexOf(giveOrderXmsCopy[i]) == -1) {
			tempGiveOrderXms.push(giveOrderXmsCopy[i]);
		} else {
			lf.nativeUI.toast('请勿选择相同的赠送类型与赠送尺寸');
			return;
		}
	}
	
	let orderXms = vm.saleOrderXms.concat(vm.giveOrderXms);
	console.log(orderXms)

	// 传参
	var params ={
		id: vm.id,
		userId: vm.userId,
		orderId: vm.orderId,
		salesAmt: vm.salesAmt,
		advanceAmount: vm.advanceAmount,
		payableAmount: vm.payableAmount,
		attachmentSaleUrl: vm.uploaderFiles,
		buyers: vm.buyers,
		orderXms: orderXms,
		flag: 2,
		saleDate:new Date(vm.saleDate.replace(/-/g, '/'))
	}
	lf.nativeUI.showWaiting()
	lf.net.getJSON('order/saveSalesOutput', params, function (res){
		lf.nativeUI.closeWaiting()
		if(res.code == 200){
			lf.nativeUI.toast('保存成功！');
			lf.event.fire(lf.window.currentWebview().opener(), 'orderdetails', {})
			lf.window.closeCurrentWebview();
		}else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
})
function timeStampToDate(timestamp) { //时间戳转换成正常日期格式
	function add0(m) {
		return m < 10 ? '0' + m : m
	}
	//timestamp是整数，否则要parseInt转换,不会出现少个0的情况
	var time = new Date(timestamp);
	var year = time.getFullYear();
	var month = time.getMonth() + 1;
	var date = time.getDate();
	var hours = time.getHours();
	var minutes = time.getMinutes();
	return year + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + ':' + add0(minutes);
}
function loadResult(){
	var params={
		orderId:vm.orderId
	}
	lf.net.getJSON('/order/getSalesOutput', params, function (res){
		console.log('res1',res.data.orderX.saleOrderXms)
		if(res.code == 200){
			if(res.data == null){
				return
			}else{
				if( !res.data.orderX.saleOrderXms ||(res.data.orderX.saleOrderXms&&res.data.orderX.saleOrderXms.length == 0)){
					vm.saleOrderXms = [{fType: 3,id: '',orderId: '',picNum: '',picSize: '',picSizeName: '', remark: ''}]
				}else{
					let saleOrderXms = [];
					res.data.orderX.saleOrderXms.forEach(e=>{
						saleOrderXms.push({
							fType: 3,
							id: e.id,
							orderId: e.orderId,
							picNum: e.picNum,
							picSize: e.picSize,
							picSizeName: e.sizeName,
							remark:e.remark,
							// 产品类型
							remarkName: e.typeName
						})
					})
					vm.saleOrderXms = saleOrderXms
				}
				if(!res.data.orderX.giveOrderXms||(res.data.orderX.giveOrderXms&&res.data.orderX.giveOrderXms.length == 0)){
					// vm.giveOrderXms = [{fType: '2',id: '',orderId: '',picNum: '',picSize: '',picSizeName: '', remark: ''}]
					vm.giveOrderXms = [];
				}else{
					vm.giveOrderXms = res.data.orderX.giveOrderXms
				}
				if (res.data.attachmentSaleUrl) {
					vm.uploaderFiles = JSON.parse(res.data.attachmentSaleUrl)
					console.log(vm.uploaderFiles)
				}
				vm.id = res.data.orderX.id
				vm.buyers = res.data.orderX.buyers
				vm.salesAmt = res.data.orderX.salesAmt
				vm.advanceAmount = res.data.orderX.advanceAmount
				vm.payableAmount = res.data.orderX.payableAmount
				if(res.data.orderX.saleDate){
					vm.saleDate = timeStampToDate(res.data.orderX.saleDate)
				}
				vm.total = (vm.salesAmt + vm.advanceAmount + vm.payableAmount).toFixed(2)
	
			}
		}else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
}
//price/queryTypeSizePrice
//获取销售类型和尺寸
function getUpdateData(){
	lf.net.getJSON('/price/queryTypeSizePrice', {"flag":0 }, function (res){
		if(res.code == 200){
			let data = res.data.type
			console.log('res',res.data.type)
			//获取销售类型
			vm.saleHandleData = data;
			getSalesTypeEmun();
			
		}else {
			lf.nativeUI.toast(res.msg);
		}
	}, function(res) {
		lf.nativeUI.closeWaiting()
		lf.nativeUI.toast(res.msg)
	})
}
