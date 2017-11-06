const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const StatsPlugin = require('stats-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
const PATHS = {
  build: path.join(__dirname, '../dist'),
  src: path.join(__dirname, '../src'),
  style: path.join(__dirname, '../src/assets/css')
};

const config = {
  entry: {
    index: ['react-hot-loader/patch', PATHS.src], // activate HMR for React
    vendor: ['react', 'redux', 'react-redux', 'react-dom'],
    style: path.join(PATHS.style, 'common.scss')
  },
  output: {
    path: PATHS.build,
    filename: 'js/[name].[hash].js',
    chunkFilename: '[hash].js',
    // necessary for HMR to know where to load the hot update chunks
    publicPath: '/'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/temp/index.template.html'
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ["src/assets/js/My97DatePicker/WdatePicker.js"],
      append: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    // Used for migrating from webpack 1 to 2
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    // prints more readable module names in the browser console on HMR updates
    new webpack.NamedModulesPlugin(),
    // enable HMR globally
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    historyApiFallback: true,
    inline: true,
    host: "localhost",
    hot: true,
    port: 3001,
    compress: true,
    disableHostCheck: true, //LAN host config
    stats: "errors-only",
    proxy: {
      '/api': {
        target: 'http://github.com',
        pathRewrite: {
          "^/api": "/server/"
        },
        changeOrigin: true,
        secure: false
      }
    }
  },
  devtool: 'source-map', //eval
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      include: PATHS.src,
      enforce: "pre",
      use: ['react-hot-loader/webpack', 'babel-loader', 'source-map-loader']
    }, {
      test: /\.tsx?$/,
      use: "awesome-typescript-loader"
    },{
      test: /\.(png|jpg|gif|svg)$/,
      use: 'url-loader?limit=8192'
    }, {
      test: /\.scss$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', 'sass-loader']
      }),
      include: path.join(PATHS.src, 'assets/css')
    }]
  },
  resolve: {
    extensions: ['.js', '.json', '.scss', '.jsx', '.ts','.tsx'],
    alias: {
      js: path.join(PATHS.src, 'assets/js'),
      css: PATHS.style
    }
  }
};

module.exports = config