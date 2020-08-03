import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';
import jwt_decode from 'jwt-decode'; // To parse the user's session token
import { setAuthToken } from './util/session_api_util';
import { logout } from './actions/session_actions';

document.addEventListener('DOMContentLoaded', () => {
  let store;

  if (localStorage.jwtToken) { // If returning user has session token stored in localStorage
    setAuthToken(localStorage.jwtToken); // Set token as common header for all axios requests

    const decodedUser = jwt_decode(localStorage.jwtToken); // User's information from decoded token

    const preLoadedState = { session: { isAuthenticated: true, user: decodedUser }};

    store = configureStore(preLoadedState);

    const currentTime = Date.now / 1000;

    if (decodedUser.exp < currentTime) {
      store.dispatch(logout()); // Logout if user's token has expired
      window.location.href = '/login';
    }
  } else {
    store = configureStore({}) // First time user
  }
  ReactDOM.render(
    <Root store={store} />,
    document.getElementById('root')
  );  
});


