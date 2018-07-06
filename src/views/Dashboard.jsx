import React, { Component } from 'react';
import './Dashboard.scss';

export default class Dashboard extends Component{
  constructor(props){
    super(props);
    this.state = {
      hires: [
        {
          name: 'John Doe',
          ref: 343103,
          location: 'A1',
          manager: 'Jane Doe',
          system: '850 i7',
          montitor: '24" x2',
          phone: 'Softphone',
          assigned: 'Joseph Doe',
          accountSetup: true,
          hardwareSetup: false
        },
        {
          name: 'John Doe',
          ref: 343103,
          location: 'A1',
          manager: 'Jane Doe',
          system: '850 i7',
          montitor: '24" x2',
          phone: 'Softphone',
          assigned: 'Joseph Doe',
          accountSetup: true,
          hardwareSetup: false
        },
        {
          name: 'John Doe',
          ref: 343103,
          location: 'A1',
          manager: 'Jane Doe',
          system: '850 i7',
          montitor: '24" x2',
          phone: 'Softphone',
          assigned: 'Joseph Doe',
          accountSetup: true,
          hardwareSetup: false
        },
        {
          name: 'John Doe',
          ref: 343103,
          location: 'A1',
          manager: 'Jane Doe',
          system: '850 i7',
          montitor: '24" x2',
          phone: 'Softphone',
          assigned: 'Joseph Doe',
          accountSetup: true,
          hardwareSetup: false
        },
      ]
    }
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
                  <th>Phone</th>
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
    {Object.keys(props.data).map((key, index) => <td key={index}>{props.data[key]}</td>)}
  </tr>
);