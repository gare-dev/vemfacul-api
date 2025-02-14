const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "INVEST" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
