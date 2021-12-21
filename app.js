const express=require('express');
const mongoose = require('mongoose');
const app= express();
const auth = require('./routes/auth');
const users = require('./routes/users');
const  dbURI = "mongodb://localhost/authentication"

app.use(express.json())
app.use(auth);
app.use('/users', users)

mongoose.connect(dbURI , {useNewUrlParser: true, useUnifiedTopology: true})
const db = mongoose.connection

db.on("error", (err)=>{console.error(err)})
db.once("open", () => {console.log("DB started successfully")})

app.listen(3000, () => {console.log("Server started: 3000")})

