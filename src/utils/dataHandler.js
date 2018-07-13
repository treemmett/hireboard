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

    // Fetch hires
    store.dispatch({
      type: 'GET_HIRES',
      payload: api.get('/hires')
    });

    // Fetch systems
    store.dispatch({
      type: 'GET_SYSTEMS',
      payload: api.get('/systems')
    });

    // Fetch monitors
    store.dispatch({
      type: 'GET_MONITORS',
      payload: api.get('/monitors')
    });

    // Initialize socket connection
    const ws = new WebSocket('ws://'+window.location.hostname+':8081');

    ws.onopen = () => {
      console.log('WebSocket connected...');
    }

    ws.onmessage = msg => {
      store.dispatch({
        type: 'SET_HIRES',
        payload: JSON.parse(msg.data)
      });
    };
  }
}

export default function(){
  checkIfLoggedIn();
  store.subscribe(checkIfLoggedIn);
}