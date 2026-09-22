import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const runApp = async () => {
  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      lng: 'ru',
      fallbackLng: 'ru',
      debug: false,
      resources: {
        ru: {
          translation: {
            // Заголовки и названия
            nameChat: 'Hexlet Chat',
            channels: 'Channels',
            error404: '404',

            // Login & Signup
            loginSubmit: 'Войти',
            loginSubmitting: 'Вход...',
            invalidCredentials: 'Неверные имя пользователя или пароль',
            noToken: 'Нет токена',
            registrationBatton: 'Зарегистрироваться',
            registration: 'Регистрация',
            noAcaunt: 'Нет аккаунта?',
            noPage: 'Страница не найдена',

            // Уведомления (Notifications)
            channelCreated: 'Канал создан',
            channelRenamed: 'Канал переименован',
            channelDeleted: 'Канал удалён',
            networkError: 'Ошибка соединения',
            fetchError: 'Ошибка загрузки данных',

            // Модальные окна
            addChannelTitle: 'Добавить канал',
            deleteChannelTitle: 'Удалить канал',
            renameChannelTitle: 'Переименовать канал',
            channelNameRange: 'От 3 до 20 символов',
            channelAlreadyExists: 'Должно быть уникальным',
            namePlaceholder: 'Имя канала',
            channelDeleteQuestion: 'Вы уверены, что хотите удалить этот канал?',
            channelDeleteQuestionSecond: 'Вы уверены, что хотите удалить этот канал?',

            // Кнопки
            logout: 'Выйти',
            login: 'Войти',
            add: 'Отправить',
            delete: 'Удалить',
            rename: 'Переименовать',
            cancel: 'Отмена',
            submit: 'Подтвердить',

            // Формы и поля
            channelName: 'Название канала',
            password: 'Пароль',
            confirmPassword: 'Подтвердите пароль',
            username: 'Имя пользователя',
            nikName: 'Ваш ник',

            // Ошибки валидации
            required: 'Это поле обязательно',
            usernameRange: 'От 3 до 20 символов',
            passwordMin: 'Не менее 6 символов',
            mustMatch: 'Пароли должны совпадать',
            userAlreadyExists: 'Пользователь с таким именем уже существует',
            signupFailed: 'Не удалось зарегистрироваться',
          },
        },
      },
    });

  return i18n;
};

export default runApp;