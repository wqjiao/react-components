# react-componts

## componts

```
    Modal  对话框

    Update 图片上传 base64转码

    Editor 

    ModalPic

    AntdSelect

    ...
```

## 安装下载

```
    $ git clone https://github.com/wqjiao/react-componts.git
    $ npm install
    $ npm run start
    $ npm run build
```

## 目录结构

```
* src
    |-- assets
    |-- components
    |-- pages
    |-- index.js
    |-- index.less
    |-- registerServiceWorker.js
```

## 技术选择

```
    <!-- UI 库 -->
    antd // 按需加载

    <!-- 状态管理 -->
    redux
    react-redux
    redux-logger
    redux-thunk

    <!-- 路由 -->
    react-router-dom

    <!-- 样式管理工具 -->
    less
    less-loader
    postcss-loader

    <!-- 接口请求 -->
    axios

    <!-- Mock 数据 -->
    Mock 数据 || EasyMock 接口

    <!-- 打包工具 -->
    webpack

    <!-- 代码分析工具 -->
    webpack-bundle-analyzer

    <!-- 统一代码规范 -->
    eslint
    eslint-loader
    
```

## 判断获取终端信息
<!-- 安装 -->
npm install current-device
<!-- device 属性 -->
device.type	'mobile', 'tablet', 'desktop', or 'unknown'
device.orientation	'landscape', 'portrait', or 'unknown'
device.os	'ios', 'iphone', 'ipad', 'ipod', 'android', 'blackberry', 'windows', 'macos', 'fxos', 'meego', 'television', or 'unknown'
```js
device.mobile(); // 手机
device.tablet(); // 平板
device.desktop(); // 电脑
```

## 图形编辑器

```
npm install --save gg-editor
```

## 参考网址

[ant design](https://ant.design/index-cn)
[Juejin Post](https://juejin.im/post/5ba5ab61e51d450e9162c4ae)
[GGEditor](https://github.com/gaoli/GGEditor/blob/master/README.zh-CN.md)


## 问题

* TuiImageEditor 运行报错时
    `npm install --no-save --no-optional fabric@~1.6.7`