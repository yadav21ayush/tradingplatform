const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect("")

app.use(express.json());

app.get('/',function(req,res){
res.send("server working");
})

app.listen(3000,function(){
    console.log("server started")
})