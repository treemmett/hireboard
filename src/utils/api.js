import axios from 'axios';

const api = axios.create({baseURL: '/api'});

// Cache auth token from response
api.interceptors.response.use(res => {
  if(res.headers['x-auth-token']){
    localStorage.setItem('authToken', res.headers['x-auth-token']);
  }

  return res;
});

// Add auth token to requests
api.interceptors.request.use(config => {
  if(localStorage.authToken){
    config.headers.authorization = 'Bearer '+localStorage.authToken;
  }

  return config;
});

export default api;