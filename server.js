
var express = require('express'); 
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.use( require('socket.io-p2p-server').Server );

if ( process.env.NODE_ENV === 'production') {
	app.use('/static', express.static(__dirname + '/static'));
	app.use('/images', express.static(__dirname + '/images'));
} else {
	var webpack = require('webpack');
	var webpackConfig = require(__dirname + '/webpack.config');
	var compiler = webpack(webpackConfig);
	 
	app.use(require("webpack-dev-middleware")(compiler, {
	    publicPath: webpackConfig.output.publicPath
	}));

	app.use(require("webpack-hot-middleware")(compiler));
}

app.use('/', express.static(__dirname));

var port = process.env.PORT || 3000;
http.listen(port, function(){
  console.log('listening on *:'+port);
});


var unmatchedSocket;

io.on('connection', function (socket) {
	console.log('client connected');

	if ( unmatchedSocket ) {
		console.log('client matched - starting game');

		startGame(unmatchedSocket, socket);
		unmatchedSocket = null;
	} else {
		console.log('client unmatched');

		unmatchedSocket = socket;
	}
});

const CARDS = "A23456789TJQK".split(''),
  SUITS = "DHSC".split(''),
  DECK = cprod(CARDS, SUITS).map(c => c.join(''));

function shuffle(o){
    o = o.slice(0);
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};
function cprod() {
  return Array.prototype.reduce.call(arguments, function(a, b) {
    var ret = [];
    a.forEach(function(a) {
      b.forEach(function(b) {
        ret.push(a.concat([b]));
      });
    });
    return ret;
  }, [[]]);
}

function startGame(socketA, socketB) {
	var deck = shuffle(DECK);

	socketA.emit('gameAction', {
		type: 'game.start',
		player: 'A',
		deck: deck
	});
	socketB.emit('gameAction', {
		type: 'game.start',
		player: 'B',
		deck: deck
	});

	socketA.on('gameAction', function (action, callback) {
		console.log('gameAction A', action);

		socketB.emit('gameAction', action);
		callback();
	});

	socketB.on('gameAction', function (action, callback) {
		console.log('gameAction B', action);

		socketA.emit('gameAction', action, function () {
			callback();
		});
	});
}
