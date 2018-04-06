import axios from 'axios';
let apiUrl = ''
if (process.env.NODE_ENV == 'development') {
    apiUrl = '/api';
} else  if (process.env.NODE_ENV == 'production') {
    apiUrl = '***';
}
let axiosIns = axios.create({
    baseURL: apiUrl,
    timeout: 5000,
    contentType: 'application/json',
});

//http request 拦截器
axiosIns.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')  //获取缓存中的token
    if(token){
      config.params = {'token':token}
    }
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type':'application/json'
    }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);
//http response 拦截器
axiosIns.interceptors.response.use(
  response => {
    if(response.data.errCode ==2){
      router.push({
        path:"/login",
        querry:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
      })
    }
    return response;
  },
  error => {
    return Promise.reject(error)
  }
)

export default axiosIns;

