import React from 'react';
import ReactDOM from 'react-dom';
import { SidebarProvider } from './components/Sidebar/contexts/SidebarContext';
import { Provider } from 'react-redux';
import store from './redux/store';
import App from './App';

const rootElement = document.getElementById('react-app');

ReactDOM.render(
  <Provider store={store}>
    <SidebarProvider>
      <App />
    </SidebarProvider>
  </Provider>,
  rootElement
);
