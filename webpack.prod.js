


const path = require('path');
const port = 3000

const webpack = require('webpack');
const webpackConfig = new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': JSON.stringify('production')
  }
});

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html'
})
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
module.exports = {
  entry: './src/index.jsx',
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: "style-loader!css-loader" },
      { test: /\.scss$/,loader: ['style-loader', 'css-loader', 'sass-loader']},
      { test: /\.(eot|svg|ttf|woff|woff2)$/, loader: 'url-loader?limit=100000' },
      { test: /\.(jpe?g|png|gif|svg)$/i, use: ['url-loader?limit=10000','img-loader']}
    ]
  },
  plugins: [HtmlWebpackPluginConfig, new UglifyJSPlugin(), webpackConfig],
  // devtool: '#eval-source-map',
  devServer: {
  	port: port,
    historyApiFallback: true,
    inline: true
  }
}