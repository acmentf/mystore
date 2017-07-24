
lf.ready(function () {
    var pageParams = {
        tourId: '',
        orderId: '',
        photographerId: ''
    }
    function setPageParams(params) {
        mui.each(pageParams,function (key) {
            if(key in params){
                pageParams[key] = params[key]||''
                console.log('pageParams '+key+':'+params[key])
            }
        })
    }
    mui.plusReady(function(){
        var currentWebview = lf.window.currentWebview();
        setPageParams(currentWebview)
    });
    window.addEventListener('pageParams',function(event){
        setPageParams(event)
    });

   var vm = new Vue({
        el: '#app',
        data: function () {
            return {
                uploaderFiles: [],
                remark: ''
            }
        },
        methods: {
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
                                    fileName: response.data.fileName,
                                    fileUrl: response.data.fileUrl
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
                            if (file.size / 1024 / 1024 > 5) {
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
                    console.log( '取消选择图片' );
                },{
                    filter:'image'
                });
            },
            fileSelect: function () {
                if (this.uploaderFiles.length < 3) {
                   this.galleryImg()
                } else {
                    mui.toast('最多可以上传3张照片')
                }
            },
            remove: function (index) {
                this.uploaderFiles.splice(index, 1)
            },
            save: function () {
                var self = this
                if (this.uploaderFiles.length === 0) {
                    mui.toast('照片至少传一张')
                    return false
                } else if (this.remark === '') {
                    mui.toast('拍摄总结不能为空')
                    return false
                }
                lf.nativeUI.showWaiting()
                lf.net.getJSON('/order/saveOrderPhotographer', {
                    tourId: pageParams.tourId,
                    orderId: pageParams.orderId,
                    photographerId: pageParams.photographerId,
                    imgs: this.uploaderFiles.map(function (item) {
                        return item.fileName
                    }),
                    summay: this.remark
                }, function (res) {
                    lf.nativeUI.closeWaiting()
                    if (res.code === '200') {
                        mui.toast('录入成功')
                      //跳转页面
                        lf.window.openWindow('summary/details.html','details.html',{},{
                            orderId: pageParams.orderId,
                            photographerId: pageParams.photographerId
                        })
                    } else {
                        mui.toast(res.msg)
                    }
                }, function (res) {
                    lf.nativeUI.closeWaiting()
                    mui.toast(res.msg)
                })
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                mui.previewImage()
            })
        }
    });
    mui('.summary-summary').on('tap','.finger-uploader__input-box',function () {
        vm.fileSelect()
    }).on('tap','.remove',function (e) {
        var index = +e.target.getAttribute('index')
        console.log(index)
        vm.remove(index)
    }).on('tap','.btn-submit',function (e) {
        vm.save()
    })
})
