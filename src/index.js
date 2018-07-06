import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import store from './store';
import './index.css';

// Views
import Dashboard from './views/Dashboard';

const App = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <Route path="/" component={Dashboard}/>
      </Switch>
    </Router>
  </Provider>
);

ReactDOM.render(<App/>, document.getElementById('root'));
