import {useState} from 'react' ;

function App(){
  const[price,setPrice]= useState(0)

  async function getPrice(){
  const res = await fetch("http://localhost:3000/price")
  const data = await res.json()
  setPrice(data.price)
}
  return<>
  <div>
    <h1>trading app</h1>
    <button onClick={getPrice}>Get Price</button>
    <p>Price:{price}</p>
  </div>
  </>
}


export default App;