import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import styles from "./Login.module.css";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import i18next from "i18next";

function Login() {
  const navigate = useNavigate();
  const [authErr, setAuthError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post("/api/v1/login", values);
      const { token } = response.data;

      if (!token) {
        setAuthError(i18next.t(($) => $.noToken));
        return;
      }

      localStorage.setItem("token", token);
      navigate("/");
    } catch (error) {
      setAuthError(i18next.t(($) => $.invalidCredentials));
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link to="/" className={styles.logo}>{i18next.t(($) => $.nameChat)}</Link>
      </header>

      <div className={styles.cardWrapper}>
        <div className={styles.card}>
          <div className={styles.cardBody}>
            
            {/* SVG Иллюстрация напрямую в коде */}
            <svg 
              className={styles.illustration} 
              viewBox="0 0 200 200" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="100" cy="100" r="80" fill="#EBF8FF" />
              <path d="M60 140 C 60 110, 140 110, 140 140" stroke="#3182CE" strokeWidth="8" strokeLinecap="round" />
              <circle cx="100" cy="85" r="25" stroke="#3182CE" strokeWidth="8" fill="#FFFFFF" />
              <path d="M130 55 L 145 35 M 145 35 L 155 45 M 145 35 L 135 25" stroke="#DD6B20" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className={styles.formContainer}>
              <h1 className={styles.title}>{i18next.t(($) => $.login)}</h1>

              <Formik
                initialValues={{
                  username: "admin",
                  password: "admin",
                }}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className={styles.form}>
                    <div className={styles.fieldGroup}>
                      <label htmlFor="username" className={styles.label}>
                      {i18next.t(($) => $.nikName)}
                      </label>
                      <Field
                        id="username"
                        name="username"
                        type="text"
                        placeholder={i18next.t(($) => $.nikName)}
                        className={`${styles.input} ${authErr ? styles.inputError : ''}`}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label htmlFor="password" className={styles.label}>
                      {i18next.t(($) => $.password)}
                      </label>
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Пароль"
                        className={`${styles.input} ${authErr ? styles.inputError : ''}`}
                      />
                    </div>

                    {authErr && <p className={styles.error}>{authErr}</p>}

                    <button 
                      type="submit" 
                      disabled={isSubmitting} 
                      className={styles.submitBtn}
                    >
                      {isSubmitting 
                        ? i18next.t(($) => $.loginSubmitting) 
                        : i18next.t(($) => $.loginSubmit)}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>

          <div className={styles.cardFooter}>
          {i18next.t(($) => $.noAcaunt)}
            <Link to="/signup">
            {i18next.t(($) => $.registration)}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;