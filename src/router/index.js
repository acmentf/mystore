import Vue from 'vue'
import Router from 'vue-router'
import Util from '../util'
import views from '@/views'
import search from './search'
import persondata from './persondata'
import register from './register'
import setting from './setting'
import gk from './gk'
import errand from './errand'
import selfinfo from './selfinfo'
import convenience from "./convenience"
import collection from './collection'
import me from './me'
import aboutcmp from "./aboutcmp";
import home from './home'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/404',
      name: 'noPage',
      component: views.noPage,
      meta:{
        title:'404'
      },
    },
    {
      path: '/',
      name: 'menu',
      component: views.Home.Menu,
      meta:{
        title:'首页'
      },
    },...errand,...me,...search,...persondata,...register,...setting,...gk,...selfinfo,...convenience,
    ...collection,...aboutcmp,...home
  ]
})

router.beforeEach((to, from, next) => {
  // console.log('indexRouter to==>',to)
  //拦截404
  if(!to.name){
    next({path:'/404'})
  }
  next();
})

let arr = [1,2,3];
arr[arr.length] = JSON.parse(JSON.stringify(arr[0]))

router.beforeEach((to, from, next) => {
  //设置title
  if(to.meta.title){
    Util.home.setTitle(to.meta.title)
  }else{
    Util.home.setTitle(to.name)
  }
  next();
})


export default router;

