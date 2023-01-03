const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const PORT = process.env.PORT || 4000;

//IMPORT ROUTES

const galleryRoute = require("./routes/gallery-routes");
const userRoute = require("./routes/user-routes");

dotenv.config();

//CONNECTION TO DATABASE

mongoose.connect(
  `${process.env.DB_URL}`,
  { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: true },
  () => console.log("connected to db")
);
//MIDDLEWARE

app.use(express.json(), cors());

//ROUTE MIDDLEWARE

app.use("/api/user", userRoute);
app.use("/api/gallery", galleryRoute);

app.get("/", (req, res) => {
  res.send(`<h3>Hey! Web Gallery Backend is up !</h3>`);
});

app.listen(PORT, () => console.log(`server up and running at  ${PORT}`));
