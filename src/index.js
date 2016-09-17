import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

// This is where the App is bootstrapped.
// We tell the ReactJs library that we want to display our main App component
// inside a specific element in the DOM. In this case, there is a div with id="app"
// inside the index.html file. Our React App component will be injected into here
ReactDOM.render(<App />, document.getElementById('app'));
