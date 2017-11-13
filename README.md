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
> http://localhost:8080/app


### 构建

| 命令              | 说明           |
| --------------- | ------------ |
| `npm run dev`   | 开发环境构建，不压缩代码 |
| `npm run build` | 生产环境构建，压缩代码  |




## 目录

```
├── dist                     # 构建后的目录
├── config                   # 项目配置文件
│   ├── webpack.config.js    # webpack 配置文件
├── src                      # 程序源文件
│   └── js                   # 页面js入口
│   ├   └── index.js         # 匹配 app/index.html
│   ├   └── user
│   ├   ├    ├── index.js    # 匹配 app/user/index.html
│   └── app                  # 页面入口
│   ├    └── index.html       # 对应 js/index.js
│   ├    └── user
│   ├        ├── index.html   # 对应 js/user/index.js
│   └── component             # 组件
│   ├    └── other
│   └── template              # html 模板目录
│       └── head.html
│       └── foot.html
```