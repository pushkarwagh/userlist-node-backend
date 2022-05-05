const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');

const userModel = require("./models/userSchema.js");

const app = express()
app.use(express.json())

exports.auth = async(req,res,next) =>{
  const checkUser = req.body;
  console.log("Middleware checkuser--",checkUser.email)
  
  const users = await userModel.find({email: checkUser.email });
  //users.toString() - returns obj instead of array...

  if (users.length > 0 ) {
    if(checkUser.email === users[0].email) {
      bcrypt.compare(checkUser.password, users[0].password , (err,response) => {
        if(response) {
          next()
        } else {
          res.status(500).send("password invalid!!");
        }
      })  //bcrypt close...
    }
  }
  else {
    res.status(500).send("email invalid!!");
  } 
};

exports.verifyToken = async(req,res,next) => {
  try {
    const token = req.headers.authorization;
    const verified =jwt.verify(token , process.env.JWT_SECRET_KEY);
    req.token= verified;
    next();
  } catch (error) {
    res.status(401).send(error);
  }
}