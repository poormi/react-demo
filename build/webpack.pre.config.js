const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const PATHS = {
  build: path.join(__dirname, '../dist-pre'),
  src: path.join(__dirname, '../src'),
  style: path.join(__dirname, '../src/assets/css')
};
console.log(process.env.NODE_ENV)
module.exports = {
  entry: {
    index: path.join(PATHS.src, 'index.js'),
    vendor: ['react', 'redux', 'react-redux', 'react-dom'],
    style: path.join(PATHS.style, 'common.scss')
  },
  resolve: {
    extensions: ['.js', '.json', '.scss', '.jsx'],
    alias: {
      js: path.join(PATHS.src, 'assets/js'),
      css: PATHS.style
    }
  },
  output: {
    path: PATHS.build,
    filename: 'js/[name].[chunkhash].js',
    publicPath: '/web/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(PATHS.src, 'temp/index.template.html'),
      inject: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new ExtractTextPlugin('css/[name].[chunkhash].css'),
    new CleanWebpackPlugin([PATHS.build], {
      root: process.cwd()
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new CopyWebpackPlugin([{
      from: path.resolve(PATHS.src, 'assets'),
      to: PATHS.build,
      ignore: ['css/*.*']
    }]),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ["js/My97DatePicker/WdatePicker.js"],
      append: false
    }), new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: 'images/[name].[ext]?[hash]'
      }
    }, {
      test: /\.scss$/,
      loaders: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader!sass-loader'
      })
    }]
  }
}