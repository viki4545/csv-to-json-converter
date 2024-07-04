const pool = require("../config/conn.js");
const parseCSV = require("../utils/csvParser");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const csvFilePath = process.env.CSV_FILE_PATH;

console.log(csvFilePath);

const uploadCSVData = async (req, res) => {
  try {
    const users = parseCSV(csvFilePath);

    for (const user of users) {
      const { name, age, ...rest } = user;
      const fullName = `${name.firstName} ${name.lastName}`;
      const address = {};
      const additional_info = {};

      for (const key in rest) {
        if (key.startsWith("address.")) {
          address[key.replace("address.", "")] = rest[key];
        } else {
          additional_info[key] = rest[key];
        }
      }

      await pool.query(
        "INSERT INTO public.users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)",
        [
          fullName,
          age,
          JSON.stringify(address),
          JSON.stringify(additional_info),
        ]
      );
    }

    res.status(200).send("CSV data uploaded successfully.");
  } catch (error) {
    console.error("Error uploading CSV data:", error);
    res.status(500).send("Internal Server Error");
  }
};

const calculateAgeDistribution = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT age FROM public.users");

    const ageDistribution = {
      "< 20": 0,
      "20 to 40": 0,
      "40 to 60": 0,
      "> 60": 0,
    };
    const totalUsers = rows.length;

    rows.forEach(({ age }) => {
      if (age < 20) ageDistribution["< 20"] += 1;
      else if (age <= 40) ageDistribution["20 to 40"] += 1;
      else if (age <= 60) ageDistribution["40 to 60"] += 1;
      else ageDistribution["> 60"] += 1;
    });

    for (const group in ageDistribution) {
      ageDistribution[group] = (ageDistribution[group] / totalUsers) * 100;
    }

    console.log("Age-Group % Distribution:", ageDistribution);
    res.status(200).json(ageDistribution);
  } catch (error) {
    console.error("Error calculating age distribution:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  uploadCSVData,
  calculateAgeDistribution,
};
