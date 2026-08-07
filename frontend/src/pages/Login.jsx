import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import "./Login.module.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";


// отправка данных на сервер 

function Login() {
  const [authErr, setAuthError] = useState(""); // useState("") Создает состояние пустую строку
  // const [значение, функцияИзменения] = useState(начальноеЗначение);
  const navigate = useNavigate();
  
  const handleSubmit = async (values, {setSubmitting}) => {
    try {
      const response = await axios.post("/api/v1/login", values)
      const { token } = response.data;
      if (!token) {
        setAuthError("нет токена");
        return <Navigate to="/login" replace />;
      }
      
      localStorage.setItem("token", token) // localStorage — это встроенное хранилище браузера, записываем в него ключ токен и значение токен
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
    username: "",
    password: "",
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