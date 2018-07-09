import React, { Component } from 'react';
import api from '../utils/api';
import serialize from '../utils/serialize';
import './Login.scss';

export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  login = e => {
    e.preventDefault();
    const data = serialize(e.target);
    
    api.post('/login', data).then(() => this.props.history.push('/admin')).catch(() => {});
  }

  render(){
    return (
      <div className="login">
        <div className="card">
          <form onSubmit={this.login}>
            <fieldset disable={this.state.disabled}>
              <input name="username" placeholder="Username" required/>
              <input name="password" placeholder="Password" type="password" required/>
              <input className="btn" type="submit" value="Login"/>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}