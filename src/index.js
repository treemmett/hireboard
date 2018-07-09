import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect, Provider } from 'react-redux';
import { BrowserRouter as Router, Switch, Redirect, Route } from 'react-router-dom';
import store from './store';
import dataHandler from './utils/dataHandler';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <React.Fragment>
        <Router>
          <Switch>
            <Route exact path="/" component={Dashboard}/>
            <Route exact path="/login" component={Login}/>

            <PrivateRoute exact path="/admin" component={Admin}/>
            <PrivateRoute exact path="/admin/:page" component={Admin}/>
          </Switch>
        </Router>
        <ToastContainer/>
      </React.Fragment>
    </Provider>
  );
}

ReactDOM.render(<App/>, document.getElementById('root'));
