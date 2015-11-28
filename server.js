
if ( process.env.NODE_ENV === 'production') {
	var express = require('express'); 
	var server = express();

	server.use('/static', express.static(__dirname + '/static'));
	server.use('/images', express.static(__dirname + '/images'));
	server.use('/', express.static(__dirname));

	server.listen(process.env.PORT || 3000);
} else {
	var webpack = require('webpack');
	var WebpackDevServer = require('webpack-dev-server');
	var config = require('./webpack.config');

	new WebpackDevServer(webpack(config), {
	  publicPath: config.output.publicPath,
	  hot: true,
	  historyApiFallback: true
	}).listen(3000, 'localhost', function (err, result) {
	  if (err) {
	    console.log(err);
	  }

	  console.log('Listening at localhost:3000');
	});
}
