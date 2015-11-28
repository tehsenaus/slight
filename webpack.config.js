var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var debug = process.env.NODE_ENV !== 'production';

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(debug || 'false'))
});

module.exports = {
  entry: (debug ? [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server'
  ] : []).concat([
    './js/index.js'
  ]),
  output: {
    path: __dirname + '/static/',
    publicPath: '/static/',
    filename: 'bundle.js',
    hot: debug
  },
  plugins: (debug ? [
    new webpack.HotModuleReplacementPlugin()
  ] : []).concat([
    new webpack.NoErrorsPlugin(),
    devFlagPlugin,
    new ExtractTextPlugin('app.css')
  ]),
  module: {
    loaders: [
      { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },
      
      { test: /\.js$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: ExtractTextPlugin.extract('css-loader?module!cssnext-loader') },

      // https://github.com/webpack/css-loader/issues/38
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.json']
  }
};
