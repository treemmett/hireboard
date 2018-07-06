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

    default: break;
  }

  return state;
}