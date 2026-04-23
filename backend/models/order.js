const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userId: String,
    type: {String,
        enum:["buy","sell"],
    },
    amount: Number,
    price: Number,
    status:{type:String, default:"open"},
    timestamp:{type:Date, default:Date.now}
})

module.exports=mongoose.model("Order",userSchema)