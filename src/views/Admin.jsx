import api from '../utils/api';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import serialize from '../utils/serialize';
import './Admin.scss';

@connect(store => {
  return {
    techs: store.techs.data
  }
})
export default class Admin extends Component{
  constructor(props){
    super(props);

    this.state = {
      addingNew: false,
      dropdown: false
    }
  }

  pageSettings = {
    hires: {
      title: 'New Hires',
      data: 'techs', // Temporary, until hire store is setup
      url: '/hires',
      headers: [
        'Name',
        'Reference',
        'Location',
        'System',
        'Monitors',
        'Manager',
        'Assigned',
        'Account Setup',
        'Hardware Deployed'
      ],
      keys: [
        null,
        null,
        null,
        null,
        null,
        null,
        'username',
        null,
        null
      ],
      form: [
        {
          name: 'name',
          placeholder: 'Name',
          required: true
        },
        {
          name: 'ref',
          placeholder: 'Reference',
          required: true
        },
        {
          name: 'location',
          placeholder: 'Location'
        },
        {
          name: 'system',
          placeholder: 'System'
        },
        {
          name: 'monitors',
          placeholder: 'Monitors'
        },
        {
          name: 'manager',
          placeholder: 'Manager'
        },
        {
          name: 'assigned',
          placeholder: 'Assigned'
        },
        {
          name: 'accountSetup',
          placeholder: 'Account Setup'
        },
        {
          name: 'hardwareDeployed',
          placeholder: 'Hardware Deployed'
        }
      ]
    },
    techs: {
      title: 'Technicians',
      data: 'techs',
      url: '/techs',
      headers: [
        'Username',
        'First Name',
        'Last Name'
      ],
      keys: [
        'username',
        'firstName',
        'lastName'
      ],
      form: [
        {
          name: 'username',
          placeholder: 'Username',
          required: true
        },
        {
          name: 'firstName',
          placeholder: 'First Name',
          required: true
        },
        {
          name: 'lastName',
          placeholder: 'Last Name',
          required: true
        }
      ]
    }
  }

  render(){
    // Get reference to current data set
    const dataset = this.pageSettings[this.props.match.params.page || 'hires'];

    // Map headers
    const headers = dataset.headers.map((header, index) => <th key={index}>{header}</th>);

    // Map data
    const data = this.props[dataset.data].map((user, index) => <Row data={user} keys={dataset.keys} key={index}/>);
    
    return (
      <div className="admin" onClick={() => this.setState({dropdown: false})}>
        {this.state.addingNew ? <Modal dataset={dataset} dispatch={this.props.dispatch} close={() => this.setState({addingNew: false})}/> : null}
        <div className="head">
          <div onClick={e => {e.stopPropagation(); this.setState({dropdown: !this.state.dropdown})}} className={classNames('title', {expanded: this.state.dropdown})}>
            {dataset.title}
            <div className="arrow">▼</div>
            <div className="dropdown">
              <Link to="/admin">New Hires</Link>
              <Link to="/admin/techs">Technicians</Link>
            </div>
          </div>
          <div className="btn" onClick={() => this.setState({addingNew: true})}>Add New +</div>
        </div>
        <div className="table">
          <div className="header">
            <table>
              <thead>
                <tr>{headers}</tr>
              </thead>
            </table>
          </div>
          <div className="body">
            <table>
              <tbody>
                {data}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const Row = props => {
  const columns = props.keys.map((key, index) => <td key={index}>{props.data[key]}</td>);

  return (
    <tr>{columns}</tr>
  );
}

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

    // Make request
    api.post(this.props.dataset.url, data)
      .then(res => {
        this.props.dispatch({
          type: 'ADD_TECH',
          payload: res.data
        });
        this.props.close();
      });
  }

  render(){
    // Render inputs
    const inputs = this.props.dataset.form.map((input, index) => <input key={index} type={input.type} name={input.name} placeholder={input.placeholder} required={input.required}/>);

    return (
    <div className="modal" onClick={this.props.close}>
      <div className="modalCard" onClick={e => e.stopPropagation()}>
        <form onSubmit={this.save}>
          <fieldset disabled={this.state.disabled}>
            {inputs}
            <input className="btn" type="submit" value="Save"/>
          </fieldset>
        </form>
      </div>
    </div>
    );
  }
}