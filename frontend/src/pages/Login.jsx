import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import styles from "./Login.module.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../slices/authSlice.js";

// отправка данных на сервер 

function Login() {
   // Вызов на верхнем уровне функции-компонента
  const navigate = useNavigate();
  const [authErr, setAuthError] = useState(""); // useState("") Создает состояние пустую строку
  // const [значение, функцияИзменения] = useState(начальноеЗначение);
  
  
  const handleSubmit = async (values, {setSubmitting}) => {
    try {
      const response = await axios.post("/api/v1/login", values)
      const { token } = response.data;
      
      if (!token) {
        setAuthError("нет токена");
        return;
      }
      
      localStorage.setItem("token", token) // localStorage — это встроенное хранилище браузера, записываем в него ключ токен и значение токен

      console.log(token);
      navigate("/");
    } catch (error) {
      setAuthError("Неверное имя пользователя или пароль");
      console.log(error);
    } finally {
      setSubmitting(false); // "Отправка закончилась." = значит кнопку перестаем блокировать 
    }

  }


 
  return (
    <div>
      <h1>Login</h1>

      <Formik
  initialValues={{
    username: "admin",
    password: "admin",
  }}
  onSubmit={handleSubmit}
>
  {({ isSubmitting }) => (
    <Form>
      <Field
        name="username"
        type="text"
        placeholder="Username"
      />

      <Field
        name="password"
        type="password"
        placeholder="Password"
      />

      {authErr && <p>{authErr}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Вход..." : "Войти"}
      </button>
    </Form>
  )}
</Formik>
    </div>
  );
}

export default Login;