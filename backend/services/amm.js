let pool ={
    btc:10,
    usdt:500000
}

function getPrice(){
    return pool.usdt/pool.btc
}

function buyBTC(usdtAmount){
    const k = pool.btc*pool.usdt
    const oldBTC = pool.btc
    pool.usdt+=usdtAmount
    pool.btc=k/pool.usdt
    const btcRecieved=oldBTC - pool.btc
    return {
        btcRecieved,
        price:getPrice()
    }
}

function sellBTC(btcAmount){
    const k = pool.btc*pool.usdt
    const oldUSDT = pool.usdt
    pool.btc+=btcAmount
    pool.usdt= k/pool.btc

    const usdtRecieved = oldUSDT - pool.usdt
    return{
        usdtRecieved,
        price: getPrice()
    }
}
module.exports ={
    buyBTC,
    sellBTC,
    getPrice,
    pool
}