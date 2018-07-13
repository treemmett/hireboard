import { combineReducers } from 'redux';

// Reducer functions
import login from './login';
import hires from './hires';
import monitors from './monitors';
import systems from './systems';
import techs from './techs';

export default combineReducers({
  login: login,
  hires: hires,
  monitors: monitors,
  systems: systems,
  techs: techs,
});