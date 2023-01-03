import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as yup from "yup";
import { AuthContext } from "../../../context/AuthContext";
import "./AuthForm.css";

const AuthForm = () => {
  const auth = useContext(AuthContext);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [addAvatar, setAddAvatar] = useState(false);
  const [errorFound, setErrorFound] = useState(null);

  const emailValidation = yup.string().required().email();
  // const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState();

  const filePickerRef = useRef();

  useEffect(() => {
    if (!credentials.avatarImage) {
      return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(credentials.avatarImage);
  }, [credentials.avatarImage]);

  const pickedHandler = (event) => {
    let pickedFile;
    const MIME_TYPE_MAP = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
    };
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      const mimeType = pickedFile.type;

      if (MIME_TYPE_MAP[mimeType]) {
        setErrorFound(null);
      } else {
        setErrorFound(`Please Provide a Valid Image Type `);
        return;
      }

      setCredentials({ ...credentials, avatarImage: pickedFile });
    } else {
      setPreviewUrl();
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const onSubmit = (event) => {
    event.preventDefault();
    const fileInput = document.getElementById("image");
    let body = {
      email: credentials.email,
      password: credentials.password,
    };
    if (isLoginMode) {
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, body)
        .then((res) => {
          console.log(res);
          if (res.data.status === "400") {
            setErrorFound(res.data.message);
          }
          auth.login(res.data.message.userId, res.data.message.token);
        })
        .catch((err) => {
          console.log("error", err);
        });
    } else {
      if (addAvatar) {
        if (!fileInput.value) {
          setErrorFound("Please Provide an Image");
          return;
        }
      }
      body = {
        ...body,
        name: credentials.name,
        phone: credentials.phone,
        address: credentials.address,
      };
      const formData = new FormData();

      for (const key in body) {
        formData.append(key, body[key]);
      }
      if (addAvatar) {
        formData.append("avatarImage", credentials.avatarImage);
      }
      axios
        .post(`${process.env.REACT_APP_BACKEND_URL}/user/signup`, formData)
        .then((res) => {
          console.log(res);
          if (res.data.status === "400") {
            setErrorFound(res.data.message);
          }
          auth.login(res.data.message.userId, res.data.message.token);
        })
        .catch((err) => {
          console.log("error", err);
        });
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
    if (event.target.name === "email") {
      emailValidation
        .validate(event.target.value)
        .then(() => event.target.setCustomValidity(""))
        .catch((err) =>
          event.target.setCustomValidity("Please enter a valid email address.")
        );
    }
    if (name === "phone") {
      if (value.length < 10 || value.length > 10) {
        event.target.setCustomValidity("Please enter a valid Phone Number.");
      } else {
        event.target.setCustomValidity("");
      }
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setCredentials({
        ...credentials,
        name: undefined,
        phone: undefined,
        address: undefined,
      });
    } else {
      setCredentials({
        ...credentials,
        name: "",
        phone: "",
        address: "",
      });
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
                <div className='form-control'>
                  {addAvatar && (
                    <>
                      <button
                        className='avatar-image__closeBtn'
                        type='button'
                        onClick={(e) => setAddAvatar(false)}>
                        X
                      </button>
                      <input
                        id='image'
                        ref={filePickerRef}
                        style={{ display: "none" }}
                        type='file'
                        name='image'
                        accept='.jpg,.png,.jpeg'
                        onChange={pickedHandler}
                      />
                      <div className='image-upload center'>
                        <div className='image-upload__preview'>
                          {previewUrl && <img src={previewUrl} alt='Preview' />}
                          {!previewUrl && <p>Please pick an image.</p>}
                        </div>
                        <button type='button' onClick={pickImageHandler}>
                          PICK IMAGE
                        </button>
                      </div>
                    </>
                  )}
                  {!addAvatar && (
                    <button
                      className='avatar-image__addBtn'
                      type='button'
                      onClick={(e) => setAddAvatar(true)}>
                      Add Avatar Image
                    </button>
                  )}
                </div>
                <div className='form-group'>
                  <label htmlFor='name'>Name</label>
                  <input
                    name='name'
                    element='input'
                    type='text'
                    placeholder='Enter Name'
                    value={credentials.name}
                    onChange={handleChange}
                    minLength='3'
                    required></input>
                </div>
                <div className='form-group'>
                  <label htmlFor='name'>Phone</label>
                  <div>
                    <span>+91</span>
                    <input
                      element='input'
                      name='phone'
                      type='number'
                      placeholder='Enter Phone'
                      value={credentials.phone}
                      onChange={handleChange}
                      required></input>
                  </div>
                </div>
                <div className='form-group'>
                  <label htmlFor='name'>Address</label>
                  <input
                    name='address'
                    element='input'
                    type='text'
                    placeholder='Enter Your Address'
                    value={credentials.address}
                    onChange={handleChange}
                    minLength='6'
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
            {errorFound && <p style={{ textAlign: "center" }}>{errorFound}</p>}

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
