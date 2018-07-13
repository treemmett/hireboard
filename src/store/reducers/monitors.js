export default function(state={
  data: []
}, action){
  switch(action.type){
    case 'ADD_MONITOR': {
      state = {...state}
      state.data.push(action.payload);
      break;
    }

    case 'GET_MONITORS_PENDING': {
      state = {
        ...state,
        fetching: true
      }
      break;
    }

    case 'GET_MONITORS_FULFILLED': {
      state = {
        ...state,
        fetching: false,
        data: action.payload.data
      }
      break;
    }

    case 'GET_MONITORS_REJECTED': {
      state = {
        ...state,
        fetching: false,
        error: action.payload
      }
      break;
    }

    case 'REMOVE_MONITOR': {
      state = {...state}

      // Find index of old data
      const index = state.data.findIndex(item => {
        return item._id === action.payload;
      });

      // Remove data
      if(index > -1){
        state.data.splice(index, 1);
      }
      break;
    }

    case 'UPDATE_MONITOR': {
      state = {...state};
      // Find index of old data
      const index = state.data.findIndex(item => {
        return item._id === action.payload._id;
      });

      // Replace data
      if(index > -1){
        state.data[index] = action.payload;
      }
      break;
    }

    default: break;
  }

  return state;
}