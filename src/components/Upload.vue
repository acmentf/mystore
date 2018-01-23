<template>
   <div class="hello">
    <div class="hanldBox">
        <el-button @click="allDelete" type="primary" v-if="!toggleTag">批量刪除</el-button>
        <el-button @click="deleteSure" type="danger"  v-if="toggleTag">確定</el-button>
         <el-button @click="deleteCancel"  v-if="toggleTag">取消</el-button>
    </div>
    <div class="upload">
      <div class="upload_warp">
        <div class="upload_warp_left" @click="fileClick">
          <img src="@/assets/upload.png">
        </div>
        <div class="upload_warp_img" v-show="imgList.length!=0">
          <div class="upload_warp_img_div" v-for="(item,index) of imgList" :key="index">
            <div class="imgbox"  @click="_selected($event,item)">
                <img :src="item.file.src" class="images-file" @click="handlePictureCardPreview(item.file.src)">
                <img src="@/assets/del.png" class="upload_warp_img_div_del" @click="fileDel(index)"  v-if="isPreview" >
                <i class="el-icon-success select-icon" v-if="!isPreview"></i>
            </div>
            <p class="text">{{item.file.name}}</p>
          </div>
        </div>
      </div>
      <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none">
      <el-dialog :visible.sync="dialogVisible" width="40%">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    props:{
      // 允许上传文件类型
      fileType: {
        type: Array,
        default(){
          return  ['jpg','jpeg','png']
        }
      },
      // 最大允许上传个数
      fileCounts: {
        type: Number,
        default: 10,
        validator: function (value) {
          return value >= 1
        }
      },
      // 上传文件大小最大值(单位kb)
      fileM: {
        type: Number,
        required: true,
        validator: function (value) {
          return value > 0
        }
      },
    },
    data() {
      return {
         imgList: [{'file':{"name":'1111',"src":'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}}],
         size: 0,
         dialogVisible: false,
         dialogImageUrl: '',
         isPreview: true, // 是否能预览大图 默认为可以
         toggleTag: false,//批量删除按钮切换标识
         deleteArray: [] //批量删除图片下标数组

      };
    },
    created(){
      this.init()
    },
    methods: {
      // 还原状态
      backState(){
        let Obj = document.getElementsByClassName('imgbox');
        for (let i of Obj) {
          i.setAttribute("class","imgbox"); 
        }
      },
      // 确认批量删除
      deleteSure(){
        //遍历
        this.deleteArray.forEach(item=>{
            this.imgList.forEach((e,i) =>{
              if (item == e) {
                this.imgList.splice(i,1);
              }
            })
        })
        this.isPreview = true;
        this.toggleTag = false;
        this.backState();
      },
      // 取消批量删除
      deleteCancel(){
        this.deleteArray = [];
        this.isPreview = true;
        this.toggleTag = false;
        this.backState();
      },
      allDelete() {
        this.deleteArray = []
        this.isPreview = false; 
        this.toggleTag = true;
      },
      handlePictureCardPreview(file) {
          if (this.isPreview) {
            this.dialogImageUrl = file;
            this.dialogVisible = true;
          }else{
            this.dialogImageUrl = '';
            this.dialogVisible = false;
          }
      },
      _selected(event,item){
        //this.deleteArray = [];
        if (this.isPreview) return false;
        let isClass = event.currentTarget.classList.contains("selected");
          if (!isClass) {
            event.currentTarget.classList.add('selected');
            this.deleteArray.push(item);
          }else{
            event.currentTarget.classList.remove('selected');
            if (this.deleteArray.length){
              this.deleteArray.forEach((e,i)=>{
                if (e == item ) {
                   this.deleteArray.splice(i,1);
                }
              })
            }
        }
        console.log(this.deleteArray);
      },
      fileClick(){
        document.getElementById('upload_file').click()
      },
      fileChange(el){
        if (!el.target.files[0].size) return;
        this.fileList(el.target.files);
        el.target.value = ''
      },
      //判断数组中是否存在某个值
      init(){
        Array.prototype.in_array = function (element) {  
      　　for (var i = 0; i < this.length; i++) {  
        　　if (this[i] == element) {  
        　　  return true;  
            }  
          }
          return false;  
        }  
      },
      fileList(files){
        for (let i = 0; i < files.length; i++) {
           // 判断文件类型
           let Index = files[i].type.indexOf('/')
           console.log(files[i].type.substring(Index+1))
         　if (!this.fileType.in_array(files[i].type.substring(Index+1))) {
            this.$message({
              message: `${files[i].name}格式错误`,
              type: 'error'
            });
            continue
          }
          // 验证文件大小
          console.log(files[i].size)
          if (files[i].size > parseInt(this.fileM)*1024) {
           this.$message({
              message: `${files[i].name}已经大于${this.fileM}kb`,
              type: 'error'
            });
           continue
          }
          this.fileAdd(files[i]);
        }
      },
      fileAdd(file){
        this.size = this.size + file.size;//总大小
        let reader = new FileReader();
        reader.vue = this;
        reader.readAsDataURL(file);
        reader.onload = function () {
          file.src = this.result;
          console.log(this.vue.imgList.length);
          console.log('this.fileCounts',this.vue.fileCounts)
          if ( this.vue.imgList.length >= this.vue.fileCounts) {
            return false
          }
          this.vue.imgList.push({
            file
          });
        }
      },
      fileDel(index){
        this.size = this.size - this.imgList[index].file.size;//总大小
        this.imgList.splice(index, 1);
      },
      bytesToSize(bytes){
        if (bytes === 0) return '0 B';
        let k = 1000, // or 1024
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
      }
    }
  }
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less">
  .hello{
      padding:15px;
      .hanldBox{
        text-align: right;
      }
      .upload_warp_img_div_del {
        position: absolute;
        top: 6px;
        width: 16px;
        right: 4px;
      }

    .upload_warp_img_div_top {
      position: absolute;
      top: 0;
      height: 30px;
      background-color: rgba(0, 0, 0, 0.4);
      line-height: 30px;
      text-align: left;
      color: #fff;
      font-size: 12px;
      text-indent: 4px;
    }

    .upload_warp_img_div_text {
      white-space: nowrap;
      width: 80%;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .upload_warp_img_div img.images-file{
      width:100%;
      vertical-align: middle;
    }
    .upload_warp_img_div {
      position: relative;
      height: auto;
      width: 194px;
      float: left;
      display: table-cell;
      text-align: center;
      cursor: pointer;
      margin:0 10px 10px 0;
      .imgbox{
        width:100%;
        height:135px;
        overflow: hidden;
        border: 1px solid #ccc;
        border-radius: 6px;
        position: relative;
        .select-icon{
          position: absolute;
          left:5px;
          top:5px;
          font-size:20px;
          opacity: 0.8;
          color:#fff;
        }
        &.selected{
          .select-icon {
             color:#e4393c;
             opacity: 1;
          }
        }
      }
      .text{
        line-height: 20px;
      }
    }

    .upload_warp_img {
      padding-left:10px;
      overflow: hidden
    }

    .upload_warp_text {
      text-align: left;
      margin-bottom: 10px;
      padding-top: 10px;
      text-indent: 14px;
      border-top: 1px solid #ccc;
      font-size: 14px;
    }

    .upload_warp_right {
      float: left;
      width: 57%;
      margin-left: 2%;
      height: 100%;
      border: 1px dashed #999;
      border-radius: 4px;
      line-height: 130px;
      color: #999;
    }

    .upload_warp_left img {
      margin-top: 32px;
    }

    .upload_warp_left {
      float: left;
      width: 194px;
      height: 135px;
      border: 1px dashed #999;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  

</style>
