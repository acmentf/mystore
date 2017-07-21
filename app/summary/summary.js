
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
            }
        })
    }
    mui.plusReady(function(){
        var currentWebview = plus.webview.currentWebview();
        setPageParams(currentWebview)
    });
    window.addEventListener('customEvent',function(event){
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
                var task = plus.uploader.createUpload( '/file/uploadFile', { method:'POST'}, function ( res, status ) {
                    lf.nativeUI.closeWaiting()
                    if ( status === 200 ) {
                        if (res.code === '200') {
                            self.uploaderFiles.push({
                                fileSize: res.data.fileSize,
                                fileName: res.data.fileName,
                                fileUrl: res.data.fileUrl
                            })
                        } else {
                            mui.toast(res.msg)
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
                    var file = {size:10240}
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
                    filter:'image',
                    multiple:true
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
                      //跳转页面
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
    }).on('tap','.finger-uploader__input-box',function (e) {
        var index = +e.target.getAttribute('index')
        vm.remove(index)
    }).on('tap','.submit',function (e) {
        vm.save()
    })
})
