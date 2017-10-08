import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/Main';

let rootEle = document.getElementById('app');

// Render the main component into the dom
ReactDOM.render(<App />, rootEle);

