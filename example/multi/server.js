var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/dist/app.js', function(req, res){
  res.sendFile(__dirname + '/dist/app.js');
});

const chat1 = io.of('/chat1')
const chat2 = io.of('/chat2')

chat1.on('connection', function(socket){
  socket.on('CHAT_MESSAGE', function(msg){
    chat1.emit('CHAT_MESSAGE', msg);
  });
});

chat2.on('connection', function(socket){
  socket.on('CHAT_MESSAGE', function(msg){
    chat2.emit('CHAT_MESSAGE', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
