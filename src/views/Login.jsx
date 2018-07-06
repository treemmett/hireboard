import React, { Component } from 'react';
import './Login.scss';

export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {};
  }

  login = e => {
    e.preventDefault();
  }

  render(){
    return (
      <div className="login">
        <div className="card">
          <form onSubmit={this.login}>
            <fieldset disable={this.state.disabled}>
              <input name="username" placeholder="Username" required/>
              <input name="password" placeholder="Password" type="password" required/>
              <input type="submit" value="Login"/>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
}