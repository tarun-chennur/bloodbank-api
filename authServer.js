require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const app = express()
const JWT_SECRET=process.env.JWT_SECRET
const userRouter = require('./routes/user');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
})



app.listen(4000)
app.use(express.json())
app.use(userRouter)