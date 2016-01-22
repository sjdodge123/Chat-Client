var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var msgLog = [];
var clientID = 0;
var client = {};
var socketList = {};


app.get('/', function(req, res){
  res.sendfile("index.html");
});

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

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function sendBroadcast(broadcast) {
	io.emit('chat message', broadcast);
	console.log(broadcast);
	msgLog.push(broadcast);
}

function sendMessage(message) {

}

