/*
 * 使用dll技术，对某些三方库进行单独打包
 * */
const { resolve } = require('path');
const webpack = require('webpack');
module.exports = {
  mode: 'production',
  entry: {
    jquery: ['jquery'],
  },
  output: {
    filename: '[name].dll.js',
    path: resolve(__dirname, 'dll'),
    library: '[name]_[hash:8]',//打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包生成一个manifest.json-->提供和jquery映射
    new webpack.DllPlugin({
      name: '[name]_[hash:8]',//映射库的暴露内容名称
      path: resolve(__dirname, 'dll','manifest.json'),//输出文件路径
    }),
  ],
};
