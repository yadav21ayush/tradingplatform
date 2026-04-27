import {useState} from 'react' ;

function App(){

  const[email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const[usdt,setUsdt] = useState("")
  const [btc,setBtc] = useState("") 
  const [balance,setBalance] = useState({BTC: 0, USDT: 0})


//   async function getPrice(){
//   const res = await fetch("http://localhost:5000/price")
//   const data = await res.json()
//   setPrice(data.price)
// }

async function handleRegister(){
  const res = await fetch("http://localhost:5000/auth/register",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
    email,
    password
    })
  }
  )
  const data = await res.json()
 
  if(res.ok){
    alert("registration successful")
  }else{
    alert(data.message||"registration failed")
  }
}

async function handleLogin(){

  const res = await fetch("http://localhost:5000/auth/login",{
method:"POST",
headers:{
  "Content-Type":"application/json"
},
body: JSON.stringify({
  email,
  password
})
})
console.log("response recieved")
  const data = await res.json()
  if(data.token){
    localStorage.setItem("token",data.token)
    alert("login successful")
      getBalance()
    
  }else{
    alert("login failed"||data.message)
  }
}

async function handleBuy(){
  const token = localStorage.getItem("token")
const res= await fetch("http://localhost:5000/trade/buy",{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
    "Authorization":`Bearer ${token}`
  },
  body: JSON.stringify({
    usdtAmount: Number(usdt)
  })
})
const data = await res.json()
if(res.ok){
  alert(`bought btc:${data.btcRecieved}`)
}else{
  alert(data.message || "buy failed")
}
getBalance()
}

async function handleSell(){
 const token = localStorage.getItem("token")
const res = await fetch("http://localhost:5000/trade/sell",{
  method:"POST",
  headers:{
    "Content-Type":"application.json",
    "Authorization":`Bearer${token}`
  },
  body: JSON.stringify({
    btcAmount:Number(btc)
  })
})
const data = await res.json()
if(res.ok){
  alert(`sold btc for usdt:${data.usdtRecieved}`)
}else{
  alert(data.message || "sell failed")
}
getBalance()
}

async function getBalance(){
  const token = localStorage.getItem("token")
  const res = await fetch("http://localhost:5000/balance",{
    headers:{
    "Authorization": `Bearer ${token}`
  }
  })
  const data = await res.json()
  setBalance(data) 
}

  return(
  <>
  <div>
    <input 
   placeholder="Email"
   onChange={(e) => setEmail(e.target.value)}
    />
    <input
    type = "password"
    placeholder="password"
    onChange={(e) => setPassword(e.target.value)}
    />
    <br/>
    <br/>
     <button onClick={handleRegister}>Register</button>
    <button onClick={handleLogin}>login</button>
    <input
    placeholder="USDT amount"
    onChange={(e) => setUsdt(e.target.value)}></input>
    <button onClick={handleBuy}>Buy BTC</button>
    <input
    placeholder="BTC amount"
    onChange={(e) => setBtc(e.target.value)}></input>
    <button onClick={handleSell}>Sell BTC</button>
   </div>
   <div>
    <h3>Balances</h3>
<p>BTC: {balance.BTC}</p>
<p>USDT: {balance.USDT}</p>
   </div>

  </>
  )
}


export default App;