const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require(
  'optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
process.env.NODE_ENV = 'production';

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'js/[name].[hash:8].js',
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
        loader: 'eslint-loader',
        options: {
          fix: true,//自动修复eslint错误
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                targets: 'defaults',
                useBuiltIns: 'usage',
                corejs: { version: 3 },
              },
            ],
          ],
        },
      },
    ],
  },
  plugins: [
    // 生成html文件
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: { //压缩HTML代码
        collapseWhitespace: true,//压缩空格
        removeComments: true,//移除注释
      },
      // filename:'index.[hash:8].html'
    }),
    // 提取css文件为单独文件，从js中分离
    new MiniCssExtractPlugin({
      filename: 'assets/style/main.css',
    }),
    // 压缩css文件
    new OptimizeCssAssetsWebpackPlugin(),
    new CleanWebpackPlugin(),
  ],
  devServer: {
    port: 3000,
    open: true,
    compress: true,
    contentBase: resolve(__dirname, 'dist'),
  },
};
