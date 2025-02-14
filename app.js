const express = require("express");
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "INVEST" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
