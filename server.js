var PORT = process.env.PORT || 8080;
var express = require('express');
var app = express();
var http = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(http);
var connectedUsers = {};
var cursed = [];
var rooms = {};

var bottomText = require('./src/games/meme/bottom_text.json');

var exGameData = {
  name: 'blessed',
  imgIndex: 3,
  quotes: [
    { quote: 'first quote', tally: 0 },
    { quote: 'second quote', tally: 0 },
    { quote: 'third quote', tally: 0 }
  ],
  clients: {
    brendan: {
      quotes: [3, 7, 4, 9, 8],
      choice: 7
    }
  }
};

app.use(express.static(__dirname + '/build'));

app.get('/', (req, res) => {
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
  client.emit('rooms', rooms);
  console.log('connection');
  client.emit('rooms', rooms);

  client.on('subscribeToRooms', () => {
    console.log('subtoRooms');

    client.emit('rooms', rooms);
  });

  client.on('joinRoom', function(req, callback) {
    console.log('joinRoom');

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
            const gameData = {
              name: 'blessed',
              imgIndex: 1,
              quotes: [],
              clients: {}
            };
          } else {
            rooms[req.room].users.push(req.username);
            console.log(rooms[req.room]);
          }
        }
        callback({
          nameAvailable: true,
          game: exGameData
        });

        client.broadcast.to(req.room).emit('updateRoom', {
          room: rooms[req.room]
        });

        client.broadcast.to(req.room).emit('message', {
          username: '🤖',
          text: req.username + ' has joined!'
        });

        client.on('startGame', nameOfTheGame => {
          var quoteIndexArr = getArrayOfIndexes(bottomText);
          quoteIndexArr = suffleArray(quoteIndexArr);

          rooms[req.room] = { users: [req.username], game: exGameData };
          deal(quoteIndexArr, 5, 5);
          console.log(nameOfTheGame + ' started in ' + req.room);
          io.to(connectedUsers[client.id].room).emit('updateGame', deal(quoteIndexArr, 5, 5));
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
    console.log('got a message', message);
    io.to(connectedUsers[client.id].room).emit('message', message);
  });

  client.emit('message', {
    username: '🤖',
    text: 'Hey there! Ask someone to join this chat room to start talking.'
  });
});

http.listen(PORT, function() {
  console.log('Server started on port ' + PORT);
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
