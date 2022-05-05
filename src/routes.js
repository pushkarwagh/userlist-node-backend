const express = require('express')
const multer = require('multer')
const UserRegister = require ("./models/userSchema");
const controller = require('./controllers.js')
const middleware = require('./middlewares.js')

const app = express()
app.use(express.json())

const storage = multer.diskStorage({
  destination:(req, file, callback) => {
    callback(null,'./public/')
  },
  filename : (req, file, callback) => {
    callback(null, file.originalname)
  },
})

const upload = multer({storage: storage});

app.get('/all', controller.getAll);
app.get('/user/:id',middleware.verifyToken, controller.getUser)

app.get('/team/:id',middleware.verifyToken, controller.getTeam)
app.patch('/editProfile/:id', middleware.verifyToken, upload.single('profile'), controller.uploadProfile)
app.post('/add/:id', middleware.verifyToken, upload.single("profile"), controller.addUser)

app.post('/register', upload.single("profile"), controller.createUser)
app.post('/login', controller.loginUser)

app.patch('/edit/:id', middleware.verifyToken, controller.updateUser)
app.delete('/delete', middleware.verifyToken, controller.deleteUser)

module.exports = app;