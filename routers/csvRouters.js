const { Router } = require("express");

const {
  uploadCSVData,
  calculateAgeDistribution,
} = require("../controllers/csvController.js");

const csvRouter = Router();

csvRouter.get("/upload-csv", uploadCSVData);
csvRouter.get("/age-distribution", calculateAgeDistribution);

module.exports = csvRouter;
