const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/User');
const Order = require('./models/order');
const {buyBTC,sellBTC,getPrice} = require("./services/amm");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require('dotenv').config();   
const authMiddleware = require("./middleware/auth")
const cors = require("cors")
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/exchange")
  

app.use(express.json());

app.post('/auth/register',async function(req,res){
    const{ email,password} = req.body
    try{
        const existingUser = await User.findOne({email})
        if(existingUser){
            return res.status(400).json({ message: "User already exists" })
        }
        const hashedPassword = await bcrypt.hash(password,10)
        const user = new User({
            email,
            password:hashedPassword
        })
        await user.save()
        res.json({ message: "User registered successfully" })
    }
    catch(err){
        res.status(500).json({ message: "Error saving user" + err.message })
    }
})

app.post("/auth/login",async function(req,res){
    try{
        const{email,password}= req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(400).json({ message: "user not found " })
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({ message: "invalid password" })
        }

        const token = jwt.sign(
            { id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )
        res.json({token})
    }catch(error){
        res.status(500).send("login error")
    }
})

app.post('/order',authMiddleware,async function(req,res){
    try{
    const {type,amount}=req.body
    const userId = req.user.id
   
    if(!userId || !type || !amount ){
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

app.post("/trade/buy",authMiddleware,async function(req,res){
    try{
        const {usdtAmount}= req.body
        const userId = req.user.id

        if(!usdtAmount || usdtAmount <=0){
            return res.status(400).send("invalid amount")
        }

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

app.post("/trade/sell",authMiddleware,async function(req,res){
    try{
        const {btcAmount}=req.body
        const userId = req.user.id
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


app.get('/balance',authMiddleware,async function(req,res){
    try{
        const userId = req.user.id
        const user = await User.findById(userId)

        res.json({
            BTC: user.balances.BTC,
            USDT: user.balances.USDT
        })
    }catch(error){
        res.status(500).json({message:"error fetching "})
    }

})

app.listen(5000,function(){
    console.log("server started")
})