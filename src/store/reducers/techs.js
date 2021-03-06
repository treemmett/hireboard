export default function(state={
  data: []
}, action){
  switch(action.type){
    case 'ADD_TECH': {
      state = {...state}
      state.data.push(action.payload);
      break;
    }

    case 'GET_TECHS_PENDING': {
      state = {
        ...state,
        fetching: true
      }
      break;
    }

    case 'GET_TECHS_FULFILLED': {
      state = {
        ...state,
        fetching: false,
        data: action.payload.data
      }
      break;
    }

    case 'GET_TECHS_REJECTED': {
      state = {
        ...state,
        fetching: false,
        error: action.payload
      }
      break;
    }

    case 'REMOVE_TECH': {
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

    case 'UPDATE_TECH': {
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