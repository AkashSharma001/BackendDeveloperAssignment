const router = require("express").Router();

const galleryController = require("../controller/gallery-controller");
const checkAuth = require("../middleware/check-auth");
const { upload } = require("../middleware/file-manage");

router.use(checkAuth);

//Add Image API
router.put(
  "/upload/:id",
  upload.array("images"),
  galleryController.addGalleryImages
);
//Get Image API
router.get("/images/:id", galleryController.getGalleryImages);

//Search Image API
router.get("/search", galleryController.searchGalleryImage);

//Delete Image API
router.delete("/delete/:id/:imageName", galleryController.deleteGalleryImage);

module.exports = router;
