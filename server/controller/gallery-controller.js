const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  fileDelete,
  galleryImagesUpload,
} = require("../middleware/file-manage");

//Gallery Images RELATED API

//Add Image
const addGalleryImages = async (req, res) => {
  const images = [];
  for (let i = 0; i < req.files.length; i++) {
    images.push({
      imageTitle: req.files[i].originalname,
      imageFileName: await galleryImagesUpload(req, res, i, req.params.id),
    });
  }

  try {
    await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          images: { $each: images },
        },
      },
      { useFindAndModify: false }
    );
    res
      .status(200)
      .send({ status: "200", message: "Successfully Uploaded Images" });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
};

//Get User Uploaded Image
const getGalleryImages = async (req, res) => {
  try {
    const results = await User.findById(req.params.id).exec();
    res.status(200).send({ status: "200", message: results.images });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
};

//Search images with titles for the specified user
const searchGalleryImage = async (req, res) => {
  const userId = req.query.userId;
  const searchQuery = req.query.q;

  const searchRegex = new RegExp(searchQuery, "i");

  await User.findById({ _id: userId }, (error, results) => {
    if (error) {
      res.status(500).send({ error: "Error searching for images" });
    } else {
      const matchingImages = results.images.filter((image) =>
        image.imageTitle.match(searchRegex)
      );
      res.status(200).send({ results: matchingImages });
    }
  });
};

//Delete Gallery Image
const deleteGalleryImage = async (req, res) => {
  const imageName = req.params.imageName;
  const userId = req.params.id;
  const path = `galleryImage/${userId}/${imageName}`;

  try {
    const user = await User.findById(userId);
    user.images = user.images.filter(
      (image) => image.imageFileName !== imageName
    );
    await fileDelete(req, res, path);
    await user.save();
    res.status(200).send({ message: "Image Successfully Deleted" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

exports.addGalleryImages = addGalleryImages;
exports.getGalleryImages = getGalleryImages;
exports.searchGalleryImage = searchGalleryImage;
exports.deleteGalleryImage = deleteGalleryImage;
