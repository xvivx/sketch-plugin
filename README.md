## Sketch插件开发小结

### 调试工具
#### 日志
[下载sketch-dev-tool](https://github.com/skpm/sketch-dev-tools/releases)

#### 断点调试
打开Safari，找到开发 --> 你的机器名 --> `Automatically Show Web Inspector for JSContexts`，并且打开同目录下的 `Automatically Pause Connecting to JSContext`，注意调脚本运行完成会自动销毁上下文，刷新应用会再次打开一个调试器，这不是一个bug。

### 开启审查webview
此功能类似Chrome里的审查元素功能，但是开启的审查器貌似是Safari，如何开启Chrome调试器还在研究。
```bash
defaults write com.bohemiancoding.sketch3 WebKitDeveloperExtras -bool true
```

### Sketch启动时重新加载脚本
Sketch默认会缓存其安装目录下Plugins文件夹里的文件，这不方便我们开发调试，禁用缓存可使用以下代码开启：
```bash
defaults write ~/Library/Preferences/com.bohemiancoding.sketch3.plist AlwaysReloadScript -bool YES
```


### 指定Sketch编辑插件的编辑器
以vscode为例:
```bash
defaults write ~/Library/Preferences/com.bohemiancoding.sketch3.plist "Plugin Editor" "/usr/local/bin/code"
```


### CocoaScript
CocoaScript建立在Apple的JavaScriptCore之上，这是与Safari相同的JavaScript引擎。CocoaScript还包含一个桥梁，可让您通过JavaScript访问Apple的Cocoa框架。这意味着除了标准JavaScript库之外，您还可以使用许多精彩的类和函数。


### 自定义配置

#### Babel

To customize Babel, you have two options:

- You may create a [`.babelrc`](https://babeljs.io/docs/usage/babelrc) file in your project's root directory. Any settings you define here will overwrite matching config-keys within skpm preset. For example, if you pass a "presets" object, it will replace & reset all Babel presets that skpm defaults to.

- If you'd like to modify or add to the existing Babel config, you must use a `webpack.skpm.config.js` file. Visit the [Webpack](#webpack) section for more info.

#### Webpack

To customize webpack create `webpack.skpm.config.js` file which exports function that will change webpack's config.

```js
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {boolean} isPluginCommand - whether the config is for a plugin command or a resource
 **/
module.exports = function(config, isPluginCommand) {
  /** you can change config here **/
};
```


sketch原生的对象里的函数只能return原生的东西，不能return js里的东西。