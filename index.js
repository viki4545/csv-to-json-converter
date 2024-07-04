const express = require("express");
const dotenv = require("dotenv");
const csvRouter = require("./routers/csvRouters.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use("/csv", csvRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
