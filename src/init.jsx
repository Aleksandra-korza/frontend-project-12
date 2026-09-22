import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

import runApp from './locales/ru/translation.js';
import { createStore } from './store.js';
import App from './App.jsx';

// Главная асинхронная функция точки входа
const init = async (socket) => {
  await runApp(); // Инициализация i18n / локали
  const store = createStore();

  // ВОЗВРАЩАЕМ виртуальный DOM (JSX)
  return (
    <Provider store={store}>
      <MantineProvider>
        <Notifications position="bottom-right" zIndex={1000} />
        <BrowserRouter>
          <App socket={socket} />
        </BrowserRouter>
      </MantineProvider>
    </Provider>
  );
};

// ОБЯЗАТЕЛЬНО: экспорт по умолчанию
export default init;