import axios from 'axios';
import store from '../store';

const api = axios.create({baseURL: '/api'});

// Cache auth token from response
api.interceptors.response.use(res => {
  if(res.headers['x-auth-token']){
    localStorage.setItem('authToken', res.headers['x-auth-token']);
    store.dispatch({
      type: 'SET_LOGIN',
      payload: true
    });
  }

  return res;
}, err => {
  if(err.response.status === 401){
    // Remove token, reset login
    localStorage.removeItem('authToken');
    store.dispatch({
      type: 'SET_LOGIN',
      payload: false
    });
  }
  return Promise.reject(err);
});

// Add auth token to requests
api.interceptors.request.use(config => {
  if(localStorage.authToken){
    config.headers.authorization = 'Bearer '+localStorage.authToken;
  }

  return config;
});

export default api;