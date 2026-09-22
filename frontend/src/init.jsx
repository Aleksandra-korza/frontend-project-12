import { StrictMode } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import * as Sentry from '@sentry/react';

import runApp from './locales/ru/translation.js';
import { createStore } from './store.js';
import App from './App.jsx';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

const init = async (socket) => {
  if (import.meta.env?.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
    });
  }

  await runApp();

  const store = createStore();

  return (
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <MantineProvider>
            <Notifications position="bottom-right" zIndex={1000} />
            <App socket={socket} />
          </MantineProvider>
        </Provider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default init;