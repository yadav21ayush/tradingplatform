const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/order');
const {buyBTC,sellBTC,getPrice} = require("./services/amm");
const bcrypt = require("bcryptjs")


mongoose.connect("mongodb://127.0.0.1:27017/exchange")
  

app.use(express.json());

app.post('/auth/register',async function(req,res){
    const{ email,password} = req.body
    try{
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).send("user already exists")
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({
            email,
            password:hashedPassword
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

app.post("/trade/buy",async function(req,res){
    try{
        const{userID,usdtAmount}= req.body
        const user = await User.findById(userId)
        if(!user) return res.status(400).send("user not found ")
            if(user.balances.USDT < usdtAmount) {
                return res.status(400).send("insufficient USDT")
            }
            const result =buyBTC(usdtAmount)
            user.balances.USDT -= usdtAmount
            user.balances.BTC += result.btcRecieved 
            await user.save()
            res.send({
                message:"Trade successful",
                btcRecieved: result.btcRecieved,
                price: result.price
            })

    }catch(error){
        console.log(error)
        res.status(500).send("error executing trade")
    }
})

app.post("/trade/sell",async function(req,res){
    try{
        const{userId,btcAmount}=req.body
        const user = await User.findById(userId)
        if(!user) return res.status(400).send("user not found")
            if(user.balances.BTC < btcAmount){
                return res.status(400).send("insufficient BTC")
          }
        const result = sellBTC(btcAmount)
        user.balances.BTC -= btcAmount
        user.balances.USDT += result.usdtRecieved
        await user.save()
        res.send({
            message:"trade successfully",
            usdtRecieved: result.usdtRecieved,
            price:result.price
        })
    }catch(error){
        console.log(error)
        res.status(500).send("error execution trade")
    }
})

app.get('/price',function(req,res){

    res.send({
        price:getPrice()
    })
})

app.get('/',function(req,res){
res.send("server working");
})

app.listen(3000,function(){
    console.log("server started")
})