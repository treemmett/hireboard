import React, { Component } from 'react';
import serialize from '../utils/serialize';
import './Admin.scss';

export default class Admin extends Component{
  constructor(props){
    super(props);

    this.state = {
      selected: '',
      addingNew: false
    }
  }

  render(){
    const userData = [{
      username: 'temmett',
      firstName: 'Tregan',
      lastName: 'Emmett'
    },{
      username: 'apack',
      firstName: 'Austin',
      lastName: 'Pack'
    },{
      username: 'dmccloud',
      firstName: 'Davin',
      lastName: 'McCloud'
    }];

    // Map user
    const users = userData.map((user, index) => <User onClick={e => {e.stopPropagation(); this.setState({selected: user.username})}} data={user} key={index} selected={this.state.selected === user.username}/>);

    return (
      <div className="admin" onClick={() => this.setState({selected: ''})}>
        {this.state.addingNew ? <Modal close={() => this.setState({addingNew: false})}/> : null}
        <div className="head">
          <span className="title">Technicians</span>
          <div className="btn" onClick={() => this.setState({addingNew: true})}>Add New +</div>
        </div>
        <div className="table">
          <div className="header">
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="body">
            <table>
              <tbody>
                {users}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const User = props => (
  <tr onClick={props.onClick} className={props.selected ? 'selected' : ''}>
    <td>{props.data.username}</td>
    <td>{props.data.firstName}</td>
    <td>{props.data.lastName}</td>
  </tr>
);

class Modal extends Component{
  constructor(props){
    super(props);
    this.state = {
      disabled: false
    }
  }

  save = e => {
    e.preventDefault();
    const data = serialize(e.target);
    console.log(data);
  }

  render(){
    return (
    <div className="modal" onClick={this.props.close}>
      <div className="modalCard" onClick={e => e.stopPropagation()}>
        <form onSubmit={this.save}>
          <fieldset disabled={this.state.disabled}>
            <input name="username" placeholder="Username" required/>
            <input name="firstName" placeholder="First Name" required/>
            <input name="lastName" placeholder="Last Name" required/>
            <input type="submit" value="Save"/>
          </fieldset>
        </form>
      </div>
    </div>
    );
  }
}