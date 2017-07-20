var vm = null

lf.ready(function () {
    var mask = mui.createMask();
    vm = new Vue({
        el: '#app',
        data: function () {
            return {
                uploaderInputFlag: true,
                uploaderFiles: [],
                remark: ''
            }
        },
        methods: {
            resetUploaderInput: function () {
                this.uploaderInputFlag = false
                this.$nextTick(function () {
                    this.uploaderInputFlag = true
                })
            },
            fileSelect: function () {
                if (this.uploaderFiles.length < 3) {
                    var fileElem = this.$refs.uploaderInputWrap.querySelector('input')
                    fileElem && fileElem.click()
                } else {
                    mui.toast('最多可以上传3张照片')
                }
            },
            uploaderInput: function (evt) {
                var self = this
                var files = evt.target.files
                this.resetUploaderInput()
                if (files.length === 0) {
                    return false
                }
                Array.prototype.forEach.call(files, function (file) {
                    if (file.size / 1024 / 1024 > 5) {
                        mui.toast('每张照片小于5')
                        return false
                    } else {
                        mask.show()
                        lf.net.upload('/file/uploadFile', {
                            file_name: 'filename',
                            file: file
                        }, function (res) {
                            mask.close()
                            if (res.code === '200') {
                                file.info = {
                                    fileSize: res.data.fileSize,
                                    fileName: res.data.fileName,
                                    fileUrl: res.data.fileUrl
                                }
                                self.uploaderFiles.push(file)
                            } else {
                                mui.toast(res.msg)
                            }
                        }, function (res) {
                            mask.close()
                            mui.toast('上传失败')
                        })
                    }
                })
            },
            remove: function (index) {
                this.uploaderFiles.splice(index, 1)
            },
            save: function () {
                var self = this
                var params = this.$route.params
                if (this.uploaderFiles.length === 0) {
                    mui.toast('照片至少传一张')
                    return false
                } else if (this.remark === '') {
                    mui.toast('拍摄总结不能为空')
                    return false
                }
                mask.show()
                lf.net.getJSON('order/saveOrderPhotographer', {
                    tourId: params.tourId,
                    orderId: params.orderId,
                    photographerId: params.photographerId,
                    imgs: this.uploaderFiles.map(function (item) {
                        return item.info.fileName
                    }),
                    summay: this.remark
                }, function (data) {
                    mask.close()
                    if (data.code === '200') {
                        self.$router.go(-1)
                    } else {
                        mui.toast(data.msg)
                    }
                }, function () {
                    mask.close()
                    mui.toast('服务器出错')
                })
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                mui.previewImage()
            })
        }
    });
})
