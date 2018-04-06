//将13位毫秒数转换成标准时间
export const ctime = (nowtime) => {
    let oDate = new Date(nowtime),
      oYear = oDate.getFullYear(),
      oMonth = oDate.getMonth() + 1,
      oDay = oDate.getDate(),
      oHour = oDate.getHours(),
      oMin = oDate.getMinutes(),
      oSen = oDate.getSeconds(),
      oTime = oYear + '-' + oMonth + '-' + oDay + ' ' + oHour+ ':' + oMin + ':' + oSen;//最后拼接时间
    return oTime;
  }
  export const format  = (timeStamp,fmt)=>{
    let data = new Date(timeStamp)
    let o = {
      "M+" : data.getMonth()+1,                 //月份
      "d+" : data.getDate(),                    //日
      "h+" : data.getHours(),                   //小时
      "m+" : data.getMinutes(),                 //分
      "s+" : data.getSeconds(),                 //秒
      "q+" : Math.floor((data.getMonth()+3)/3), //季度
      "S"  : data.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (data.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(let k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt;
  }