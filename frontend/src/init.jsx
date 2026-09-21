import { StrictMode } from 'react';
import * as Sentry from '@sentry/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import { createStore } from './store.js';
import runApp from './locales/ru/translation.jsx';
import App from './App.jsx';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

// Тесты Хекслета передают сокет аргументом в функцию init()
const init = async (socketInstance) => {
  if (import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
    });
  }

  await runApp();

  const store = createStore();

  // ВОЗВРАЩАЕМ VDOM (НЕ вызываем ReactDOM.createRoot здесь)
  return (
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <MantineProvider>
            <Notifications position="bottom-right" zIndex={1000} />
            <App socket={socketInstance} />
          </MantineProvider>
        </Provider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default init;