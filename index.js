var express = require('express')
  , http = require('http');
var app = express();
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
var server = http.createServer(app);
var io = require('socket.io').listen(server);
var msgLog = [];
var clientID = 0;
var client = {};
var socketList = {};

io.on('connection', function(socket){
	clientID++;
	client[socket.id] = clientID;
	socketList[socket.id] = socket;
	var d = new Date();
	var time = d.getHours()-12 +':'+d.getMinutes() + ':' + d.getSeconds();
	
	socket.on('chat message', function(msg){
		var time = d.getHours()-12 +':'+d.getMinutes() + ':' + d.getSeconds();
		sendBroadcast(time + ' User ' + client[socket.id] + ' - '  + msg);
	});


	socket.on('disconnect', function(){
		var time = d.getHours()-12 +':'+d.getMinutes() + ':' + d.getSeconds();
		sendBroadcast(time + ' User ' + client[socket.id] + ' has left.');

  	});

	for(var i=0; i<msgLog.length;i++){
		socket.emit('chat message', msgLog[i]);
	}
	sendBroadcast(time + ' User '+ client[socket.id] + ' has joined.');
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});

function sendBroadcast(broadcast) {
	io.emit('chat message', broadcast);
	console.log(broadcast);
	msgLog.push(broadcast);
}

function sendMessage(message) {

}

