export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_GAME_DATA':
      return { ...state, rooms: action.payload };
    default:
      return state;
  }
};
