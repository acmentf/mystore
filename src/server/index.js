import { fetch } from './baseApi'

export const test = () => fetch('/users');
//参数处理函数
const reqParms = (params)=>{
    let qs = '?';
    for(let index in params){
      qs += `${index}=${params[index]}&`
    }
    return qs;
};