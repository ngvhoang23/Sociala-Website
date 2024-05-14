import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';
import { FriendsProvider } from './Context/FriendsContext';
import { CurrentRoomProvider } from './Context/CurrentRoomContext';
import { SocketProvider } from './Context/SocketContext';
import AxiosInterceptorWrapper from './components/AxiosInterceptorWrapper/AxiosInterceptorWrapper';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <FriendsProvider>
      <CurrentRoomProvider>
        <SocketProvider>
          <GlobalStyles>
            <AxiosInterceptorWrapper>
              <App />
            </AxiosInterceptorWrapper>
          </GlobalStyles>
        </SocketProvider>
      </CurrentRoomProvider>
    </FriendsProvider>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
