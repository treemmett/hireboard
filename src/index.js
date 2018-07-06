import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import store from './store';
import dataHandler from './utils/dataHandler';
import './index.css';
import './components.scss';

// Views
import Admin from './views/Admin';
import Dashboard from './views/Dashboard';
import Login from './views/Login';

const App = () => {
  dataHandler();
  
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard}/>
          <Route exact path="/login" component={Login}/>

          <Route exact path="/admin" component={Admin}/>
        </Switch>
      </Router>
    </Provider>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
