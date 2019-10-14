import axios from 'axios';

const URL = 'http://localhost:3004';

export function getRooms() {
  const request = axios.get(`${URL}/getRooms`).then(response => response.data);

  return {
    type: 'GET_ROOMS',
    payload: request
  };
}

export function joinRoom(roomName) {
  const request = axios.get(`${URL}/${roomName}`).then(response => response.data);

  return {
    type: 'JOIN_ROOM',
    payload: request
  };
}

export function getGameData(gameName) {
  const request = axios.get(`${URL}/${gameName}`).then(response => response.data);

  return {
    type: 'GET_GAME_DATA',
    payload: request
  };
}
