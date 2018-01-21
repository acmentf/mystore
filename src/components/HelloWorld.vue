<template>
  <div class="hello">
    <img src="@/assets/bg_1.png" alt="" width="360" class="bg_1">
    <div class="content">
      <img src="@/assets/logo.png" alt="" >
      <p class="title"><span></span>&nbsp;&nbsp;&nbsp;科技让生活更简单&nbsp;&nbsp;&nbsp;<span></span></p>
      <div class="form-box">
        <div class="form-content">
          <p class="form-title">
            <span>欢迎登陆</span>孚石酒店供应链平台
          </p>
          <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          size="large"
          clearable
          >
         </el-input>
          <el-input
          placeholder="请输入密码"
          prefix-icon="el-icon-search"
          size="large"
          clearable
          type="password"
          class="password"
          >
          </el-input>
          <div class="footer">
            <span class="remeber">记住密码</span>
            <span class="forget">忘记密码</span>
          </div>
           <el-button type="primary" @click="login">登陆</el-button>
        </div>
      </div>
       <img src="@/assets/bg_2.png" alt="" width="109%" class="bg_2">
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    login(){
      this.$router.push({path:'/upload'})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  lang="less">
  *{
    padding:0;
    margin:0;
  }
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  .hello{
    position: absolute;
    width:100%;
    height:100%;
  }
  .bg_1{
    position: absolute;
    top:0;
    left:0;
    width: 100%;
  }
  .content{
    position: relative;
    z-index: 111;
    width:606px;
    text-align: center;
    margin:0 auto;
    padding-top:158px;
    
    .title{
      font-size:24px;
      color:#fff;
      padding:50px 100px 0 100px;
      display: flex;
      &>span{
        flex:1;
        margin-top:12px;
        border-top:1px solid #fff;
      }
    }
    img{
      margin:0 auto;
    }
    .form-box{
      position: relative;
      z-index: 1111;
      width:606px;
      height:432px;
      margin:0 auto;
      background: #fff;
      margin-top:88px;
      border-radius: 5px;
      text-align: center;
      box-sizing: border-box;
      .form-content{
        width:360px;
        margin:0 auto;
        .form-title{
          height:114px;
          line-height: 114px;
          font-size:24px;
          &>span{
            font-size:34px;
            color:#45a2ff;
            font-weight: bold;
          }
      }
        .el-input__inner{
          height:50px;
          font-size:18px;
        }
        .password{
          margin-top:30px;
        }
        .footer{
          height:80px;
          line-height:80px;
          color:#737373;
          .remeber{
            float:left;
          }
          .forget{
            float:right;
          }
        }
        .el-button--primary{
          height:50px;
          font-size:24px;
          width:100%;
        }
      }
    }
    .bg_2{
        position: absolute;
        bottom:-3px;
        left:-27px;
      }
  }
  .logo{
    margin:0 auto;
  }
</style>
