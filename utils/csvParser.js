const fs = require("fs");

const parseCSV = (filePath) => {
  const data = fs.readFileSync(filePath, "utf-8");
  const rows = data
    .trim()
    .split("\n")
    .map((row) => row.split(","));
  const headers = rows.shift();

  return rows.map((row) => {
    const obj = {};
    row.forEach((value, index) => {
      const keys = headers[index].split(".");
      keys.reduce((acc, key, i) => {
        if (i === keys.length - 1) {
          acc[key] = value.trim();
        } else {
          acc[key] = acc[key] || {};
        }
        return acc[key];
      }, obj);
    });
    return obj;
  });
};

module.exports = parseCSV;
