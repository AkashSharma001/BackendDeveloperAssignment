const { v1: uuidv1 } = require("uuid");
const { diskStorage } = require("multer");
const multer = require("multer");
const { ref, uploadBytes, deleteObject } = require("firebase/storage");
const storage = require("../firestore/firebase");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const memoStorage = multer.memoryStorage();
const upload = multer({ memoStorage });

//Upload Avatar Image To FireStore
const avatarImageUpload = async (req, res, userId) => {
  const file = req.file;
  const ext = MIME_TYPE_MAP[file.mimetype];
  const fileName = uuidv1() + "." + ext;
  const imageRef = ref(storage, `avatarImage/${userId}/${fileName}`);
  const metatype = { contentType: file.mimetype, name: file.originalname };
  await uploadBytes(imageRef, file.buffer, metatype)
    .then((snapshot) => {})
    .catch((err) => console.log(err.message));
  return fileName;
};

//Upload Gallery Images To FireStore
const galleryImagesUpload = async (req, res, index, userId) => {
  const file = req.files[index];
  const ext = MIME_TYPE_MAP[file.mimetype];
  const fileName = uuidv1() + "." + ext;
  const imageRef = ref(storage, `galleryImage/${userId}/${fileName}`);
  const metatype = { contentType: file.mimetype, name: file.originalname };
  await uploadBytes(imageRef, file.buffer, metatype)
    .then((snapshot) => {})
    .catch((err) => console.log(err.message));
  return fileName;
};

//Delete Image To FireStore
const fileDelete = async (req, res, path) => {
  const deleteRef = ref(storage, path);
  await deleteObject(deleteRef)
    .then((res) => console.log("deleted"))
    .catch((err) => console.log("does-not-exist"));
};

exports.upload = upload;
exports.avatarImageUpload = avatarImageUpload;
exports.galleryImagesUpload = galleryImagesUpload;
exports.fileDelete = fileDelete;
