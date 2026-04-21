const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    balances:{
        BTC:{type: Number, default: 0},
        USDT:{type:Number, default: 1000}
    }
})

module.exports=mongoose.model("User",userSchema)