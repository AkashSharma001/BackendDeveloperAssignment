import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import "./EditProfile.css";
import { AuthContext } from "../../../context/AuthContext";

const EditProfile = ({
  credentials,
  setCredentials,
  setIsEditing,
  setIsLoading,
  userId,
}) => {
  const auth = useContext(AuthContext);
  const [addAvatar, setAddAvatar] = useState(false);

  const [previewUrl, setPreviewUrl] = useState();
  const [pickedFile, setPickedFile] = useState();
  const [errorFound, setErrorFound] = useState(null);
  const filePickerRef = useRef();

  const pickedHandler = (event) => {
    let file;
    const MIME_TYPE_MAP = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
    };
    if (event.target.files && event.target.files.length === 1) {
      file = event.target.files[0];
      const mimeType = file.type;

      if (MIME_TYPE_MAP[mimeType]) {
        setErrorFound(null);
      } else {
        setErrorFound(`Please Provide a Valid Image Type `);
        return;
      }
      setPreviewUrl(URL.createObjectURL(file));
      setPickedFile(file);
    } else {
      setPreviewUrl();
    }
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const fileInput = document.getElementById("image");
    let body = {
      name: credentials.name,
      address: credentials.address,
    };
    if (!addAvatar) {
      axios
        .put(`${process.env.REACT_APP_BACKEND_URL}/user/${auth.userId}`, body, {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        })
        .then((res) => {
          setIsLoading(false);
          setIsEditing(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log("error", err);
        });
    } else {
      if (addAvatar) {
        if (!fileInput.value) {
          setErrorFound("Please Provide an Image");
          setIsLoading(false);

          return;
        }
      }
      const formData = new FormData();
      body = {
        ...body,
        avatarImage: credentials.avatarImage,
      };

      for (const key in body) {
        formData.append(key, body[key]);
      }
      if (addAvatar) {
        formData.append("avatarImage", pickedFile);
      }

      axios
        .put(
          `${process.env.REACT_APP_BACKEND_URL}/user/${auth.userId}`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + auth.token,
            },
          }
        )
        .then((res) => {
          if (res.data.status === "400") {
            setErrorFound(res.data.message);
            setIsLoading(false);

            return;
          }
          setIsEditing(false);
          setIsLoading(false);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials({ ...credentials, [name]: value });
  };

  return (
    <>
      <div className='edit-form-wrapper'>
        <h1>Edit Profile</h1>
        <div className='edit-form-div'>
          <form className='edit-form' onSubmit={handleSubmit}>
            <>
              <div className='avatar-image__container'>
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
                      <button
                        style={{ width: "13rem" }}
                        type='button'
                        onClick={pickImageHandler}>
                        PICK IMAGE
                      </button>
                    </div>
                  </>
                )}
                {!addAvatar && (
                  <>
                    {!!credentials.avatarImage && (
                      <img
                        className='avatar-image__preview'
                        src={`${process.env.REACT_APP_ASSET_URL}/avatarImage%2F${userId}%2F${credentials.avatarImage}?alt=media`}
                        alt='User Avatar'
                      />
                    )}
                    <button
                      className='avatar-image__addBtn'
                      onClick={() => setAddAvatar(true)}>
                      Add New Avatar
                    </button>
                  </>
                )}
              </div>
              <div className='form-group' style={{ marginTop: "10px" }}>
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
            {errorFound && <p style={{ textAlign: "center" }}>{errorFound}</p>}

            <button className='saveBtn' type='submit'>
              Save
            </button>
            <button
              style={{
                marginBottom: "5%",
                backgroundColor: "#e71d36",
                borderColor: "#e71d36",
              }}
              type='button'
              onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProfile;
