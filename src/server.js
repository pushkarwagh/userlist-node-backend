const express = require('express');
const dot_env = require('dotenv');
var cors = require('cors');

require('./connection.js');
const routes = require('./routes.js');

const app = express();

app.use(express.static('public'))
app.use(express.json());
app.use(cors());
app.use(routes);

dot_env.config();
const port = process.env.PORT || 8000 ;
console.log("dote env ==>",process.env.PORT) 

app.listen(port ,() => 
    console.log( `server listening on ${port}`)
);