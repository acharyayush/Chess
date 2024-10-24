import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';
import Offline from './pages/Offline';
import Online from './pages/Online';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { store } from './state/store';
import AskNameForTwoPlayer from './components/AskNameForTwoPlayer';
import AI from './pages/AI';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<App />}></Route>
          <Route
            path='/play/offline/askName'
            element={<AskNameForTwoPlayer />}
          ></Route>
          <Route path='/play/offline' element={<Offline />}></Route>
          <Route path='/play/online' element={<Online />}></Route>
          <Route path='/play/ai' element={<AI />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);
