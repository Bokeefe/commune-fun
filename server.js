const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const port = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
var moment = require('moment');

var connectedUsers = {};
var rooms = {};

var memeImgs = require('./src/games/meme/meme_img_array.json');
var bottomText = require('./src/games/meme/bottom_text.json');

app.use(express.static(__dirname + '/build'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('build/index.html'), { root: __dirname }, err => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// fs.readdir('./src/games/meme/cursed', (err, files) => {
//   files.forEach(file => {
//     cursed.push(file);
//   });
// });

io.on('connection', function(socket) {
  console.log('A user is connected.');
  socket.emit('connected', true);
  socket.on('disconnect', function() {
    var userData = connectedUsers[socket.id];
    if (typeof userData !== 'undefined') {
      socket.leave(connectedUsers[socket.id]);
      io.to(userData.room).emit('message', {
        username: 'System',
        text: userData.username + ' has left!',
        timestamp: moment().valueOf()
      });
      delete connectedUsers[socket.id];
    }
  });

  socket.on('joinRoom', function(req, callback) {
    if (req.room.replace(/\s/g, '').length > 0 && req.username.replace(/\s/g, '').length > 0) {
      var nameTaken = false;

      Object.keys(connectedUsers).forEach(function(socketId) {
        var userInfo = connectedUsers[socketId];
        if (userInfo.username.toUpperCase() === req.username.toUpperCase()) {
          nameTaken = true;
        }
      });

      if (nameTaken) {
        callback({
          nameAvailable: false,
          error: 'Sorry this username is taken!'
        });
      } else {
        connectedUsers[socket.id] = req;
        socket.join(req.room);
        socket.broadcast.to(req.room).emit('message', {
          username: 'System',
          text: req.username + ' has joined!',
          timestamp: moment().valueOf()
        });
        if (!rooms[req.room]) {
          rooms[req.room] = {
            users: [req.username],
            game: {
              name: 'blessed',
              imgIndex: getRandomArrayIndex(memeImgs.blessed),
              users: [{ user: req.username, hand: null }]
            }
          };
          io.emit('rooms', rooms);
        } else {
          rooms[req.room].users.push(req.username);
          rooms[req.room].game.users.push({ user: req.username, hand: null });
        }
        io.emit('rooms', rooms);
        callback({
          nameAvailable: true
        });
      }
    } else {
      callback({
        nameAvailable: false,
        error: 'Hey, please fill out the form!'
      });
    }
  });

  socket.on('message', function(message) {
    message.timestamp = moment().valueOf();
    io.to(connectedUsers[socket.id].room).emit('message', message);
  });

  socket.emit('message', {
    username: 'System',
    text: 'Hey there! Ask someone to join this chat room to start talking.',
    timestamp: moment().valueOf()
  });
});
server.listen(port, () => console.log(`Listening on port ${port}`));
