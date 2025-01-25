import { useState } from 'react'
import './App.css'

function App() {
  let [count, setCount] = useState(0);

const addValue = ()=>{
  if(count < 20){
    setCount(count + 1);
  }
}

const deletValue = ()=>{
  if(count > 0 ){
    setCount(count - 1);
  }
}

  return (
    <>
      <h1>Meena JI </h1>
      <h2>Counter Value {count}</h2>
      <button onClick={addValue}>Add Value</button>
      <br />
      <button onClick={deletValue}>Delete Value</button>
    </>
  )
}

export default App
