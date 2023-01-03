const router = require("express").Router();

const usersController = require("../controller/users-controller");
const checkAuth = require("../middleware/check-auth");
const { upload } = require("../middleware/file-manage");

//SignUp API
router.post("/signup", upload.single("avatarImage"), usersController.signup);

//Login API
router.post("/login", usersController.login);

router.use(checkAuth);

//Get User Details API
router.get("/:id", usersController.getUser);

//Update User API
router.put("/:id", upload.single("avatarImage"), usersController.updateUser);

module.exports = router;
