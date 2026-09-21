
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Signup.module.css";
import axios from "axios";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice";
import i18next from "i18next";




function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

  
    const [serverError, setServerError] = useState("");
  
    const form = useForm({
        initialValues: {
            name: "",
            password: "",
            confirmPassword: "",
        },
    
        validate: {
          name: (value) => {
              if (!value) {
                  return i18next.t(($) => $.required);
              }

              if (value.length < 3 || value.length > 20) {
                  return i18next.t(($) => $.usernameRange);
              }

              return null;
          },

          password: (value) => {
              if (!value) {
                  return i18next.t(($) => $.required);
              }

              if (value.length < 6) {
                  return i18next.t(($) => $.passwordMin);
              }

              return null;
          },

          confirmPassword: (value, values) => {
              if (!value) {
                  return i18next.t(($) => $.required);
              }

              if (value !== values.password) {
                  return i18next.t(($) => $.mustMatch);
              }

              return null;
          },
      },
  });
    
//  каждое поле является обязательным, имя пользователя от 3 до 20 символов,
//  пароль не менее 6 символов, пароль и его подтверждение должны совпадать. 
// //Сделайте ссылку на страницу регистрации со страницы авторизации.

const handleSubmit = async (values) => {
    setServerError("");

    try {
      const response = await axios.post("/api/v1/signup", {
        username: values.name,
        password: values.password,

      });

          /* в response записался ответ сервера в котором уже есть токен тоже как и имя пользователя и пароль -  :
          response.data = { // достаем токен 
            token: "eyJhbGciOiJIUzI1NiIs...",
            username: "2345678"
          }
          Поэтому:
          response.data.token   -  означает:

          «Возьми token, который сервер положил в свой ответ».*/


      const token = response.data.token; // создали переменнную токен достав значение из ответа сервера 
      localStorage.setItem("token", token); // БРАУЗЕР СОХРАНИЛ ТОКЕН себе тоже 
      dispatch(login(token));



      console.log("Ответ сервера:", response.data);

      navigate("/");

    } catch (error) {
    console.log("ERROR:", error);
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

    if (error.response?.status === 409) {
      setServerError(i18next.t(($) => $.userAlreadyExists));
  } else {
      setServerError(i18next.t(($) => $.signupFailed));
  }
}
};


return (
  <div className={styles.signup}>
      <header className={styles.header}>
          <Link to="/">{i18next.t(($) => $.nameChat)}</Link>
      </header>

      <main className={styles.form}>
          <h1>{i18next.t(($) => $.registration)}</h1>

          <form onSubmit={form.onSubmit(handleSubmit)}>
              <TextInput
                  label={i18next.t(($) => $.username)}
                  {...form.getInputProps("name")}
              />

              <PasswordInput
                  label={i18next.t(($) => $.password)}
                  {...form.getInputProps("password")}
              />

              <PasswordInput
                  label={i18next.t(($) => $.confirmPassword)}
                  {...form.getInputProps("confirmPassword")}
              />

              {serverError && (
                  <div className={styles.error}>
                      {serverError}
                  </div>
              )}

              <Button type="submit">
                  {i18next.t(($) => $.registrationBatton)}
              </Button>
          </form>
      </main>
  </div>
);
}

export default Signup;


//    <TextInput
  //  label="Имя пользователя"
  //  />  --- это поле ввода с подписанным названием - тьак мы пишем все поля для ввода - специальный инпут с названием label="""


/*
<div>                 ← вся страница
│
├── <header>          ← шапка
│     └── 
│
└── <main>            ← основное содержимое
      ├── Регистрация
      └── форма
*/




 