import { combineReducers } from 'redux';
import room from './room_reducer.js';
import game from './game_reducers.js';

const rootReducer = combineReducers({
  room,
  game
});

export default rootReducer;
