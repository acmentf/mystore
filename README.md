#旅拍APP
>旅拍APP2.0改版

测试环境：<http://>  

uat 环境：<http://>  

正式环境：<http://>  


## 使用

### 安装

```
npm install
```

### 开发

```
npm start
```

### 构建

| 命令              | 说明           |
| --------------- | ------------ |
| `npm run dev`   | 启动开发环境 |
| `npm run build` | 生产环境构建，压缩代码  |




## 目录

```
├── dist                     # 构建后的目录
├── config                   # 项目配置文件
│   ├── webpack.config.js    # webpack 配置文件
├── src                      # 程序源文件
│   └── app                  # 页面入口
│   ├    └── index.html       # 对应 js/index.js
│   ├    └── other
│   ├        ├── index.html   # 对应 js/other/index.js html文件名和js文件名需相同
│   └── component             # 组件
│   ├    └── public           # 公共组件
│   ├    └── other           # 对应 app/other 的页面组件
│   └── js                   # 公共js目录
│   └── template              # html 公共模板目录
```