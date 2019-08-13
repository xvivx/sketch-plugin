module.exports = function (config) {  
  var ruleJs = config.module.rules.find(rule => rule.use.loader === 'babel-loader');
  
  ruleJs.use.options.plugins = ruleJs.plugins || [];
  ruleJs.use.options.plugins.push('@babel/plugin-proposal-class-properties');
  
  config.devtool = 'cheap-module-source-map';
  
  // config.module.rules.push({
  //   test: /\.(html)$/,
  //   use: [{
  //       loader: "@skpm/extract-loader",
  //     },
  //     {
  //       loader: "html-loader",
  //       options: {
  //         attrs: [
  //           'img:src',
  //           'link:href'
  //         ],
  //         interpolate: true,
  //       },
  //     },
  //   ]
  // })
  // config.module.rules.push({
  //   test: /\.(css)$/,
  //   use: [{
  //       loader: "@skpm/extract-loader",
  //     },
  //     {
  //       loader: "css-loader",
  //     },
  //   ]
  // })
}
