const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/order');

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

app.post('/order',async function(req,res){
    try{
    const {userID,type,amount}=req.body
   
    if(!userID || !type || !amount ){
        return res.status(400).send("missing fields")
     }
     if(!["buy","sell"].includes(type)){
        return res.status(400).send("invalid order type")
     }
     if (amount <= 0 ){
        return res.status(400).send("amount must be greater than 0")
     }
     const newOrder = new Order({
        userID,
        type,
        amount,
        
     })
        await newOrder.save()
        res.send({
            message:"order place successfully",
            order:newOrder
        })
    }catch(error){
        console.log(error)
        res.status(500).send("server error")
    }

})

app.get('/orders', async function(req,res){
    try{
        const orders = await Order.find()
        res.send(orders)
    }catch(error){
        console.log(error)
        res.status(500).send('error fetching orders')
    }
})

app.get('/',function(req,res){
res.send("server working");
})

app.listen(3000,function(){
    console.log("server started")
})