const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const { fileDelete, avatarImageUpload } = require("../middleware/file-manage");
const User = require("../models/user");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string()
    .min(6)
    .required()
    .email({ tlds: { allow: false } }),
  password: Joi.string().min(6).required(),
  phone: Joi.string().min(10).required(),
  address: Joi.string().min(6).required(),
});
const loginSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .required()
    .email({ tlds: { allow: false } }),
  password: Joi.string().min(6).required(),
});

//SignUp User
const signup = async (req, res) => {
  //CHECK IF Email ID ALREADY EXISTS
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    res.status(200).send({ status: "400", message: "Email Already Exists" });
    return;
  }
  //CHECK IF Phone ALREADY EXISTS
  const phoneExist = await User.findOne({ phone: req.body.phone });
  if (phoneExist) {
    res.status(200).send({ status: "400", message: "Phone Already Exists" });
    return;
  }

  //HASHING THE PASSWORD

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    password: hashedPassword,
    address: req.body.address,
  });

  try {
    //VALIDATION OF USER INPUTS
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) {
      res.status(200).send({ status: "500", message: error });
    } else {
      //If User Add Avatar Then Image will Upload
      if (req.file) {
        user.avatarImage = await avatarImageUpload(req, res, user._id);
      }
      //THE USER IS ADDED
      await user.save();
      //CREATE TOKEN
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).send({
        status: "200",
        message: {
          token: token,
          userId: user._id,
          name: user.name,
        },
      });
    }
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
};

//SIGNIN USER

const login = async (req, res) => {
  //CHECKING IF EMAIL EXISTS
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(200).send({ status: "400", message: 'Email doesn"t exist' });
    return;
  }
  //Validating User Password
  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) {
    res.status(200).send({ status: "400", message: "Incorrect Password !!!" });
    return;
  }

  try {
    const { error } = await loginSchema.validateAsync(req.body);

    if (error) {
      res.status(200).send({ status: "400", message: error });
      return;
    } else {
      //CREATE TOKEN
      const token = jwt.sign(
        { _id: user._id, email: user.email },
        process.env.JWT_KEY,
        {
          expiresIn: "1h",
        }
      );
      res.status(200).send({
        status: "200",
        message: {
          token: token,
          userId: user._id,
          name: user.name,
        },
      });
    }
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
};

//Finding User Information Using ID
const getUser = async (req, res) => {
  try {
    const results = await User.findById(req.params.id).exec();
    res.status(200).send({ status: "200", message: results });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
};

//Find and Update User Information Using ID
// router.put("/:id", upload.single("avatarImage"),
const updateUser = async (req, res) => {
  const path = `avatarImage/${req.params.id}/${req.body.avatarImage}`;

  try {
    //CHECK IF Phone ALREADY EXISTS

    if (req.file) {
      await User.findByIdAndUpdate(req.params.id, {
        ...req.body,
        avatarImage: await avatarImageUpload(req, res, req.params.id),
      });
      //User change their avatar image then previous Image will delete
      await fileDelete(req, res, path);
    } else {
      await User.findByIdAndUpdate(req.params.id, {
        ...req.body,
      });
    }

    res
      .status(200)
      .send({ status: "200", message: "Successfully Edited your profile" });
  } catch (err) {
    res.status(200).send({ status: "500", message: err });
  }
};

exports.getUser = getUser;
exports.updateUser = updateUser;
exports.signup = signup;
exports.login = login;
