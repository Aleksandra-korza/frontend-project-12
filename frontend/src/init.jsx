import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import * as Sentry from '@sentry/react';

import { createStore } from './store.js';
import runApp from './locales/ru/translation.jsx';
import App from './App.jsx';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

const init = async () => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
    });
  }

  await runApp();

  const store = createStore();

  // Возвращаем разметку (VDOM), НЕ вызывая ReactDOM.createRoot здесь
  return (
    <BrowserRouter>
      <Provider store={store}>
        <MantineProvider>
          <Notifications position="bottom-right" zIndex={1000} />
          <App />
        </MantineProvider>
      </Provider>
    </BrowserRouter>
  );
};

export default init;