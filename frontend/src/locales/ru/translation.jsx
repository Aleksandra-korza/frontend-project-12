// Инициализация, выполняется ровно один раз в асинхронной функции, запускающей приложение
import i18next from "i18next";

const runApp = async () => {
  await i18next.init({
    lng: "ru",
    debug: true,
    resources: {
      ru: {
        translation: {
          // Заголовки и названия
          nameChat: "Hexlet Chat",
          channels: "Channels",
          error404: "404",
          // Login:
          loginSubmit: "Войти",
          loginSubmitting: "Вход...",
          invalidCredentials: "Неверные имя пользователя или пароль",
          noToken: "Нет токена",
          // Уведомления (Notifications)
          channelCreated: "Канал создан",
          channelRenamed: "Канал переименован",
          channelDeleted: "Канал удален",
          networkError: "Ошибка соединения",
          fetchError: "Ошибка загрузки данных",
          // Дополнительно для Home / Модальных окон
          addChannelTitle: "Добавить канал",
          deleteChannelTitle: "Удалить канал",
          renameChannelTitle: "Переименовать канал",
          channelNameRange: "От 3 до 20 символов",
          channelAlreadyExists: "Должно быть уникальным",
          namePlaceholder: "Имя канала",
          // Кнопки
          logout: "Выйти",
          login: "Войти", 
          add: "Добавить",
          delete: "Удалить",
          rename: "Переименовать",
          cancel: "Отмена",
          submit: "Подтвердить",
          registrationBatton: "Зарегистрироваться", // исправлена опечатка
          // Сообщения
          channelDeleteQuestion: "Вы уверены, что хотите удалить этот канал?",
          channelDeleteQuestionSecond: "Вы уверены, что хотите удалить этот канал?",
          noAcaunt: "Нет аккаунта?",
          noPage: "Страница не найдена",
          // Формы и поля
          channelName: "Название канала",
          password: "Пароль",
          confirmPassword: "Подтвердите пароль", // ДОБАВЛЕНО
          username: "Имя пользователя",
          nikName: "Ваш ник",
          // Ошибки валидации (ДОБАВЛЕНО)
          required: "Это поле обязательно",
          usernameRange: "От 3 до 20 символов",
          passwordMin: "Не менее 6 символов",
          mustMatch: "Пароли должны совпадать",
          userAlreadyExists: "Пользователь с таким именем уже существует",
          signupFailed: "Не удалось зарегистрироваться",
          // Линки
          registration: "Регистрация",
        },
      },
    },
  });
};

export default runApp;

// Где-то в коде приложения обращаемся к ключу (key)
// Библиотека по умолчанию ищет так: <текущий язык>.translation.<ключ> => ru.translation.key
// {i18next.t(($) => $.registration)} // "Hexlet Chat"

