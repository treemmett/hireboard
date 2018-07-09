import React, { Component } from 'react';
import './Dashboard.scss';

export default class Dashboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      hires: []
    }
  }

  componentDidMount(){
    // Setup websocket connection
    const ws = new WebSocket('ws://'+window.location.hostname+':8081');
    console.log(ws);

    ws.onopen = () => {
      console.log('WebSocket connected...');
    }

    ws.onmessage = msg => this.setState({hires: JSON.parse(msg.data)});
  }

  render(){
    const mappedRows = this.state.hires.map((hire, index) => <Person key={index} data={hire}/>);

    return (
      <div className="dashboard">
        <div className="table">
          <div className="header">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reference</th>
                  <th>Location</th>
                  <th>Manager</th>
                  <th>System</th>
                  <th>Monitor</th>
                  <th>Assigned</th>
                  <th>Account Setup</th>
                  <th>Hardware Setup</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="body">
            <table>
              <tbody>
                {mappedRows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

const Person = props => (
  <tr>
    <td>{props.data.name}</td>
    <td>{props.data.ref}</td>
    <td>{props.data.location}</td>
    <td>{props.data.manager}</td>
    <td>{props.data.system}</td>
    <td>{props.data.monitors}</td>
    <td>{props.data.assigned}</td>
    <td>{props.data.accountSetup ? '✓' : ''}</td>
    <td>{props.data.hardwareDeployed ? '✓' : ''}</td>
  </tr>
);