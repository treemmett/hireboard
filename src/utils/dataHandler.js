import store from '../store';
import api from './api';
let isLoggedIn = false;

// Function to check if we're now logged in
function checkIfLoggedIn(){
  const wasLoggedIn = isLoggedIn;
  isLoggedIn = store.getState().login;

  // Force data fetch if this is a new login
  if(isLoggedIn && wasLoggedIn !== isLoggedIn){
    
    // Fetch techs
    store.dispatch({
      type: 'GET_TECHS',
      payload: api.get('/techs')
    });
  }
}

export default function(){
  checkIfLoggedIn();
  store.subscribe(checkIfLoggedIn);
}