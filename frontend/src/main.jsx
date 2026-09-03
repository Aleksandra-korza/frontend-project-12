import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from '@mantine/core'; // 1. Импортируем MantineProvider
import { store } from './store';

import '@mantine/core/styles.css';
import './index.css';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {/* 2. Оборачиваем App в MantineProvider */}
        <MantineProvider>
          <App />
        </MantineProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);