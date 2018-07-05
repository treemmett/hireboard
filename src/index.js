import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';

const App = () => (
  <Provider store={store}>
    <div>My App</div>
  </Provider>
);

ReactDOM.render(<App/>, document.getElementById('root'));
