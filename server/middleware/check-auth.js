const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res
        .status(200)
        .send({ status: "403", message: "Authentication Failed!" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (err) {
    res.status(200).send({ status: "403", message: "Authentication Failed!" });
    return next(err);
  }
};
