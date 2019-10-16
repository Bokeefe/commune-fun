var PORT = process.env.PORT || 8080;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);
io.set('origins', '*:*');
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

io.on('connection', function(client) {
  client.emit('rooms', rooms);

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
        }
        callback({
          nameAvailable: true,
          game: rooms[req.room].game
        });

        client.broadcast.to(req.room).emit('updateRoom', {
          room: rooms[req.room]
        });

        io.to(connectedUsers[client.id].room).emit('updateGame', rooms[req.room].game);

        io.to(connectedUsers[client.id].room).emit('message', {
          username: '🤖',
          text: req.username + ' has joined!'
        });

        client.on('startGame', nameOfTheGame => {
          var quoteIndexArr = getArrayOfIndexes(bottomText);
          quoteIndexArr = suffleArray(quoteIndexArr);
          const dealerDeck = deal(quoteIndexArr, 5, rooms[req.room].game.users.length);
          let index = 0;
          for (const user of rooms[req.room].game.users) {
            user.hand = dealerDeck[index];
            index++;
          }
          console.log(rooms[req.room].game.users[0].hand);
          io.to(connectedUsers[client.id].room).emit('updateGame', rooms[req.room].game);
        });
      }
    } else {
      callback({
        nameAvailable: false,
        error: 'Hey, please fill out the form!'
      });
    }

    /////////
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
    console.log('kill me?');
    io.to(connectedUsers[client.id].room).emit('message', message);
  });
});

function getArrayOfIndexes(array) {
  let arrayofIndexes = [];
  let i = 0;
  array.forEach(index => {
    arrayofIndexes.push(i);
    i++;
  });
  return arrayofIndexes;
}

function getRandomArrayIndex(arr) {
  return Math.floor(Math.random() * arr.length + 1);
}

function suffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function deal(array, deltNumber, numberPlaying) {
  const deltDecks = [];
  for (let index = 0; index < numberPlaying; index++) {
    deltDecks.push(array.splice(array.length - deltNumber, array.length));
  }
  return deltDecks;
}

http.listen(PORT, function() {
  console.log('Server started on port ' + PORT);
});
