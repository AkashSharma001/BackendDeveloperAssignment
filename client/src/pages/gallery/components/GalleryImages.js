import axios from "axios";
import React, { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./GalleryImages.css";

const GalleryImages = ({ images, setDeleting }) => {
  const auth = useContext(AuthContext);

  const handleDeleteImage = (imageId) => {
    setDeleting(true);
    axios
      .delete(
        `${process.env.REACT_APP_BACKEND_URL}/gallery/delete/${auth.userId}/${imageId}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      )
      .then(() => {
        setDeleting(false);
      });
  };

  return images.map((image, index) => (
    <div className='image-grid__container'>
      <img src={image.src} alt={image.alt} key={index} />
      <label>{image.alt}</label>
      <div className='image-grid'>
        <button onClick={() => handleDeleteImage(image.id)}>
          Delete Image
        </button>
      </div>
    </div>
  ));
};

export default GalleryImages;
