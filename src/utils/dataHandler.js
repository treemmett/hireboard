import store from '../store';
import api from './api';

export default function(){
  // Fetch techs
  store.dispatch({
    type: 'GET_TECHS',
    payload: api.get('/techs')
  });
}