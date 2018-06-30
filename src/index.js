import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducer from './reducers';
import UserContainer from './components/user_container';

import '../style/style.scss';

/* eslint-disable no-underscore-dangle */
const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
/* eslint-enable */

ReactDOM.render(
  <Provider store={store}>
    <UserContainer />
  </Provider>,
  document.querySelector('#root'),
);
