import { combineReducers } from 'redux';

// Reducer functions
import login from './login';
import hires from './hires';
import techs from './techs';

export default combineReducers({
  login: login,
  hires: hires,
  techs: techs,
});