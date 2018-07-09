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

  render(){
    const pageSettings = {
      hires: {
        title: 'New Hires',
        data: 'hires',
        url: '/hires',
        dispatchEvent: 'HIRE',
        deleteAll: e => {
          if(!window.confirm('Are you sure you want to delete all hires? This can\'t be undone')){
            return;
          }

          api.delete('/hires').then(e => {
            this.props.dispatch({
              type: 'RESET_HIRES'
            });
          }).catch(()=>{});
        },
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
              }).catch(() => {});
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
              }).catch(() => {});
            }
          }
        ],
        form: [
          {
            name: 'name',
            label: 'Name',
            required: true
          },
          {
            name: 'ref',
            label: 'Reference',
            required: true
          },
          {
            name: 'location',
            label: 'Location'
          },
          {
            name: 'system',
            label: 'System'
          },
          {
            name: 'monitors',
            label: 'Monitors'
          },
          {
            name: 'manager',
            label: 'Manager'
          },
          {
            name: 'assigned',
            label: 'Assigned',
            type: 'select',
            options: this.props.techs,
            value: 'username',
            optionLabel: 'firstName'
          },
          {
            name: 'accountSetup',
            label: 'Account Setup',
            type: 'checkbox'
          },
          {
            name: 'hardwareDeployed',
            label: 'Hardware Deployed',
            type: 'checkbox'
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
            label: 'Username',
            required: true
          },
          {
            name: 'firstName',
            label: 'First Name',
            required: true
          },
          {
            name: 'lastName',
            label: 'Last Name',
            required: true
          }
        ]
      }
    }

    // Get reference to current data set
    const dataset = pageSettings[this.props.match.params.page || 'hires'];

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
          {dataset.deleteAll ? <div className="btn red" onClick={dataset.deleteAll}>Delete All</div> : null}
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
          <td key={index}>
            <input onClick={e => e.stopPropagation()} onChange={e => key.change(e, props.data)} type="checkbox" checked={props.data[key.name]}/>
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
    }).catch(() => {});
  }

  delete = e => {
    if(!window.confirm('Are you sure you want to delete this item? This can\'t be undone.')){
      return;
    }

    // Make request
    api.delete(this.props.dataset.url + '/' + this.props.data._id)
    .then(res => {
      this.props.dispatch({
        type: 'REMOVE_' + this.props.dataset.dispatchEvent,
        payload: this.props.data._id
      });
      this.props.close();
    }).catch(() => {});
  }

  render(){
    const isUpdate = Object.keys(this.props.data).length;

    // Render inputs
    const inputs = this.props.dataset.form.map((input, index) => {
      let r = null;
      const id = Math.floor(Math.random() * 1000);

      switch(input.type){
        case 'checkbox': {
          r = (
            <div className="checkboxContainer" key={index}>
              <input id={id} type="checkbox" name={input.name} defaultChecked={this.props.data[input.name]}/>
              <label htmlFor={id} className="checkbox"/>
              <label htmlFor={id} className="label">{input.label}</label>
            </div>
          );
          break;
        }

        case 'select': {
          // Render options
          const options = input.options.map((item, index) => <option key={index} value={item[input.value]}>{item[input.optionLabel]}</option>);

          // Add blank field to options
          options.unshift(<option key="-1" value=""/>);

          r = (
            <React.Fragment key={index}>
              <label htmlFor={id}>{input.label}</label>
              <select id={id} name={input.name} defaultValue={this.props.data[input.name]}>{options}</select>
            </React.Fragment>
          );
          break;
        }

        default: {

          r = (
            <React.Fragment key={index}>
              <label htmlFor={id}>{input.label}</label>
              <input id={id} type={input.type} name={input.name} defaultValue={this.props.data[input.name]} required={input.required}/>
            </React.Fragment>
          );
          break;
        }
      }

      return r;
    });

    return (
    <div className="modal" onClick={e => {e.stopPropagation(); this.props.close()}}>
      <div className="modalCard" onClick={e => e.stopPropagation()}>
        <form onSubmit={this.save}>
          <fieldset disabled={this.state.disabled}>
            {inputs}
            <div className="buttons">
              {isUpdate ? <div className="btn red" onClick={this.delete}>Delete</div> : null}
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