const express = require('express')
const app = express()
const port = 8000
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const multer = require("multer")
const routes = require('./routes');
const cors = require("cors")
const path = require('path')

// Middleware xử lý JSON body
app.use(express.json());
const corsOptions ={
  origin: ['http://localhost:3000','http://localhost:5173', ] ,
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(console.log("Connected to MongoDB")).catch((err) => console.log(err))

app.use('/images', express.static(path.join(__dirname, 'images')))
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    const fileName = req.body.name || Date.now() + '-' + file.originalname;
    cb(null, fileName); // Đặt tên file
  },
});

const upload = multer({ storage: storage });
app.post("/api/v1/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use('/api/v1', routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})