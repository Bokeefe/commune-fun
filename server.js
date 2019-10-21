// const http = require('http');
// const socketIo = require('socket.io');
// const port = process.env.PORT || 8080;
// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

const express = require('express');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const port = process.env.PORT || 8080;
var moment = require('moment');
var fs = require('fs');
var connectedUsers = {};
var rooms = {};

var bottomText = require('./src/games/meme/bottom_text.json');
var imgDir = require('./src/games/meme/meme_img.json');
let imgObj = {};

app.use(express.static(__dirname + '/build'));
const imgPath = './src/games/meme/imgs/';

app.get('/', (req, res) => {
  res.sendFile(path.resolve('build/index.html'), { root: __dirname }, err => {
    if (err) {
      res.status(500).send(err);
    }
  });
});
console.log(imgDir.blessed);

io.on('connection', function(socket) {
  console.log('A user is connected.');
  socket.emit('connected', true);
  socket.emit('rooms', rooms);

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

    if (Object.keys(connectedUsers).length < 1) {
      connectedUsers = {};
      rooms = {};
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
              imgIndex: getRandomArrayIndex(imgDir.blessed),
              users: [{ user: req.username, hand: null }]
            }
          };
          io.emit('rooms', rooms);
        } else {
          rooms[req.room].users.push(req.username);
          rooms[req.room].game.users.push({ user: req.username, hand: null });
          io.to(connectedUsers[client.id].room).emit('updateRoom', rooms[req.room]);
        }
        io.emit('rooms', rooms);
        callback(rooms[req.room]);
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

  socket.on('startGame', nameOfTheGame => {
    console.log(nameOfTheGame);
    // var quoteIndexArr = getArrayOfIndexes(bottomText);
    // quoteIndexArr = suffleArray(quoteIndexArr);
    // const dealerDeck = deal(quoteIndexArr, 5, rooms[req.room].game.users.length);
    // let index = 0;
    // for (const user of rooms[req.room].game.users) {
    //   user.hand = dealerDeck[index];
    //   index++;
    // }
    // console.log(rooms[req.room].game.users[0].hand);
    // io.to(connectedUsers[client.id].room).emit('updateGame', rooms[req.room].game);
  });
});

// fs.readdir(imgPath, (err, files) => {
//   files.forEach(dir => {
//     imgObj[dir] = getFileNames(imgPath, dir);
//   });
//   fs.writeFile('./src/games/meme/meme_img.json', JSON.stringify(imgObj), 'utf8', () => {});
// });

function getFileNames(path, dir) {
  fileArr = [];
  fs.readdirSync(path + dir).map(fileName => {
    if (fileName !== '.DS_Store') {
      fileArr.push(fileName);
    }
  });
  return fileArr;
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

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
