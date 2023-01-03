import React from "react";
import AuthForm from "./components/AuthForm";

const Auth = () => {
  return (
    <div
      className='auth-form__container'
      style={{ position: "relative", height: "725px" }}>
      <AuthForm />
    </div>
  );
};

export default Auth;
