import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter
import reportWebVitals from './reportWebVitals';
import { Provider } from "react-redux";  // Import Provider
import store from './Components/Store';  // Import the Redux store

// Create root and render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter> 
    {/* Wrap your app with BrowserRouter and Provider */}
    <React.StrictMode>
      <Provider store={store}>  {/* Pass the Redux store to the Provider */}
        <App />
      </Provider>
    </React.StrictMode>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
