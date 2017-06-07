import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Provider from 'react-redux/lib/components/Provider';
import browserHistory from 'react-router/lib/browserHistory';
import Router from 'react-router/lib/Router';
//import App from './containers/Dashboard'
import configureStore from './store/index';
import routesFull from './routes';
import './styles/app.css';

const store = configureStore(window.__INITIAL_STATE__);
delete window.__INITIAL_STATE__;
const history = browserHistory;
let routes = routesFull;

console.log('CORE_URL: ' + process.env.CORE_URL);
let state = store.getState();
console.log(state.user);

ReactDOM.render(
    <Provider store={store}>
        <Router routes={routes(state.user)} history={history} />
    </Provider>,
    document.getElementById('root')
);
