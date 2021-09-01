import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import thunk from 'redux-thunk';
import App from './components/App';
import {  BrowserRouter ,Route, Link } from "react-router-dom";

const store = createStore(reducers, applyMiddleware(thunk))
const Index = () => {
  return  (
    <CookiesProvider>
      <Provider store={store}>
      {/*<BrowserRouter>*/}
        <App/>
        {/*</BrowserRouter>*/}
      </Provider>
    </CookiesProvider>
  )
};

ReactDOM.render(<Index />, document.getElementById('page'));