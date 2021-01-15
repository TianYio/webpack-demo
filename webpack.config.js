const { resolve } = require('path');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require(
  'optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

process.env.NODE_ENV = 'production';
/*
 * 缓存：
 * 1、babel缓存 --> 让第二次打包构建速度更快
 *  cacheDirectory：true
 * 2、资源文件缓存：--> 让代码上线运行缓存更好使用
 * hash：webpack每次构建时会生成一个唯一的hash值。
 *   问题：因为js和css同时使用一个hash值，如果重新打包回导致所有的缓存失效。
 * chunkhash：根据chunk生成的hash。如果打包来源于同一个chunk，那么hash值一样。
 *   问题：js和css的hash还是一样的，因为css是在js中被引入的，所以同属于一个chunk
 * contenthash：根据文件的内容生成hash值，不同文件hash值一定不同。
 * */
/*
 * tree shaking --> 去除程序中没有使用的代码，使项目体积更小
 * 前提：1、必须使用ES6模块化；2、开启production环境
 * 在package.js中配置
 * 1、"sideEffects":false//所以代码都没有副作用，都可以进行tree shaking，--> 坑你会把 css、@babel/polyfill 文件干掉
 * 2、"sideEffects":["*.css"]//设置不进行tree shaking 的文件
 * */
/*
 * 懒加载 和 预加载
 * 懒加载 import(/webpackChunkName:'name'/)
 * 预加载 import(/webpackChunkName:'name',webpackPrefetch:true/)，慎用在移动端和一些老版本浏览器上有兼容性问题
 * */
/*
 * Dll
 *
 * */
module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,//提取js中的css成单独文件
          'css-loader',
          {
            loader: 'postcss-loader',// css兼容处理
            options: {
              postcssOptions: {
                ident: 'postcss',
                plugins: [
                  [
                    'postcss-preset-env',
                    {},
                  ],
                ],
              },
            },
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    targets: 'defaults',
                    // useBuiltIns: 'entry',
                    corejs: { version: '3.8.2' },
                  },
                ],
              ],
              cacheDirectory: true,//开启babel缓存，第二次构建时，会读取之前的缓存
            },
          },
          {
            loader: 'eslint-loader',
            options: {
              fix: true,//自动修复eslint错误
            },
          },
        ],

      },
      {
        test: /\.(gif|png:jpg|jpeg|ico)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              esModule: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 提取css文件为单独文件，从js中分离
    new MiniCssExtractPlugin({
      filename: 'assets/style/main.[contenthash:8].css',
    }),
    // 压缩css文件
    new OptimizeCssAssetsWebpackPlugin(),
    /*
     * PWA渐进式网络开发应用程序（离线可访问）
     * workbox-->workbox-webpack-plugin
     * */
    new WorkboxWebpackPlugin.GenerateSW({
      /*
       * 1、帮助serviceWorker快速启动
       * 2、删除旧的serviceWorker配置文件
       * -->生成一个 serviceWorker配置文件
       * */
      clientsClaim: true,
      skipWaiting: true,
    }),
    // 生成html文件
    new HtmlWebpackPlugin({
      title: 'Webpack App',
      template: './src/index.html',
      inject: 'body',
      scriptLoading: 'defer',
      minify: { //压缩HTML代码
        collapseWhitespace: true,//压缩空格
        removeComments: true,//移除注释
      },
      // filename:'index.[hash:8].html'
    }),
    new webpack.DllReferencePlugin({
      context: resolve(__dirname),
      manifest: resolve(__dirname, 'dll/manifest.json'),
    }),
    /* new AddAssetHtmlWebpackPlugin({
     filepath: resolve(__dirname, 'dll/!*.dll.js'),
     }),*/
  ],
  /*
   * 将node_modules中的代码单独打包成一个chunk输出
   * 自动分析多入口chunk中有没有公众的依赖/文件，如果有会打包成单独一个chunk
   * */
  /*
   * 代码分割
   * optimization->splitChunks->chunk
   * 在js中通过import(/webpackChunkNameL:'name'/)动态引入，该文件就会单独打包了
   * */
  optimization: {
    splitChunks: {
      chunks: 'all',
      // name:true
    },
  },
  devServer: {
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    contentBase: resolve(__dirname, 'dist'),
  },
  devtool: process.env.NODE_ENV === 'production'
           ? 'nosources-source-map'
           : 'eval-source-map',
  /*
   * [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
   * source-map                外部，错误代买准确信息和源代码的错误位置
   * inline-source-map         内联，只生成一个内联source-map，错误代码准确信息和源代码的错误位置
   * hidden-source-map         外部，错误代码错误原因，但是没有错误位置，不能追踪代码错误，只能提示到构建后代码的错误位置，只隐藏源代码
   * eval-source-map           内联，每一个文件都生成对应的source-map，都在eval，错误代码准确信息 和 源代码的错误位置
   * nosources-source-map      外部  错误代码的准确信息，但是没有任何源代码信息，隐藏源代码及构建后代码
   * cheap-source-map          外部  错误代码准确信息 和 源代码的错误位置，只能精确到行
   * cheap-module-source-map   外部  错误代码准确信息 和 源代码的错误位置，module会将loader的source-map胶乳
   * 内联和外部的区别
   * 1、外部生成了文件，内联没有，2、内联构建速度更快，3、内联会让代码体积变大
   * 开发环境： 速度快、调试友好 -> eval-source-map > eval-cheap-module-source-map
   * 速度：eval-cheap-source-map > eval-source-map > inline-source-map > cheap-source-map > ……
   * 调试优化： source-map > cheap-module-source-map > cheap-source-map
   * 生产环境：源代码要不要隐藏？调试要不要优化？ --> source-map / cheap-module-source-map
   * 源代码隐藏：nosource-source-map、hidden-source-map
   * */
};
