import React, { useContext, useEffect, useState } from "react";
import "./Gallery.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import GalleryImages from "./components/GalleryImages";
import SearchNUpload from "./components/SearchNUpload";
const Gallery = () => {
  const [images, setImages] = useState([]);
  const auth = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    searchImages(searchQuery);
  };

  const searchImages = async (e) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/gallery/search?q=${searchQuery}&userId=${auth.userId}`,
        {
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        }
      );
      const images = res.data.results.map((image) => ({
        id: image.imageFileName,
        src: `${process.env.REACT_APP_ASSET_URL}/galleryImage%2F${auth.userId}%2F${image.imageFileName}?alt=media`,
        alt: image.imageTitle,
      }));
      setImages(images);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getImages = async () => {
      if (searchQuery === "" && !uploading && !deleting) {
        setIsLoading(true);
        try {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/gallery/images/${auth.userId}`,
            {
              headers: {
                Authorization: "Bearer " + auth.token,
              },
            }
          );
          if (res.data.message.length !== 0) {
            const images = res.data.message.map((image) => ({
              id: image.imageFileName,
              src: `${process.env.REACT_APP_ASSET_URL}/galleryImage%2F${auth.userId}%2F${image.imageFileName}?alt=media`,
              alt: image.imageTitle,
            }));
            setImages(images);
          }
          setIsLoading(false);
        } catch (err) {
          console.error(err);
        }
      }
    };
    getImages();
  }, [uploading, deleting]);

  const Loading = () => {
    return (
      <div>
        <h1 style={{ textAlign: "center" }}>Loading....</h1>
      </div>
    );
  };

  const Deleting = () => {
    return (
      <div>
        <h1>Deleting Image... Please wait</h1>
      </div>
    );
  };

  return (
    <>
      <SearchNUpload
        handleSubmit={handleSubmit}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setUploading={setUploading}
        uploading={uploading}
      />

      <div className='gallery-image-grid__container'>
        {isLoading ? (
          <Loading />
        ) : images.length !== 0 ? (
          deleting ? (
            <Deleting />
          ) : (
            <GalleryImages images={images} setDeleting={setDeleting} />
          )
        ) : (
          <div>
            <h1>No Image Found...</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default Gallery;
