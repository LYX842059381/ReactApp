import React from 'react';
import {StoreContext} from 'redux-react-hook';
import {createStore} from 'redux';
import Routers from '@/router';
import reducer from '@/reducer';
import 'normalize.css';


const store = __DEV__
  ? createStore(reducer, require('redux-devtools-extension/developmentOnly').composeWithDevTools()) // eslint-disable-line
  : createStore(reducer);

const App = () => {
  return (
    <StoreContext.Provider value={store}>
      <Routers/>
    </StoreContext.Provider>
  );
};

export default App;
