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

io.on('connection', function(socket){
  socket.on('CHAT_MESSAGE', function(msg){
    io.emit('CHAT_MESSAGE', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});