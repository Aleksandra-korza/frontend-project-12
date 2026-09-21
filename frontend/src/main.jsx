import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import * as Sentry from '@sentry/react';
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { MantineProvider } from '@mantine/core'; // 1. Импортируем MantineProvider
import { store } from './store';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import App from './App.jsx';

import runApp from "./locales/ru/translation";
import { Notifications } from '@mantine/notifications';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
});

await runApp();

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        {/* 2. Оборачиваем App в MantineProvider */}
        <MantineProvider>
          {/* 3. Добавляем компонент Notifications с указанием позиции */}
          <Notifications position="bottom-right" zIndex={1000} />
          <App />
        </MantineProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>
);