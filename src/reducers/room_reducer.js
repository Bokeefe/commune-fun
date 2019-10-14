export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_ROOMS':
      return { ...state, rooms: action.payload };
    case 'JOIN_ROOM':
      return { ...state, room: action.payload };
    case 'MESSAGE':
      return { ...state, message: action.payload };
    default:
      return state;
  }
};
