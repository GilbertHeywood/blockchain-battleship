var express = require('express');
var app = express();
var server = require('http').createServer(app)
let p2pserver = require('socket.io-p2p-server').Server
let io = require('socket.io')(server);
let port = 3000;

server.listen(port, () => {
	console.log(`Listening on ${port}`);
});

io.use(p2pserver);
app.use(express.static(`${__dirname}/build/`));
app.get('*', (req, res) => {
  res.sendfile('./index.html')
})

io.on('connection', (socket) => {
  socket.on('peer-msg', (data) => {
    console.log('Message from peer: %s', data);
    socket.broadcast.emit('peer-msg', data);
  })

  socket.on('go-private', (data) => {
    socket.broadcast.emit('go-private', data);
  });
});