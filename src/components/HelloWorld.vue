<template>
    <div>
      {{msg}}
    </div>
</template>

<script>

import {test} from '../server/index'
//axios.defaults.baseURL = 'http://127.0.0.1:3001/'
export default {
  name: 'HelloWorld',
  data () {
    return {
      msg: ''
    }
  },
  created(){
    test().then(res=>{
      this.msg = res.str
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>
