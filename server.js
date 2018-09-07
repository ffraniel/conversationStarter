const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

var PORT = 3000;
let currentUsers = [];
let previousUsers = [];

app.use(express.static('static'));

server.listen(PORT, () => { 
  console.log(`listening on ${PORT}`)
});

const compareUsersToFindDisconnect = (current, previous) => {
  var leaverList = previous.filter((name) => { 
    return current.indexOf(name) === -1; 
  });
  return leaverList[0];
};

io.on('connection', (socket) => {
 
  socket.on('set username', (username) => {
    currentUsers.push(username);
    io.emit('get users', currentUsers);
    io.emit('info', `${username} joined`);
    io.emit('write info', `${username} joined`);
  });

  socket.on('send message', (message) => {
    io.emit('send message', message);
  })
  socket.on('disconnect', () => {
    previousUsers = [];
    for (var i = 0; i < currentUsers.length; i ++) {
      previousUsers.push(currentUsers[i]);
    };
    currentUsers = []; 
    io.emit('check users');
  });

  socket.on('update username list', (user) => {
    if (!currentUsers.includes(user)) {
      currentUsers.push(user)
    };
    setTimeout(() => {
      let leaver = compareUsersToFindDisconnect(currentUsers, previousUsers);
      io.emit('get users', currentUsers);
      io.emit('info', `${leaver} left`);
      io.emit('write info', `${leaver} left`);
    }, 1500)
  })
});