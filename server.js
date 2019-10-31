const express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
const port = process.env.PORT || 8080;

var io = require('socket.io')(http);
var moment = require('moment');
var fs = require('fs');

var connectedUsers = {};
var rooms = {};
let imgObj = {};

var bottomText = require('./src/games/meme/bottom_text.json');
var imgDir = require('./src/games/meme/meme_img.json');

app.use(express.static(__dirname + '/build'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('build/index.html'), { root: __dirname }, err => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

io.on('connection', socket => {
  socket.emit('connected', true);
  socket.emit('rooms', rooms);

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
          username: '🤖',
          text: req.username + ' has joined!',
          timestamp: moment().valueOf()
        });

        // new room + new user
        if (!rooms[req.room]) {
          rooms[req.room] = {
            users: [req.username],
            game: { active: false, users: [], choices: {}, isFinished: false }
          };

          // emit to all sockets that there is a new room
          io.emit('rooms', rooms);

          rooms[req.room].game.users.push({ username: req.username, hand: null });
          io.to(req.room).emit('updateRoom', rooms[req.room]);
          io.to(req.room).emit(
            'updateStatus',
            'You are the 1st. once everyone has joined the room, pick a game to start'
          );

          // existing room + new user
        } else {
          rooms[req.room].users.push(req.username);
          rooms[req.room].game.users.push({ username: req.username, hand: null });

          // emit to the room that there is a new user
          io.to(req.room).emit('updateRoom', rooms[req.room]);
          io.to(req.room).emit(
            'updateStatus',
            'Once everyone has joined the room, pick a game to start'
          );
        }
        callback(rooms[req.room]);
      }
    } else {
      callback({
        nameAvailable: false,
        error: 'Hey, please fill out the form!'
      });
    }

    // listeners in room
    socket.on('pickChoice', choice => {
      const usersThatVoted = [];
      io.to(req.room).emit('updateStatus', 'Usernames turn gold when they have voted');

      Object.keys(rooms[req.room].game.choices).forEach(choice => {
        usersThatVoted.push(choice.username);
      });

      // check if they already voted
      if (!usersThatVoted.includes(choice.username)) {
        rooms[req.room].game.choices[choice.username] = choice;
      }

      // if everyone voted
      if (JSON.stringify(usersThatVoted) === JSON.stringify(rooms[req.room].users)) {
        rooms[req.room].game.isFinished = true;
        rooms[req.room].game.users.forEach(user => {
          if (rooms[req.room].game.dealer === user.username) {
            io.to(connectedUsers[socket.id].room).emit('dealerHand', rooms[req.room].game.choices);
            io.to(req.room).emit(
              'updateStatus',
              'Everyone has voted, waiting for the dealers choice'
            );
          }
        });
      }
      io.to(req.room).emit('updateRoom', rooms[req.room]);
    });

    socket.on('winningPick', winner => {
      io.to(req.room).emit('updateStatus', `${winner} has won`);

      rooms[req.room].game.winner = winner;
    });
  });

  socket.on('getRooms', () => {
    io.emit('rooms', rooms);
  });

  socket.on('message', function(message) {
    message.timestamp = moment().valueOf();
    io.to(connectedUsers[socket.id].room).emit('message', message);
  });

  socket.on('startGame', game => {
    if (!game) {
      rooms[game.roomName].game = { active: false, users: [], choices: {}, isFinished: false };
    }
    rooms[game.roomName].game.active = true;
    rooms[game.roomName].game.name = game.name;
    rooms[game.roomName].game.imgIndex = getRandomArrayIndex(imgDir[game.name]);
    const randomDealer = getRandomArrayIndex(rooms[game.roomName].users);
    rooms[game.roomName].game.dealer = rooms[game.roomName].users[randomDealer];

    var quoteIndexArr = getArrayOfIndexes(bottomText);
    quoteIndexArr = suffleArray(quoteIndexArr);
    const dealerDeck = deal(quoteIndexArr, 7, rooms[game.roomName].game.users.length);
    let index = 0;
    for (const user of rooms[game.roomName].game.users) {
      user.hand = dealerDeck[index];
      user.voted = false;
      index++;
    }
    io.to(game.roomName).emit('updateStatus', 'Pick a caption');
    // emit to room that there is now a game
    io.to(game.roomName).emit('updateRoom', rooms[game.roomName]);
  });

  socket.on('disconnect', function() {
    var userData = connectedUsers[socket.id];
    if (typeof userData !== 'undefined') {
      socket.leave(connectedUsers[socket.id]);
      io.to(userData.room).emit('message', {
        username: '🤖',
        text: userData.username + ' has left!',
        timestamp: moment().valueOf()
      });
      delete connectedUsers[socket.id];
    }

    if (Object.keys(connectedUsers).length < 1) {
      connectedUsers = {};
      rooms = {};
    }
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
  return Math.floor(Math.random() * arr.length);
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

http.listen(port, () => {
  console.log(`listening on HOST:${port}`);
});
