let server = require('http').createServer();
let p2pserver = require('socket.io-p2p-server').Server
let io = require('socket.io')(server);
let port = 3030;
server.listen(port, () => {
	console.log(`Listening on ${port}`);
});

io.use(p2pserver);

io.on('connection', function(socket) {
  socket.on('peer-msg', function(data) {
    console.log('Message from peer: %s', data);
    socket.broadcast.emit('peer-msg', data);
  })

  socket.on('go-private', function(data) {
    socket.broadcast.emit('go-private', data);
  });
});