import api from '../utils/api';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import serialize from '../utils/serialize';
import './Admin.scss';

@connect(store => {
  return {
    hires: store.hires.data,
    techs: store.techs.data
  }
})
export default class Admin extends Component{
  constructor(props){
    super(props);

    this.state = {
      modal: false,
      dropdown: false
    }
  }

  pageSettings = {
    hires: {
      title: 'New Hires',
      data: 'hires',
      url: '/hires',
      dispatchEvent: 'HIRE',
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
        'name',
        'ref',
        'location',
        'system',
        'monitors',
        'manager',
        'assigned',
        {
          type: 'checkbox',
          name: 'accountSetup',
          change: (e, data) => {
            api.put('/hires/'+data._id, {accountSetup: e.target.checked}).then(res => {
              this.props.dispatch({
                type: 'UPDATE_HIRE',
                payload: res.data
              });
            });
          }
        },
        {
          type: 'checkbox',
          name: 'hardwareDeployed',
          change: (e, data) => {
            api.put('/hires/'+data._id, {hardwareDeployed: e.target.checked}).then(res => {
              this.props.dispatch({
                type: 'UPDATE_HIRE',
                payload: res.data
              });
            });
          }
        }
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
      dispatchEvent: 'TECH',
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
    const data = this.props[dataset.data].map((item, index) => <Row open={() => this.setState({modal: item})} data={item} keys={dataset.keys} key={index}/>);
    
    return (
      <div className="admin" onClick={() => this.setState({dropdown: false})}>
        {this.state.modal ? <Modal dataset={dataset} data={typeof this.state.modal === 'object' ? this.state.modal : {}} dispatch={this.props.dispatch} close={() => this.setState({modal: false})}/> : null}
        <div className="head">
          <div onClick={e => {e.stopPropagation(); this.setState({dropdown: !this.state.dropdown})}} className={classNames('title', {expanded: this.state.dropdown})}>
            {dataset.title}
            <div className="arrow">▼</div>
            <div className="dropdown">
              <Link to="/admin">New Hires</Link>
              <Link to="/admin/techs">Technicians</Link>
            </div>
          </div>
          <div className="btn primary" onClick={() => this.setState({modal: true})}>Add New +</div>
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
  const columns = props.keys.map((key, index) => {
    let r = null;

    switch(key.type){
      case 'checkbox': {
        r = (
          <td key={index} onClick={e => e.stopPropagation()}>
            <input onChange={e => key.change(e, props.data)} type="checkbox" checked={props.data[key.name]}/>
          </td>
        );
        break;
      }

      default: {
        r = <td key={index}>{props.data[key]}</td>;
        break;
      }
    }

    return r;
  });

  return (
    <tr onClick={props.open}>{columns}</tr>
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

    const isUpdate = Object.keys(this.props.data).length;

    console.log(isUpdate);

    // Make request
    api({
      method: isUpdate ? 'PUT' : 'POST',
      url: isUpdate ? this.props.dataset.url + '/' + this.props.data._id : this.props.dataset.url,
      data: data
    })
    .then(res => {
      this.props.dispatch({
        type: (isUpdate ? 'UPDATE_' : 'ADD_') + this.props.dataset.dispatchEvent,
        payload: res.data
      });
      this.props.close();
    });
  }

  render(){
    console.log(this.props.data);

    // Render inputs
    const inputs = this.props.dataset.form.map((input, index) => <input key={index} type={input.type} name={input.name} placeholder={input.placeholder} defaultValue={this.props.data[input.name]} required={input.required}/>);

    return (
    <div className="modal" onClick={e => {e.stopPropagation(); this.props.close()}}>
      <div className="modalCard" onClick={e => e.stopPropagation()}>
        <form onSubmit={this.save}>
          <fieldset disabled={this.state.disabled}>
            {inputs}
            <div className="buttons">
              <div className="btn" onClick={e => {e.stopPropagation(); this.props.close()}}>Close</div>
              <input className="btn primary" type="submit" value="Save"/>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
    );
  }
}