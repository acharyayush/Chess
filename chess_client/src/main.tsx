import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Offline from './components/Offline';
import Online from './components/Online';
import { Provider } from 'react-redux';
import { store } from './state/store';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}></Route>
          <Route path='/play/offline' element={<Offline />}></Route>
          <Route path='/play/online' element={<Online />}></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
