var PORT = process.env.PORT || 8080;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);
var connectedUsers = {};
var cursed = [];
var rooms = {};

app.use(express.static(__dirname + '/build'));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve('build/index.html'), { root: __dirname }, err => {
      if (err) {
          res.status(500).send(err);
      }
  });
});

fs.readdir('./src/games/meme/cursed', (err, files) => {
  files.forEach(file => {
    cursed.push(file);
  });
});

io.on('connection', function(client) {
  client.on('subscribeToRooms', () => {
    setInterval(() => {
      client.emit('rooms', rooms);
    }, 500);
  });

  client.on('joinRoom', function(req, callback) {
    if (req.room.replace(/\s/g, '').length > 0 && req.username.replace(/\s/g, '').length > 0) {
      var nameTaken = false;
      var roomTaken = false;

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
        connectedUsers[client.id] = req;
        client.join(req.room);

        if (!roomTaken) {
          if (!rooms[req.room]) {
            rooms[req.room] = { users: [req.username] };
          } else {
            rooms[req.room].users.push(req.username);
            console.log(rooms[req.room]);
          }
        }
        callback({
          nameAvailable: true
        });
        client.broadcast.to(req.room).emit('updateRoom', {
          room: rooms[req.room]
        });

        client.broadcast.to(req.room).emit('message', {
          username: '🤖',
          text: req.username + ' has joined!'
        });
      }
    } else {
      callback({
        nameAvailable: false,
        error: 'Hey, please fill out the form!'
      });
    }

    client.on('disconnect', function() {
      var userData = connectedUsers[client.id];
      if (typeof userData !== 'undefined') {
        client.leave(connectedUsers[client.id]);
        io.to(userData.room).emit('message', {
          username: '🤖',
          text: userData.username + ' has left!'
        });
        delete connectedUsers[client.id];
      }
    });
  });

  client.on('message', function(message) {
    io.to(connectedUsers[client.id].room).emit('message', message);
  });

  client.emit('message', {
    username: '🤖',
    text: 'Hey there! Ask someone to join this chat room to start talking.',
  });
});

http.listen(PORT, function() {
  console.log('Server started on port ' + PORT);
});
