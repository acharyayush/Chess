import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ChessGameProvider } from './context/ChessGameContext';
import './index.css';
import Offline from './components/Offline';
import Online from './components/Online';
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChessGameProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>}></Route>
        <Route path='/play/offline' element={<Offline/>}></Route>
        <Route path='/play/online' element={<Online/>}></Route>
      </Routes>
    </BrowserRouter>
    </ChessGameProvider>
  </React.StrictMode>
);
