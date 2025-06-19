const express = require("express");
const usersTableController = require("./controllers/usersTableController");
const cors = require("cors");
require("dotenv").config();
const upload = require("./config/multer");
const cookieParser = require("cookie-parser");
const eventsTableController = require("./controllers/eventsTableController");
const personalEventsTableController = require("./controllers/personalEventsTableController");
const postagensTableController = require('./controllers/postagensController');


const app = express();
const PORT = 3001;

app.use(cors({
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
  ]
}));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    message: process.env.DATABASE_URL
  })
})

app.post('/api/createaccount', usersTableController.createAccount)
app.post('/api/confirmaccount', usersTableController.confirmAccount)
app.post('/api/forgotpassword', usersTableController.forgotPassword)
app.post('/api/resetpassword', usersTableController.resetPassword)
app.post('/api/loginaccount', usersTableController.loginAccount)
app.post('/api/registeraccount', upload.single("imagem"), usersTableController.registerAccount)
app.post('/api/createevent', upload.single("imagem"), eventsTableController.createEvent)
app.post('/api/getevents', eventsTableController.getEvents)
app.post('/api/insertpevennts', personalEventsTableController.insertPersonalEvent)
app.post('/api/getpevents', personalEventsTableController.getPersonalEvents)
app.post('/api/insertpelocal', personalEventsTableController.insertPersonalLocalEvent)
app.post('/api/deletepevents', personalEventsTableController.deletePersonalEvent)
app.post('/api/getuserprofile', usersTableController.getUserProfile)
app.post('/api/editprofile', upload.fields([{ name: "foto", maxCount: 1 }, { name: "header", maxCount: 1 }]), usersTableController.editProfile)
app.post('/api/createPostagem', postagensTableController.createPostagem);
app.post('/api/postagens/:username', postagensTableController.getPostagem)
app.post('/api/likePostagem/:id/like', postagensTableController.likePostagem)
app.post('/api/likePostagem/:id/unlike', postagensTableController.unlikePostagem)


app.listen(PORT, () => {
  console.log(`Server is now running on port ${PORT}`);
});
