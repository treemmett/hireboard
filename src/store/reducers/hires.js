export default function(state={
  data: []
}, action){
  switch(action.type){
    case 'ADD_HIRE': {
      state = {...state}
      state.data.push(action.payload);
      break;
    }

    case 'GET_HIRES_PENDING': {
      state = {
        ...state,
        fetching: true
      }
      break;
    }

    case 'GET_HIRES_FULFILLED': {
      state = {
        ...state,
        fetching: false,
        data: action.payload.data
      }
      break;
    }

    case 'GET_HIRES_REJECTED': {
      state = {
        ...state,
        fetching: false,
        error: action.payload
      }
      break;
    }

    default: break;
  }

  return state;
}