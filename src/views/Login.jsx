import React, { Component } from 'react';
import api from '../utils/api';
import serialize from '../utils/serialize';
import { toast } from 'react-toastify';
import './Login.scss';

export default class Login extends Component{
  constructor(props){
    super(props);
    this.state = {};
    this.token = null;
  }

  login = e => {
    e.preventDefault();
    const data = serialize(e.target);
    
    api.post('/login', data).then(res => {
      if(res.data.mustChangePassword){
        // Save token in temp memory
        this.token = localStorage.authToken;

        // Remove any cached tokens
        localStorage.removeItem('authToken');

        this.props.history.push('/login/changepassword');
        return;
      }
      this.props.history.push('/admin');
    }).catch(() => {});
  }

  changePassword = e => {
    e.preventDefault();
    const data = serialize(e.target);

    // Check if passwords match
    if(data.password !== data.password1){
      toast.info('Passwords don\'t match');
      return;
    }

    // Send request to change password
    api({
      method: 'PUT',
      url: '/login/changepassword',
      headers: {
        authorization: 'Bearer '+this.token
      },
      data: data
    }).then(() => this.props.history.push('/admin')).catch(()=>{});
  }

  render(){
    return (
      <div className="login">
        <div className="card">
          {/changepassword\/?/i.test(this.props.location.pathname) && this.token
          
            ? 
          
            <form onSubmit={this.changePassword}>
              <div className="title">Password change is required</div>
              <fieldset disable={this.state.disabled}>
                <input name="password" placeholder="Password" type="password" required/>
                <input name="password1" placeholder="Confirm Password" type="password" required/>
                <input className="btn" type="submit" value="Change Password"/>
              </fieldset>
            </form>

            :

            <form onSubmit={this.login}>
              <fieldset disable={this.state.disabled}>
                <input name="username" placeholder="Username" required/>
                <input name="password" placeholder="Password" type="password" required/>
                <input className="btn" type="submit" value="Login"/>
              </fieldset>
            </form>
          }
        </div>
      </div>
    );
  }
}