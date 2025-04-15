const express = require("express");
const usersTableController = require("./controllers/usersTableController");
require("dotenv").config();
const cors = require("cors");


const app = express();
const PORT = 3001;

app.use(cors({
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
  ]
}));

app.use(express.json());

app.post('/api/createaccount', usersTableController.createAccount)
app.post('/api/confirmaccount', usersTableController.confirmAccount)
app.post('/api/loginaccount', usersTableController.loginAccount)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
