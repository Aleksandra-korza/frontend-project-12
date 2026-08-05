import React from "react";
import { Formik, Field, Form } from "formik";
import "./Login.module.css";

function Login() {
  return (
    <div>
      <h1>Login</h1>
      <Formik
        initialValues={{ name: "", email: "" }}
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          alert(JSON.stringify(values, null, 2));
        }}
      >
        <Form>
          <Field name="name" type="text" placeholder="Name"/>
          <Field name="password" type="password" placeholder="Password" />
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}
export default Login;
