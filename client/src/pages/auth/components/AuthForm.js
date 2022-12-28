import React, { useState } from "react";
import * as yup from "yup";
import "./AuthForm.css";

const AuthForm = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoginMode, setIsLoginMode] = useState(true);

  const emailValidation = yup.string().required().email();

  const onSubmit = (event) => {
    event.preventDefault();
    let body = {
      email: credentials.email,
      password: credentials.password,
    };
    if (!isLoginMode) {
      body = {
        ...body,
        name: credentials.name,
        phone: credentials.phone,
      };
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
    if (event.target.name === "email") {
      emailValidation
        .validate(event.target.value)
        .then(() => event.target.setCustomValidity(""))
        .catch(
          (err) => console.log(credentials.email),
          event.target.setCustomValidity("Please enter a valid email address.")
        );
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setCredentials({ ...credentials, name: undefined, phone: undefined });
    } else {
      setCredentials(
        {
          ...credentials,
          name: "",
          phone: "",
        },
        false
      );
    }
    setIsLoginMode((pervMode) => !pervMode);
  };

  return (
    <>
      <div className='auth-form-wrapper'>
        <h1>{isLoginMode ? "Login" : "SignUp"}</h1>
        <div className='auth-form-div'>
          <form className='auth-form' onSubmit={onSubmit}>
            {!isLoginMode && (
              <>
                <div className='form-group'>
                  <label htmlFor='name'>Name</label>
                  <input
                    name='name'
                    element='input'
                    type='text'
                    placeholder='Enter Name'
                    value={credentials.name}
                    onChange={handleChange}
                    required></input>
                </div>
                <div className='form-group'>
                  <label htmlFor='name'>Phone</label>
                  <input
                    element='input'
                    name='phone'
                    type='number'
                    placeholder='Enter Phone'
                    value={credentials.phone}
                    onChange={handleChange}
                    required></input>
                </div>
              </>
            )}
            <div className='form-group'>
              <label htmlFor='email'>Email address</label>
              <input
                type='email'
                id='email'
                name='email'
                placeholder='Enter email'
                value={credentials.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className='form-group'>
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                id='password'
                name='password'
                placeholder='Password'
                value={credentials.password}
                onChange={handleChange}
                minLength='6'
                required
              />
            </div>

            <button type='submit'>{isLoginMode ? "Login" : "SignUp"}</button>
          </form>
          <button className='switchForm' onClick={switchModeHandler}>
            Switch to {isLoginMode ? "SignUp" : "Login"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
