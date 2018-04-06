//往 localStorage 里面存对象
export const setLocalStorage = (name, value) => {
    if (value) {
      let data = JSON.stringify(value);
      localStorage.setItem(name, data);
      return true
    }
    return false
  };
  
  //从 localStorage 取数据
  export const getLocalStorage = (name) => {
    if (name) {
      let data = localStorage.getItem(name);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    }
    return null;
  };
  
  
  //往 sessionStorage 里面存对象
  export const setSessionStorage = (name, value) => {
    if (value) {
      let data = JSON.stringify(value);
      sessionStorage.setItem(name, data);
      return true
    }
    return false
  };
  
  //从 sessionStorage 取数据
  export const getSessionStorage = (name) => {
    if (name) {
      let data = sessionStorage.getItem(name);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    }
    return null;
  };