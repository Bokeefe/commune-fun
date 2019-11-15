export default (state = {}, action) => {
  switch (action.type) {
    case 'GET_ROOM':
      return { ...state, rooms: action.payload };
    default:
      return state;
  }
};
