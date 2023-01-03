import axios from "axios";
import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./SearchNUpload.css";

const SearchNUpload = ({
  handleSubmit,
  searchQuery,
  setSearchQuery,
  uploading,
  setUploading,
}) => {
  const [previewUrl, setPreviewUrl] = useState([]);
  const [errorFound, setErrorFound] = useState(null);
  const [uploadingImages, setUploadingImages] = useState([]);
  const filePickerRef = useRef();

  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const pickedHandler = (event) => {
    const pickedFiles = [...previewUrl];

    const files = event.target.files;
    const MIME_TYPE_MAP = {
      "image/png": "png",
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mimeType = file.type;

      if (MIME_TYPE_MAP[mimeType]) {
        setErrorFound(null);
      } else {
        setErrorFound(`Please Provide a Valid Image Type `);
        return;
      }
    }
    setUploadingImages([...uploadingImages, ...files]);
    for (let i = 0; i < files.length; i++) {
      pickedFiles.push({
        fileName: files[i].name,
        fileUrl: URL.createObjectURL(files[i]),
      });
    }
    setPreviewUrl(pickedFiles);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  const auth = useContext(AuthContext);
  const handleDeleteImage = (index) => {
    const newPreviewUrl = [...previewUrl];
    const newImage = [...uploadingImages];

    newPreviewUrl.splice(index, 1);
    newImage.splice(index, 1);
    setPreviewUrl(newPreviewUrl);
    setUploadingImages(newImage);
    filePickerRef.current.value = "";
  };

  const handleDeleteImages = (e) => {
    setPreviewUrl([]);
    setUploadingImages([]);
    filePickerRef.current.value = "";
  };

  const handleUploadImages = (event) => {
    event.preventDefault();

    const formData = new FormData();

    for (let i = 0; i < uploadingImages.length; i++) {
      formData.append("images", uploadingImages[i]);
    }
    setUploading(true);
    console.log(formData.getAll("images"));
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/gallery/upload/${auth.userId}`,
        formData,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      )
      .then((res) => {
        setUploading(false);
        setPreviewUrl([]);
        setUploadingImages([]);
        filePickerRef.current.value = "";
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const Uploading = () => {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Uploading... Please wait</h1>
      </div>
    );
  };

  return (
    <>
      <form className='search-form' onSubmit={handleSubmit}>
        <input
          type='text'
          value={searchQuery}
          onChange={handleChange}
          placeholder='Search images by title'
        />
        <button className='searchBtn' type='submit'>
          Search
        </button>
        <button
          style={{}}
          className='add-image__Btn'
          type='button'
          onClick={pickImageHandler}>
          Add New Images
        </button>
        <input
          id='image-upload'
          ref={filePickerRef}
          style={{ display: "none" }}
          type='file'
          name='image'
          multiple
          accept='.jpg,.png,.jpeg'
          onChange={pickedHandler}
        />
      </form>
      {previewUrl.length !== 0 &&
        (uploading ? (
          <Uploading />
        ) : (
          <div className='form-control'>
            <div className='image-upload center'>
              <div className='image-upload-grid__container'>
                {previewUrl.map((preview, index) => (
                  <div className='image-upload-grid'>
                    <div className='preview-image'>
                      <img src={preview.fileUrl} key={index} alt='Preview' />
                      <button onClick={() => handleDeleteImage(index)}>
                        X
                      </button>
                    </div>
                    <label>{preview.fileName}</label>
                  </div>
                ))}
              </div>

              <div className='image-upload__action'>
                <div className='image-upload__info'>
                  {errorFound && (
                    <p style={{ textAlign: "center" }}>{errorFound}</p>
                  )}
                  <button
                    className='uploadBtn'
                    type='button'
                    onClick={handleUploadImages}>
                    Upload Images
                  </button>
                  <button
                    className='deleteBtn'
                    type='button'
                    onClick={handleDeleteImages}>
                    Delete Images
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </>
  );
};
export default SearchNUpload;
