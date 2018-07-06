import { combineReducers } from 'redux';

// Reducer functions
import login from './login';
import techs from './techs';

export default combineReducers({
  login: login,
  techs: techs,
});