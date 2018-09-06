const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var PORT = 3000;
let currentUsers = [];

app.use(express.static('static'));

server.listen(PORT, () => { 
  console.log(`listening on ${PORT}`)
});

io.on('connection', (socket) => {
 
  socket.on('set username', (username) => {
    currentUsers.push(username);
    io.emit('get users', currentUsers);
    io.emit('info', `${username} joined`)
  });

  socket.on('send message', (message) => {
    io.emit('send message', message);
  })

  io.on('disconnect', () => {
    console.log("a user disconnected")
  });
});