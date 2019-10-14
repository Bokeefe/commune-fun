import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8080');

function subscribeToRooms(cb) {
  socket.on('rooms', rooms => {
    cb(rooms);
  });
  socket.emit('subscribeToRooms');
}

function updateRoom(cb) {
  socket.on('updateRoom', room => {
    cb(room);
  });
}

function joinRoom(data, cb) {
  socket.emit('joinRoom', { room: data.room, username: data.username }, cb);
}

function joinedRoom(cb) {
  socket.on('joinedRoom', room => cb(room));
}

export { joinRoom, joinedRoom, updateRoom, subscribeToRooms };
