const { resolve } = require('path');
const MIniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require(
  'optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const commonCSS = [
  MIniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [
            'postcss-preset-env',
            {},
          ],
        ],
      },
    },
  },
];
module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'js/[name].[hash:8].js',
    path: resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [...commonCSS],
      },
      {
        test: /\.less$/,
        use: [...commonCSS, 'less-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'eslint-loader',
        options: {
          fix: true,
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modeles/,
        loader: 'babel-loader',
        options: {
          presets: [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: { version: 3 },
              target: 'default',
            },
          ],
        },
      },
      {
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:8].[ext]',
          outputPath: 'assets/Images',
          esModule: false,
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
        options: {
          minify: {
            collapseWhitespace: true,
            removeComments: true,
          },
        },
      },
      {
        exclude: /\.(js|css|less|html|jpg|png|gif)/,
        loader: 'file-loader',
        options: {
          outputPath: 'assets/media',
        },
      },
    ],
  },
  plugins: [
    new MIniCssExtractPlugin({
      filename: 'assets/style/main.css',
      // outputPath:''
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
};
