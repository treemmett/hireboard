import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import store from './store';
import dataHandler from './utils/dataHandler';
import './index.css';
import './components.scss';

// Views
import Admin from './views/Admin';
import Dashboard from './views/Dashboard';
import Login from './views/Login';

@connect(store => {
  return {
    loggedIn: store.login
  }
})
class PrivateRoute extends Component{
  render(){
    return this.props.loggedIn ? <Route {...this.props}/> : <Redirect to="/login"/>
  }
}

const App = () => {
  dataHandler();
  
  return (
    <Provider store={store}>
      <Router>
        <Switch>
          <Route exact path="/" component={Dashboard}/>
          <Route exact path="/login" component={Login}/>

          <PrivateRoute exact path="/admin" component={Admin}/>
        </Switch>
      </Router>
    </Provider>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
