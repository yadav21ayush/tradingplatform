const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect("mongodb://127.0.0.1:27017/exchange")
  

app.use(express.json());

app.post('/register',async function(req,res){
    const{ email,password} = req.body
    try{
        const user = new User({
            email,
            password
        })
        await user.save()
        res.send("User registered successfully")
  
        
    }
    catch(err){
        res.status(500).send("Error saving user" + err.message)
    }
})

app.get('/',function(req,res){
res.send("server working");
})

app.listen(3000,function(){
    console.log("server started")
})